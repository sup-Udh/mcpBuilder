// main detection router for rss/scraper mode analyzer

import { ingestRss } from './rss';
import { scrapeWebpage } from './scraper';
import { IngestedItem } from './types';

export async function processUrl(url: string): Promise<IngestedItem[]> {
  // Simple heuristic to detect RSS feeds
  const isLikelyRss = url.endsWith('.xml') || url.endsWith('.rss') || url.includes('/feed');

  if (isLikelyRss) {
    try {
      return await ingestRss(url);
    } catch (e) {
      console.log('Failed as RSS, falling back to web scrape', e);
      return await scrapeWebpage(url);
    }
  } else {
    try {
      // It might be a feed without an extension, fetch first
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
      clearTimeout(timeoutId);

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('xml') || contentType.includes('rss')) {
        return await ingestRss(url);
      }
    } catch (e) {
      // HEAD request failed, just continue to web scrape
    }

    return await scrapeWebpage(url);
  }
}
