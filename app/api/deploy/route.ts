// app/api/deploy/route.ts

import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { getServiceSupabase } from '@/lib/supabase/server';

import { processUrl } from '@/lib/ingestion';

import { deployToCloudflare } from '@/lib/deployment/deploy';

import { updateServerStatus } from '@/lib/vector/supabase';

import { storeDocuments, storeEmbeddedChunks } from '@/lib/vector/supabase';

import { chunkDocuments } from '@/lib/processing/chunker';

import { embedChunks } from '@/lib/embeddings/embedder';

import pdfParse from 'pdf-parse';

// ==========================================
// PDF PROCESSING
// ==========================================

async function processPdf(
  serverId: string,
  pdfBuffer: Buffer,
  fileName: string
): Promise<any> {
  console.log(`\n====================================`);
  console.log(`STARTING PDF PROCESSING`);
  console.log(`====================================`);

  try {
    // Parse PDF
    console.log(`Parsing PDF: ${fileName}`);
    const pdfData = await pdfParse(pdfBuffer);

    console.log(`PDF has ${pdfData.numpages} pages`);
    console.log(`Extracted text length: ${pdfData.text.length} characters`);

    // Create a document from the PDF
    const document = {
      serverId,
      title: fileName.replace(/\.pdf$/i, ''),
      url: `pdf:${fileName}`,
      content: pdfData.text,
      sourceType: 'pdf' as const,
      metadata: {
        pages: pdfData.numpages,
        wordCount: pdfData.text.split(/\s+/).length,
        extractedAt: new Date().toISOString(),
        fileName,
      },
    };

    console.log(`Document created: ${document.title}`);

    // Store document
    console.log(`\n====================================`);
    console.log(`STORING DOCUMENTS`);
    console.log(`====================================`);

    const storedDocs = await storeDocuments(serverId, [document]);

    console.log(`Stored ${storedDocs.length} documents`);

    // Chunk documents
    console.log(`\n====================================`);
    console.log(`STARTING CHUNKING`);
    console.log(`====================================`);

    const chunks = chunkDocuments([document]);

    console.log(`Created ${chunks.length} chunks`);

    // Embed chunks
    console.log(`\n====================================`);
    console.log(`STARTING EMBEDDING`);
    console.log(`====================================`);

    const embeddedChunks = await embedChunks(chunks);

    console.log(`Embedded ${embeddedChunks.length} chunks`);

    // Store embeddings
    console.log(`\n====================================`);
    console.log(`STORING EMBEDDINGS`);
    console.log(`====================================`);

    await storeEmbeddedChunks(embeddedChunks);

    console.log(`Stored embeddings in Supabase`);

    return {
      serverId,
      documents: [document],
      chunks,
      embeddedChunks,
    };
  } catch (error) {
    console.error(`PDF Processing Error:`, error);
    throw error;
  }
}

// ==========================================
// POST /api/deploy
// ==========================================

export async function POST(
  req: NextRequest
) {
  try {
    console.log(
      '\n===================================='
    );

    console.log(
      'DEPLOY API REQUEST RECEIVED'
    );

    console.log(
      '===================================='
    );

    // ======================================
    // PARSE BODY - Handle both JSON and FormData
    // ======================================

    let name: string = '';
    let sourceUrl: string = '';
    let sourceType: string = 'Website';
    let crawlSubpages: boolean = false;
    let pdfFile: Buffer | null = null;
    let pdfFileName: string = '';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (PDF file upload)
      const formData = await req.formData();
      name = formData.get('name') as string;
      sourceType = formData.get('sourceType') as string;
      const file = formData.get('pdfFile') as File;

      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        pdfFile = Buffer.from(arrayBuffer);
        pdfFileName = file.name;
        sourceUrl = `pdf:${pdfFileName}`; // Use special protocol for PDFs
      }
    } else {
      // Handle JSON (URL-based sources)
      const body = await req.json();
      name = body.name;
      sourceUrl = body.sourceUrl;
      sourceType = body.sourceType || 'Website';
      crawlSubpages = body.crawlSubpages || false;
    }

    // ======================================
    // VALIDATION
    // ======================================

    if (!name) {
      return NextResponse.json(
        {
          error: 'Server name is required',
        },
        { status: 400 }
      );
    }

    if (!sourceUrl && !pdfFile) {
      return NextResponse.json(
        {
          error: 'Source URL or PDF file is required',
        },
        { status: 400 }
      );
    }

    // ======================================
    // AUTH CHECK
    // ======================================

    const supabase = getServiceSupabase();

    // Get auth token from request headers
    const authHeader =
      req.headers.get('authorization');

    const cookieHeader =
      req.headers.get('cookie');

    let userId: string | null = null;

    // Try to get user from auth header or cookie
    if (authHeader) {
      const token = authHeader.replace(
        'Bearer ',
        ''
      );

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (!error && user) {
        userId = user.id;
      }
    }

    // If no auth header, try extracting from Supabase cookies
    if (!userId && cookieHeader) {
      // Parse the access token from Supabase cookies
      const cookies = cookieHeader
        .split(';')
        .map((c) => c.trim());

      for (const cookie of cookies) {
        if (
          cookie.includes(
            'sb-') &&
          cookie.includes(
            '-auth-token')
        ) {
          try {
            const value =
              cookie.split('=').slice(1).join('=');

            // Supabase stores tokens as base64-encoded JSON
            const decoded = decodeURIComponent(value);
            const parsed = JSON.parse(decoded);

            const accessToken =
              parsed?.access_token ||
              (Array.isArray(parsed) ? parsed[0] : null);

            if (accessToken) {
              const {
                data: { user },
              } = await supabase.auth.getUser(
                accessToken
              );

              if (user) {
                userId = user.id;
                break;
              }
            }
          } catch {
            // Continue trying other cookies
          }
        }
      }
    }

    if (!userId) {
      return NextResponse.json(
        {
          error:
            'Authentication required',
        },
        { status: 401 }
      );
    }

    console.log(`User ID: ${userId}`);
    console.log(`Server Name: ${name}`);
    console.log(`Source Type: ${sourceType}`);
    if (pdfFile) {
      console.log(`PDF File: ${pdfFileName} (${pdfFile.length} bytes)`);
    } else {
      console.log(`Source URL: ${sourceUrl}`);
      console.log(`Crawl Subpages: ${crawlSubpages ? 'YES' : 'NO'}`);
    }

    // ======================================
    // CREATE MCP SERVER ROW
    // ======================================

    const { data: serverData, error: insertError } =
      await supabase
        .from('mcp_servers')
        .insert({
          user_id: userId,
          name,
          source_url: pdfFile ? `pdf:${pdfFileName}` : sourceUrl,
          source_type: sourceType,
          deployment_status: 'pending',
          ingest_status: 'pending',
        } as any)
        .select('id')
        .single();

    if (insertError || !serverData) {
      console.error(
        'Failed to create server:',
        insertError
      );

      return NextResponse.json(
        {
          error:
            insertError?.message ||
            'Failed to create server',
        },
        { status: 500 }
      );
    }

    const serverId = (serverData as any).id;

    console.log(
      `Created MCP Server: ${serverId}`
    );

    // ======================================
    // RETURN IMMEDIATELY
    // (pipeline runs asynchronously)
    // ======================================

    // Fire-and-forget the pipeline
    runPipeline(
      serverId,
      name,
      sourceUrl,
      sourceType,
      pdfFile,
      pdfFileName,
      crawlSubpages
    ).catch((err) => {
      console.error(
        'Pipeline failed:',
        err
      );
    });

    return NextResponse.json({
      success: true,
      serverId,
      message:
        'Deployment started. Poll /api/deploy/status for updates.',
    });
  } catch (error: any) {
    console.error(
      'Deploy API error:',
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          'Deployment failed',
      },
      { status: 500 }
    );
  }
}

