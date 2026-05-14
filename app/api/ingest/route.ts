// api cleint for data ingestion
import { NextRequest, NextResponse } from 'next/server';
import { processUrl } from '@/lib/ingestion';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const items = await processUrl(url);

    return NextResponse.json({
      success: true,
      message: `Successfully ingested ${items.length} items`,
      items,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An error occurred during ingestion' },
      { status: 500 }
    );
  }
}
