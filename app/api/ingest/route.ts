// api cleint for data ingestion
import { NextRequest, NextResponse } from 'next/server';
import { processUrl } from '@/lib/ingestion';
import { chunkItems } from '@/lib/processing/chunker';
import { embedChunksGemini } from '@/lib/processing/embedder';

export async function POST(req: NextRequest) {
  try {
    const { url, crawlSubpages = true } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const items = await processUrl(url, crawlSubpages);
    const chunks = chunkItems(items, 400, 50);
    
    // Embed the chunks! (Swappable with embedChunksOpenAI)
    const embeddedChunks = await embedChunksGemini(chunks);

    return NextResponse.json({
      success: true,
      message: `Successfully ingested ${items.length} items, generated ${chunks.length} chunks, and embedded them!`,
      items,
      chunks: embeddedChunks,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An error occurred during ingestion' },
      { status: 500 }
    );
  }
}
