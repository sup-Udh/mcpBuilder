// main detection router for rss/scraper mode analyzer

import { ingestRss } from './rss';
import { scrapeWebpage } from './scraper';
import { IngestedItem } from './types';

export async function processUrl(url: string, crawlSubpages = true): Promise<IngestedItem[]> {
  // Simple heuristic to detect RSS feeds
  const isLikelyRss = url.endsWith('.xml') || url.endsWith('.rss') || url.includes('/feed');

  if (isLikelyRss) {
    try {
      const rssItems = await ingestRss(url);
      
      // Auto-scrape the full articles for the first 3 RSS items to prevent long timeouts
      const topItems = rssItems.slice(0, 3);
      const scrapedTopItems = await Promise.all(
        topItems.map(async (item) => {
          try {
            const scraped = await scrapeWebpage(item.url, false);
            if (scraped.length > 0) {
              return { ...item, content: scraped[0].content };
            }
          } catch (e) {
            console.warn(`Auto-scrape failed for ${item.url}`, e);
          }
          return item;
        })
      );
      
      return [...scrapedTopItems, ...rssItems.slice(3)];
    } catch (e) {
      console.log('Failed as RSS, falling back to web scrape', e);
      return await scrapeWebpage(url, crawlSubpages);
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

    return await scrapeWebpage(url, crawlSubpages);
  }
}
