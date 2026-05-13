import Parser from 'rss-parser';
import { IngestedItem } from './types';

const parser = new Parser({
  timeout: 10000, // Handle slow feeds gracefully
});

export async function ingestRss(url: string): Promise<IngestedItem[]> {
  try {
    const feed = await parser.parseURL(url);
    const items: IngestedItem[] = [];

    for (const item of feed.items) {
      if (!item.link) continue;
      
      items.push({
        title: item.title || 'Untitled',
        url: item.link,
        content: item.contentSnippet || item.content || item.summary || '',
        date: item.pubDate || item.isoDate,
        metadata: {
          enclosure: item.enclosure, // For MP3 links
          feedTitle: feed.title,
        }
      });
    }

    return items;
  } catch (error) {
    console.error(`Failed to ingest RSS feed: ${url}`, error);
    throw new Error(`Failed to ingest RSS feed: ${(error as Error).message}`);
  }
}
