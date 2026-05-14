import * as cheerio from 'cheerio';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';
import { IngestedItem } from './types';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

// ==========================================
// FETCH HTML
// ==========================================

async function fetchHtml(url: string): Promise<string> {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 15000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; MCPBuilderBot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeoutId);
  }
}

// ==========================================
// CLEAN RAW TEXT
// ==========================================

function cleanText(text: string): string {
  return (
    text
      // remove invisible unicode
      .replace(/[\u200B-\u200D\uFEFF]/g, '')

      // normalize spaces
      .replace(/[ \t]+/g, ' ')

      // collapse huge newlines
      .replace(/\n{3,}/g, '\n\n')

      // trim each line
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

      // remove tiny garbage lines
      .filter((line) => line.length > 2)

      .join('\n')
      .trim()
  );
}

// ==========================================
// REMOVE JUNK NODES
// ==========================================

function removeJunkElements(document: Document) {
  const selectors = [
    'script',
    'style',
    'nav',
    'footer',
    'header',
    'aside',
    'iframe',
    'noscript',
    'svg',
    'form',
    'button',
    '.sidebar',
    '.navigation',
    '.menu',
    '.toc',
    '.table-of-contents',
    '.breadcrumbs',
    '.ads',
    '.advertisement',
    '.cookie-banner',
    '.newsletter',
  ];

  document.querySelectorAll(selectors.join(',')).forEach((el) => {
    el.remove();
  });
}

// ==========================================
// EXTRACT MAIN CONTENT
// ==========================================

function extractReadableContent(html: string, url: string) {
  const dom = new JSDOM(html, {
    url,
  });

  const document = dom.window.document;

  removeJunkElements(document);

  const reader = new Readability(document);

  const article = reader.parse();

  if (!article) {
    throw new Error('Failed to extract readable content');
  }

  const markdown = turndownService.turndown(article.content ?? '');

  const cleaned = cleanText(markdown);

  return {
    title: article.title || 'Untitled Page',
    content: cleaned,
    excerpt: article.excerpt || '',
  };
}

// ==========================================
// FILTER VALID SUBPAGE URLS
// ==========================================

function isValidSubpage(url: string): boolean {
  const blockedExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.svg',
    '.webp',
    '.pdf',
    '.zip',
    '.mp4',
    '.mp3',
  ];

  const blockedPatterns = [
    '/login',
    '/signup',
    '/register',
    '/auth',
    '/feed',
    '/rss',
    '/tag/',
    '/category/',
    '/search',
    '#',
  ];

  const lower = url.toLowerCase();

  if (blockedExtensions.some((ext) => lower.endsWith(ext))) {
    return false;
  }

  if (blockedPatterns.some((pattern) => lower.includes(pattern))) {
    return false;
  }

  return true;
}

// ==========================================
// SCRAPE SINGLE PAGE
// ==========================================

async function scrapeSinglePage(
  url: string
): Promise<IngestedItem | null> {
  try {
    console.log(`Scraping: ${url}`);

    const html = await fetchHtml(url);

    console.log(`Fetched HTML length: ${html.length}`);

    const extracted = extractReadableContent(html, url);

    console.log(
      `Extracted content length: ${extracted.content.length}`
    );

    // extraction quality check
    if (extracted.content.length < 200) {
      console.warn(`Low-quality extraction skipped: ${url}`);
      return null;
    }

    return {
      title: extracted.title,
      url,
      content: extracted.content,
      metadata: {
        excerpt: extracted.excerpt,
      },
    };
  } catch (error) {

    console.warn(`Failed scraping ${url}`, error);

    return null;
  }
}

// ==========================================
// MAIN SCRAPER
// ==========================================

export async function scrapeWebpage(
  url: string,
  crawlSubpages = true
): Promise<IngestedItem[]> {
  const items: IngestedItem[] = [];

  const visited = new Set<string>();

  // ======================================
  // SCRAPE MAIN PAGE
  // ======================================

  const mainPage = await scrapeSinglePage(url);

  if (!mainPage) {
    throw new Error(`Failed to scrape main page, ${url}`);
  }

  items.push(mainPage);

  visited.add(url);

  // ======================================
  // SUBPAGE CRAWLING
  // ======================================

  if (crawlSubpages) {
    try {
      const html = await fetchHtml(url);

      const $ = cheerio.load(html);

      const baseUrl = new URL(url);

      const links = $('a')
        .map((_, el) => $(el).attr('href'))
        .get()
        .filter(Boolean);

      const normalizedUrls = Array.from(
        new Set(
          links
            .map((link) => {
              try {
                const fullUrl = new URL(link!, url);

                // remove hash fragments
                fullUrl.hash = '';

                return fullUrl.href;
              } catch {
                return null;
              }
            })
            .filter(Boolean)
        )
      ) as string[];

      const subpageUrls = normalizedUrls.filter((subUrl) => {
        return (
          subUrl.startsWith(baseUrl.origin) &&
          !visited.has(subUrl) &&
          isValidSubpage(subUrl)
        );
      });

      // prioritize likely docs pages
      subpageUrls.sort((a, b) => {
        const score = (u: string) => {
          let s = 0;

          if (u.includes('/docs')) s += 5;
          if (u.includes('/guide')) s += 4;
          if (u.includes('/learn')) s += 4;
          if (u.includes('/api')) s += 4;
          if (u.includes('/tutorial')) s += 3;

          return s;
        };

        return score(b) - score(a);
      });

      // limit crawl count
      const urlsToCrawl = subpageUrls.slice(0, 15);

      console.log(`Found ${urlsToCrawl.length} subpages`);

      for (const subUrl of urlsToCrawl) {
        visited.add(subUrl);

        const item = await scrapeSinglePage(subUrl);

        if (item) {
          items.push(item);
        }
      }
    } catch (crawlError) {
      console.warn('Subpage crawling failed', crawlError);
    }
  }

  console.log(`Finished scraping ${items.length} pages`);

  return items;
}