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
// CONFIG
// ==========================================

const MAX_SUBPAGES = 15;

const MIN_CONTENT_LENGTH = 300;

// ==========================================
// FETCH HTML
// ==========================================

async function fetchHtml(url: string): Promise<string> {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 15000);

  try {
    console.log(`Fetching: ${url}`);

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

    const contentType =
      response.headers.get('content-type') || '';

    if (
      !contentType.includes('text/html') &&
      !contentType.includes('application/xhtml+xml')
    ) {
      throw new Error(
        `Unsupported content type: ${contentType}`
      );
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
      // invisible unicode
      .replace(/[\u200B-\u200D\uFEFF]/g, '')

      // markdown links → keep text only

      .replace(/https?:\/\/\S+/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

      // collapse spaces
      .replace(/[ \t]+/g, ' ')

      // collapse huge newlines
      .replace(/\n{3,}/g, '\n\n')

      // remove repeated separators
      .replace(/[-=_]{4,}/g, '')

      // remove excessive markdown artifacts
      .replace(/^\s*>\s*$/gm, '')

      // trim lines
      .split('\n')
      .map((line) => line.trim())

      // remove empty lines
      .filter(Boolean)

      // remove tiny garbage
      .filter((line) => line.length > 2)

      // remove nav junk
      .filter(
        (line) =>
          ![
            'edit',
            'edit source',
            'read more',
            'skip to content',
            'table of contents',
            'contents',
            'navigation',
            'menu',
          ].includes(line.toLowerCase())
      )

      .join('\n')
      .trim()
  );
}

// ==========================================
// REMOVE JUNK ELEMENTS
// ==========================================

function removeJunkElements(document: Document) {
  const selectors = [
    // layout
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

    // generic ui
    '.sidebar',
    '.navigation',
    '.menu',
    '.breadcrumbs',
    '.ads',
    '.advertisement',
    '.cookie-banner',
    '.newsletter',
    '.popup',
    '.modal',
    '.social-share',
    '.share-buttons',

    // docs junk
    '.toc',
    '.table-of-contents',
    '.pagination',
    '.feedback',
    '.edit-page',
    '.next-prev-links',

    // wikipedia junk
    '.mw-editsection',
    '.navbox',
    '.metadata',
    '.vertical-navbox',
    '.infobox',
    '.reflist',
    '.reference',
    '.references',
    '.thumb',
    '.portal',
    '.hatnote',
  ];

  document
    .querySelectorAll(selectors.join(','))
    .forEach((el) => el.remove());
}

// ==========================================
// CONTENT QUALITY FILTER
// ==========================================

function isLowQualityContent(
  title: string,
  content: string,
  url: string
): boolean {
  const lowerTitle = title.toLowerCase();

  const lowerContent = content.toLowerCase();

  const lowerUrl = url.toLowerCase();

  // ======================================
  // LOW CONTENT
  // ======================================

  if (content.length < MIN_CONTENT_LENGTH) {
    return true;
  }

  // ======================================
  // WIKIPEDIA META PAGES
  // ======================================

  const blockedWikiPatterns = [
    '/wiki/wikipedia:',
    '/wiki/help:',
    '/wiki/special:',
    '/wiki/template:',
    '/wiki/file:',
    '/wiki/portal:',
    '/wiki/talk:',
    '/wiki/category:',
  ];

  if (
    blockedWikiPatterns.some((p) =>
      lowerUrl.includes(p)
    )
  ) {
    return true;
  }

  // ======================================
  // GENERIC JUNK TITLES
  // ======================================

  const blockedTitles = [
    'help',
    'about',
    'privacy policy',
    'terms of service',
    'cookie policy',
    'recent changes',
    'file upload wizard',
    'contents',
  ];

  if (
    blockedTitles.some((t) =>
      lowerTitle.includes(t)
    )
  ) {
    return true;
  }

  // ======================================
  // CONTENT JUNK DETECTION
  // ======================================

  const junkSignals = [
    'this page was last edited',
    'file upload wizard',
    'recent changes',
    'help desk',
    'privacy policy',
    'terms of use',
    'cookie policy',
    'navigation menu',
    'jump to navigation',
    'jump to search',
  ];

  const junkMatches = junkSignals.filter((signal) =>
    lowerContent.includes(signal)
  ).length;

  if (junkMatches >= 2) {
    return true;
  }

  return false;
}

// ==========================================
// EXTRACT MAIN CONTENT
// ==========================================

function extractReadableContent(
  html: string,
  url: string
) {
  const dom = new JSDOM(html, {
    url,
  });

  const document = dom.window.document;

  removeJunkElements(document);

  const reader = new Readability(document);

  const article = reader.parse();

  if (!article) {
    throw new Error(
      'Failed to extract readable content'
    );
  }

  const markdown = turndownService.turndown(
    article.content ?? ''
  );

  const cleaned = cleanText(markdown);

  return {
    title: article.title || 'Untitled Page',

    content: cleaned,

    excerpt: article.excerpt || '',
  };
}

// ==========================================
// VALID SUBPAGE FILTER
// ==========================================

function isValidSubpage(url: string): boolean {
  const lower = url.toLowerCase();

  // ======================================
  // BLOCK FILES
  // ======================================

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
    '.mov',
    '.avi',
    '.exe',
  ];

  if (
    blockedExtensions.some((ext) =>
      lower.endsWith(ext)
    )
  ) {
    return false;
  }

  // ======================================
  // BLOCK AUTH / META
  // ======================================

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
    '/privacy',
    '/terms',
    '/contact',
    '/about',
    '/account',
    '/settings',
    '/cart',
    '/checkout',
    '#',
  ];

  if (
    blockedPatterns.some((pattern) =>
      lower.includes(pattern)
    )
  ) {
    return false;
  }

  // ======================================
  // WIKIPEDIA META FILTERS
  // ======================================

  const blockedWikiPatterns = [
    '/wiki/wikipedia:',
    '/wiki/help:',
    '/wiki/special:',
    '/wiki/template:',
    '/wiki/file:',
    '/wiki/portal:',
    '/wiki/talk:',
    '/wiki/category:',
  ];

  if (
    blockedWikiPatterns.some((p) =>
      lower.includes(p)
    )
  ) {
    return false;
  }

  return true;
}

