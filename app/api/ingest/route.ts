// api cleint for data ingestion
import { NextRequest, NextResponse } from 'next/server';
import { processUrl } from '@/lib/ingestion';
import { chunkItems } from '@/lib/processing/chunker';

export async function POST(req: NextRequest) {
  try {
    const { url, crawlSubpages = true } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const items = await processUrl(url, crawlSubpages);
    const chunks = chunkItems(items, 400, 50);

    return NextResponse.json({
      success: true,
      message: `Successfully ingested ${items.length} items and generated ${chunks.length} chunks.`,
      items,
      chunks,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An error occurred during ingestion' },
      { status: 500 }
    );
  }
}