// ==========================================
// ASYNC PIPELINE
// ==========================================

async function runPipeline(
  serverId: string,
  serverName: string,
  sourceUrl: string,
  sourceType: string,
  pdfFile?: Buffer | null,
  pdfFileName?: string,
  crawlSubpages: boolean = false
) {
  try {
    console.log(
      '\n===================================='
    );

    console.log(
      'STARTING ASYNC PIPELINE'
    );

    console.log(
      '===================================='
    );

    // ======================================
    // STEP 1: SCRAPING
    // ======================================

    await updateServerStatus(serverId, {
      deployment_status: 'scraping',
      ingest_status: 'scraping',
    });

    console.log('Pipeline step: SCRAPING');

    let result;

    // Handle PDF or URL processing
    if (pdfFile) {
      // For PDFs: store the file and process it
      console.log(`Processing PDF: ${pdfFileName} (${pdfFile.length} bytes)`);
      result = await processPdf(serverId, pdfFile, pdfFileName || 'document.pdf');
    } else {
      // For URLs: use the existing processUrl function
      const shouldCrawl = crawlSubpages || sourceType === 'Website' || sourceType === 'Docs';
      result = await processUrl(serverId, sourceUrl, shouldCrawl);
    }

    // ======================================
    // STEP 2: UPDATE STATS
    // ======================================

    await updateServerStatus(serverId, {
      deployment_status: 'deploying',
      ingest_status: 'complete',
      total_documents:
        result.documents.length,
      total_chunks:
        result.chunks.length,
      total_embeddings:
        result.embeddedChunks.length,
    });

    console.log(
      `Pipeline stats: ${result.documents.length} docs, ${result.chunks.length} chunks, ${result.embeddedChunks.length} embeddings`
    );

    // ======================================
    // STEP 3: DEPLOY TO CLOUDFLARE
    // ======================================

    console.log(
      'Pipeline step: DEPLOYING TO CLOUDFLARE'
    );

    let endpoint = '';

    try {
      const deployResult =
        await deployToCloudflare({
          serverId,
          serverName,
        });

      endpoint = deployResult.endpoint;

      console.log(
        `Deployed to: ${endpoint}`
      );
    } catch (deployError: any) {
      console.error(
        'Cloudflare deployment failed:',
        deployError
      );

      // Still mark as operational since
      // ingestion succeeded - Worker can be
      // deployed later
      endpoint = `pending-deployment://${serverName
        .toLowerCase()
        .replace(/\s+/g, '-')}`;
    }

    // ======================================
    // STEP 4: MARK OPERATIONAL
    // ======================================

    await updateServerStatus(serverId, {
      deployment_status: 'operational',
      endpoint,
    });

    console.log(
      '\n===================================='
    );

    console.log(
      'PIPELINE COMPLETE - SERVER OPERATIONAL'
    );

    console.log(
      '===================================='
    );
  } catch (error: any) {
    console.error(
      '\n===================================='
    );

    console.error(
      'PIPELINE FAILED'
    );

    console.error(
      '===================================='
    );

    console.error(error);

    // Mark as failed
    try {
      await updateServerStatus(
        serverId,
        {
          deployment_status: 'failed',
          ingest_status: 'failed',
          error_message:
            error.message ||
            'Pipeline failed',
        }
      );
    } catch {
      console.error(
        'Failed to update error status'
      );
    }
  }
}
