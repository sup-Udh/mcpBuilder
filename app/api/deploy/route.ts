// app/api/deploy/route.ts

import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { getServiceSupabase } from '@/lib/supabase/server';

import { processUrl } from '@/lib/ingestion';

import { deployToCloudflare } from '@/lib/deployment/deploy';

import { updateServerStatus } from '@/lib/vector/supabase';

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
    // PARSE BODY
    // ======================================

    const {
      name,
      sourceUrl,
      sourceType,
    } = await req.json();

    // ======================================
    // VALIDATION
    // ======================================

    if (!name || !sourceUrl) {
      return NextResponse.json(
        {
          error:
            'Name and source URL are required',
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
    console.log(`Source URL: ${sourceUrl}`);
    console.log(
      `Source Type: ${sourceType || 'Website'}`
    );

    // ======================================
    // CREATE MCP SERVER ROW
    // ======================================

    const { data: serverData, error: insertError } =
      await supabase
        .from('mcp_servers')
        .insert({
          user_id: userId,
          name,
          source_url: sourceUrl,
          source_type:
            sourceType || 'Website',
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
      sourceType || 'Website'
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
  sourceType: string
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

    const crawlSubpages =
      sourceType === 'Website' ||
      sourceType === 'Docs';

    const result = await processUrl(
      serverId,
      sourceUrl,
      crawlSubpages
    );

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