// ==========================================
// PRIORITY SCORING
// ==========================================

function scoreUrl(url: string): number {
  let score = 0;

  const lower = url.toLowerCase();

  // docs boost
  if (lower.includes('/docs')) score += 10;
  if (lower.includes('/guide')) score += 8;
  if (lower.includes('/learn')) score += 8;
  if (lower.includes('/tutorial')) score += 7;
  if (lower.includes('/api')) score += 6;

  // wikipedia actual article boost
  if (lower.includes('/wiki/')) score += 5;

  // penalize utility pages
  if (lower.includes('help')) score -= 10;
  if (lower.includes('privacy')) score -= 10;
  if (lower.includes('terms')) score -= 10;

  return score;
}

// ==========================================
// SCRAPE SINGLE PAGE
// ==========================================

async function scrapeSinglePage(
  url: string
): Promise<IngestedItem | null> {
  try {
    console.log(`\nScraping page: ${url}`);

    const html = await fetchHtml(url);

    console.log(
      `Fetched HTML (${html.length} chars)`
    );

    const extracted = extractReadableContent(
      html,
      url
    );

    console.log(
      `Extracted content (${extracted.content.length} chars)`
    );

    // ======================================
    // QUALITY FILTER
    // ======================================

    if (
      isLowQualityContent(
        extracted.title,
        extracted.content,
        url
      )
    ) {
      console.warn(
        `Low quality page skipped: ${url}`
      );

      return null;
    }

    console.log(`Accepted page: ${extracted.title}`);

    return {
      title: extracted.title,

      url,

      content: extracted.content,

      sourceType: 'webpage',

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
  console.log('\n====================================');
  console.log('STARTING WEB SCRAPE');
  console.log('====================================');

  const items: IngestedItem[] = [];

  const visited = new Set<string>();

  // ======================================
  // MAIN PAGE
  // ======================================

  const mainPage = await scrapeSinglePage(url);

  if (!mainPage) {
    throw new Error(
      `Failed to scrape main page: ${url}`
    );
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
                const fullUrl = new URL(
                  link!,
                  url
                );

                fullUrl.hash = '';

                return fullUrl.href;
              } catch {
                return null;
              }
            })
            .filter(Boolean)
        )
      ) as string[];

      const subpageUrls = normalizedUrls
        .filter((subUrl) => {
          return (
            subUrl.startsWith(baseUrl.origin) &&
            !visited.has(subUrl) &&
            isValidSubpage(subUrl)
          );
        })

        .sort(
          (a, b) => scoreUrl(b) - scoreUrl(a)
        )

        .slice(0, MAX_SUBPAGES);

      console.log(
        `Found ${subpageUrls.length} candidate subpages`
      );

      for (const subUrl of subpageUrls) {
        visited.add(subUrl);

        const item = await scrapeSinglePage(
          subUrl
        );

        if (item) {
          items.push(item);
        }
      }
    } catch (crawlError) {
      console.warn(
        'Subpage crawling failed',
        crawlError
      );
    }
  }

  console.log('\n====================================');
  console.log('SCRAPING COMPLETE');
  console.log('====================================');

  console.log(
    `Successfully scraped ${items.length} high-quality pages`
  );

  return items;
}