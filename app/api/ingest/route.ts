// app/api/ingest/route.ts

import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { v4 as uuidv4 } from 'uuid';

import { processUrl } from '@/lib/ingestion';

export async function POST(
  req: NextRequest
) {
  try {
    console.log(
      '\n===================================='
    );

    console.log(
      'API INGEST REQUEST RECEIVED'
    );

    console.log(
      '===================================='
    );

    // ======================================
    // PARSE BODY
    // ======================================

    const {
      url,
      crawlSubpages,
    } = await req.json();

    console.log(
      `Incoming URL: ${url}`
    );

    console.log(
      `Crawl Subpages: ${
        crawlSubpages
          ? 'YES'
          : 'NO'
      }`
    );

    // ======================================
    // VALIDATION
    // ======================================

    if (!url) {
      return NextResponse.json(
        {
          error:
            'URL is required',
        },
        {
          status: 400,
        }
      );
    }

    // ======================================
    // GENERATE SERVER ID
    // ======================================

    const serverId =
      uuidv4();

    console.log(
      `Generated Server ID: ${serverId}`
    );

    // ======================================
    // RUN INGESTION PIPELINE
    // ======================================

    const result =
      await processUrl(
        serverId,
        url,
        crawlSubpages
      );

    console.log(
      '\n===================================='
    );

    console.log(
      'INGESTION FINISHED'
    );

    console.log(
      '===================================='
    );

    console.log(
      `Server ID: ${serverId}`
    );

    console.log(
      `Documents processed: ${result.documents.length}`
    );

    console.log(
      `Chunks created: ${result.chunks.length}`
    );

    console.log(
      `Embedded chunks: ${result.embeddedChunks.length}`
    );

    // ======================================
    // RETURN RESPONSE
    // ======================================

    return NextResponse.json({
      success: true,

      serverId,

      message: `Successfully processed ${result.documents.length} documents into ${result.chunks.length} chunks`,

      crawlSubpages,

      documents:
        result.documents,

      chunks: result.chunks,
    });
  } catch (error: any) {
    console.error(
      '\n===================================='
    );

    console.error(
      'INGESTION PIPELINE FAILED'
    );

    console.error(
      '===================================='
    );

    console.error(error);

    return NextResponse.json(
      {
        error:
          error.message ||
          'An error occurred during ingestion',
      },
      {
        status: 500,
      }
    );
  }
}