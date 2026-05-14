// app/api/ingest/route.ts

import { NextRequest, NextResponse } from 'next/server';

import { processUrl } from '@/lib/ingestion';

export async function POST(req: NextRequest) {
  try {
    console.log('\n====================================');
    console.log('API INGEST REQUEST RECEIVED');
    console.log('====================================');

    const { url } = await req.json();

    console.log(`Incoming URL: ${url}`);

    if (!url) {
      console.log('No URL provided');

      return NextResponse.json(
        {
          error: 'URL is required',
        },
        {
          status: 400,
        }
      );
    }

    // ======================================
    // RUN INGESTION PIPELINE
    // ======================================

    const result = await processUrl(url);

    console.log('\n====================================');
    console.log('INGESTION FINISHED');
    console.log('====================================');

    console.log(
      `Documents processed: ${result.documents.length}`
    );

    console.log(
      `Chunks created: ${result.chunks.length}`
    );

    // ======================================
    // RETURN RESPONSE
    // ======================================

    return NextResponse.json({
      success: true,

      message: `Successfully processed ${result.documents.length} documents into ${result.chunks.length} chunks`,

      documents: result.documents,

      chunks: result.chunks,
    });
  } catch (error: any) {
    console.error('\n====================================');
    console.error('INGESTION PIPELINE FAILED');
    console.error('====================================');

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