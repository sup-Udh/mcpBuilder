import * as cheerio from 'cheerio';
import { IngestedItem } from './types';

// Simple helper to fetch HTML with timeout
async function fetchHtml(url: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    return html;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function scrapeWebpage(url: string, crawlSubpages = true): Promise<IngestedItem[]> {
  const items: IngestedItem[] = [];
  const visited = new Set<string>();

  try {
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);

    // Strip unnecessary elements
    $('script, style, nav, header, footer, noscript, iframe, svg').remove();

    // Extract readable body text
    const title = $('title').text() || $('h1').first().text() || 'Untitled Page';
    const content = $('body').text().replace(/\s+/g, ' ').trim();

    items.push({
      title,
      url,
      content,
    });
    visited.add(url);

    // If crawling subpages
    if (crawlSubpages) {
      const links = $('a')
        .map((_, el) => $(el).attr('href'))
        .get()
        .filter(href => href && !href.startsWith('#'));

      const baseUrl = new URL(url);

      // Get absolute URLs that belong to the same origin
      const subpageUrls = Array.from(new Set(links.map(link => {
        try {
          return new URL(link, url).href;
        } catch {
          return null;
        }
      }))).filter(link => link && link.startsWith(baseUrl.origin) && link !== url);

      // Limit to max 10 subpages for v1 to avoid massive crawls
      const urlsToCrawl = subpageUrls.slice(0, 10);

      for (const subUrl of urlsToCrawl) {
        if (!subUrl || visited.has(subUrl)) continue;
        visited.add(subUrl);

        try {
          const subHtml = await fetchHtml(subUrl);
          const $sub = cheerio.load(subHtml);
          $sub('script, style, nav, header, footer, noscript, iframe, svg').remove();

          const subTitle = $sub('title').text() || $sub('h1').first().text() || 'Untitled Page';
          const subContent = $sub('body').text().replace(/\s+/g, ' ').trim();

          items.push({
            title: subTitle,
            url: subUrl,
            content: subContent,
          });
        } catch (subErr) {
          console.warn(`Failed to scrape subpage: ${subUrl}`, subErr);
        }
      }
    }

    return items;
  } catch (error) {
    console.error(`Failed to scrape webpage: ${url}`, error);
    throw new Error(`Failed to scrape webpage: ${(error as Error).message}`);
  }
}
