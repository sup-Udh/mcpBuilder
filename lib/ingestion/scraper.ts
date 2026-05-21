// lib/ingestion/scraper.ts

import * as cheerio from "cheerio";

import { JSDOM } from "jsdom";

import { Readability } from "@mozilla/readability";

import TurndownService from "turndown";

import crypto from "crypto";

import { IngestedItem } from "./types";

// ==========================================
// TURNDOWN
// ==========================================

const turndownService =
  new TurndownService({
    headingStyle: "atx",

    codeBlockStyle: "fenced",
  });

// ==========================================
// CONFIG
// ==========================================

const MAX_SUBPAGES = 15;

const MIN_CONTENT_LENGTH = 300;

const FETCH_TIMEOUT = 15000;

const FETCH_RETRIES = 3;

// ==========================================
// SLEEP
// ==========================================

function sleep(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

// ==========================================
// FETCH WITH RETRY
// ==========================================

async function fetchWithRetry(
  url: string,
  retries = FETCH_RETRIES
): Promise<Response> {

  for (let i = 0; i < retries; i++) {

    try {

      const controller =
        new AbortController();

      const timeoutId =
        setTimeout(() => {
          controller.abort();
        }, FETCH_TIMEOUT);

      const response =
        await fetch(url, {
          signal:
            controller.signal,

          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; MCPBuilderBot/1.0)",
          },
        });

      clearTimeout(timeoutId);

      if (!response.ok) {

        throw new Error(
          `HTTP ${response.status}`
        );
      }

      return response;

    } catch (error) {

      console.warn(
        `Fetch retry ${i + 1}/${retries} failed for ${url}`
      );

      if (i === retries - 1) {
        throw error;
      }

      await sleep(
        1000 * (i + 1)
      );
    }
  }

  throw new Error(
    "Failed fetching URL"
  );
}

// ==========================================
// FETCH HTML
// ==========================================

async function fetchHtml(
  url: string
): Promise<string> {

  console.log(
    `Fetching: ${url}`
  );

  const response =
    await fetchWithRetry(url);

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  if (
    !contentType.includes(
      "text/html"
    ) &&
    !contentType.includes(
      "application/xhtml+xml"
    )
  ) {
    throw new Error(
      `Unsupported content type: ${contentType}`
    );
  }

  return await response.text();
}

// ==========================================
// CLEAN RAW TEXT
// ==========================================

function cleanText(
  text: string
): string {

  return (
    text

      // invisible unicode
      .replace(
        /[\u200B-\u200D\uFEFF]/g,
        ""
      )

      // markdown images
      .replace(
        /!\[[^\]]*\]\([^)]+\)/g,
        ""
      )

      // raw urls
      .replace(
        /https?:\/\/\S+/g,
        ""
      )

      // markdown links -> keep text
      .replace(
        /\[([^\]]+)\]\([^)]+\)/g,
        "$1"
      )

      // repeated separators
      .replace(
        /[-=_]{4,}/g,
        ""
      )

      // excessive markdown junk
      .replace(
        /^\s*>\s*$/gm,
        ""
      )

      // collapse spaces
      .replace(
        /[ \t]+/g,
        " "
      )

      // collapse huge newlines
      .replace(
        /\n{3,}/g,
        "\n\n"
      )

      // trim lines
      .split("\n")
      .map((line) =>
        line.trim()
      )

      // remove empty lines
      .filter(Boolean)

      // remove tiny garbage lines
      .filter(
        (line) =>
          line.length > 2
      )

      // remove junk nav text
      .filter(
        (line) =>
          ![
            "edit",
            "edit source",
            "read more",
            "skip to content",
            "table of contents",
            "contents",
            "navigation",
            "menu",
          ].includes(
            line.toLowerCase()
          )
      )

      .join("\n")
      .trim()
  );
}

// ==========================================
// REMOVE JUNK ELEMENTS
// ==========================================

function removeJunkElements(
  document: Document
) {

  const selectors = [

    // layout
    "script",
    "style",
    "nav",
    "footer",
    "header",
    "aside",
    "iframe",
    "noscript",
    "svg",
    "form",
    "button",

    // generic ui
    ".sidebar",
    ".navigation",
    ".menu",
    ".breadcrumbs",
    ".ads",
    ".advertisement",
    ".cookie-banner",
    ".newsletter",
    ".popup",
    ".modal",
    ".social-share",
    ".share-buttons",

    // docs junk
    ".toc",
    ".table-of-contents",
    ".pagination",
    ".feedback",
    ".edit-page",
    ".next-prev-links",

    // wikipedia junk
    ".mw-editsection",
    ".navbox",
    ".metadata",
    ".vertical-navbox",
    ".infobox",
    ".reflist",
    ".reference",
    ".references",
    ".thumb",
    ".portal",
    ".hatnote",
  ];

  document
    .querySelectorAll(
      selectors.join(",")
    )
    .forEach((el) =>
      el.remove()
    );
}

// ==========================================
// LOW QUALITY DETECTION
// ==========================================

function isLowQualityContent(
  title: string,
  content: string,
  url: string
): boolean {

  const lowerTitle =
    title.toLowerCase();

  const lowerContent =
    content.toLowerCase();

  const lowerUrl =
    url.toLowerCase();

  // too small
  if (
    content.length <
    MIN_CONTENT_LENGTH
  ) {
    return true;
  }

  // wiki junk
  const blockedWikiPatterns = [
    "/wiki/wikipedia:",
    "/wiki/help:",
    "/wiki/special:",
    "/wiki/template:",
    "/wiki/file:",
    "/wiki/portal:",
    "/wiki/talk:",
    "/wiki/category:",
  ];

  if (
    blockedWikiPatterns.some((p) =>
      lowerUrl.includes(p)
    )
  ) {
    return true;
  }

  // bad titles
  const blockedTitles = [
    "help",
    "about",
    "privacy policy",
    "terms of service",
    "cookie policy",
    "recent changes",
    "file upload wizard",
    "contents",
  ];

  if (
    blockedTitles.some((t) =>
      lowerTitle.includes(t)
    )
  ) {
    return true;
  }

  // junk signals
  const junkSignals = [
    "this page was last edited",
    "file upload wizard",
    "recent changes",
    "help desk",
    "privacy policy",
    "terms of use",
    "cookie policy",
    "navigation menu",
    "jump to navigation",
    "jump to search",
  ];

  const junkMatches =
    junkSignals.filter((signal) =>
      lowerContent.includes(signal)
    ).length;

  if (junkMatches >= 2) {
    return true;
  }

  return false;
}

// ==========================================
// EXTRACT CONTENT
// ==========================================

function extractReadableContent(
  html: string,
  url: string
) {

  const dom =
    new JSDOM(html, {
      url,
    });

  const document =
    dom.window.document;

  removeJunkElements(
    document
  );

  // canonical
  const canonical =
    document
      .querySelector(
        'link[rel="canonical"]'
      )
      ?.getAttribute("href");

  const reader =
    new Readability(
      document
    );

  const article =
    reader.parse();

  if (!article) {

    throw new Error(
      "Failed to extract readable content"
    );
  }

  // preserve markdown
  const markdown =
    turndownService.turndown(
      article.content ?? ""
    );

  const cleaned =
    cleanText(markdown);

  // content hash
  const contentHash =
    crypto
      .createHash("sha256")
      .update(cleaned)
      .digest("hex");

  // document id
  const documentId =
    crypto
      .createHash("md5")
      .update(url)
      .digest("hex");

  return {

    id: documentId,

    title:
      article.title ||
      "Untitled Page",

    content: cleaned,

    markdown,

    excerpt:
      article.excerpt || "",

    canonical,

    contentHash,

    wordCount:
      cleaned.split(/\s+/).length,
  };
}

// ==========================================
// VALID SUBPAGE FILTER
// ==========================================

function isValidSubpage(
  url: string
): boolean {

  const lower =
    url.toLowerCase();

  // blocked files
  const blockedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".svg",
    ".webp",
    ".pdf",
    ".zip",
    ".mp4",
    ".mp3",
    ".mov",
    ".avi",
    ".exe",
  ];

  if (
    blockedExtensions.some((ext) =>
      lower.endsWith(ext)
    )
  ) {
    return false;
  }

  // blocked routes
  const blockedPatterns = [
    "/login",
    "/signup",
    "/register",
    "/auth",
    "/feed",
    "/rss",
    "/tag/",
    "/category/",
    "/search",
    "/privacy",
    "/terms",
    "/contact",
    "/account",
    "/settings",
    "/cart",
    "/checkout",
  ];

  if (
    blockedPatterns.some(
      (pattern) =>
        lower.includes(pattern)
    )
  ) {
    return false;
  }

  // hash urls
  if (
    lower.includes("#")
  ) {
    return false;
  }

  return true;
}

// ==========================================
// URL SCORING
// ==========================================

function scoreUrl(
  url: string
): number {

  let score = 0;

  const lower =
    url.toLowerCase();

  if (
    lower.includes("/docs")
  )
    score += 10;

  if (
    lower.includes("/guide")
  )
    score += 8;

  if (
    lower.includes("/learn")
  )
    score += 8;

  if (
    lower.includes("/tutorial")
  )
    score += 7;

  if (
    lower.includes("/api")
  )
    score += 6;

  if (
    lower.includes("/wiki/")
  )
    score += 5;

  if (
    lower.includes("help")
  )
    score -= 10;

  if (
    lower.includes("privacy")
  )
    score -= 10;

  if (
    lower.includes("terms")
  )
    score -= 10;

  return score;
}

// ==========================================
// SCRAPE SINGLE PAGE
// ==========================================

async function scrapeSinglePage(
  url: string
): Promise<IngestedItem | null> {

  try {

    console.log(
      `\nScraping page: ${url}`
    );

    await sleep(400);

    const html =
      await fetchHtml(url);

    console.log(
      `Fetched HTML (${html.length} chars)`
    );

    const extracted =
      extractReadableContent(
        html,
        url
      );

    console.log(
      `Extracted content (${extracted.content.length} chars)`
    );

    // quality filter
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

    console.log(
      `Accepted page: ${extracted.title}`
    );

    return {

      title:
        extracted.title,

      url,

      content:
        extracted.content,

      sourceType:
        "webpage",

      metadata: {

        excerpt:
          extracted.excerpt,

        markdown:
          extracted.markdown,

        canonical:
          extracted.canonical,

        contentHash:
          extracted.contentHash,

        wordCount:
          extracted.wordCount,

        scrapedAt:
          new Date().toISOString(),

        domain:
          new URL(url)
            .hostname,

        documentId:
          extracted.id,
      },
    };

  } catch (error) {

    console.warn(
      `Failed scraping ${url}`,
      error
    );

    return null;
  }
}

// ==========================================
// MAIN SCRAPER
// ==========================================

export async function scrapeWebpage(
  url: string,
  crawlSubpages = false
): Promise<IngestedItem[]> {

  console.log(
    "\n===================================="
  );

  console.log(
    "STARTING WEB SCRAPE"
  );

  console.log(
    "===================================="
  );

  console.log(
    `Crawl mode: ${
      crawlSubpages
        ? "MULTI PAGE"
        : "SINGLE PAGE"
    }`
  );

  const items:
    IngestedItem[] = [];

  const visited =
    new Set<string>();

  const contentHashes =
    new Set<string>();

  // ======================================
  // MAIN PAGE
  // ======================================

  const mainPage =
    await scrapeSinglePage(
      url
    );

  if (!mainPage) {

    throw new Error(
      `Failed to scrape main page: ${url}`
    );
  }

  const mainHash =
    mainPage.metadata
      ?.contentHash;

  if (mainHash) {
    contentHashes.add(
      mainHash
    );
  }

  items.push(mainPage);

  visited.add(url);

  // ======================================
  // SINGLE PAGE MODE
  // ======================================

  if (!crawlSubpages) {

    console.log(
      "Single-page mode enabled. Skipping subpage crawling."
    );

    return items;
  }

  // ======================================
  // SUBPAGE CRAWLING
  // ======================================

  try {

    const html =
      await fetchHtml(url);

    const $ =
      cheerio.load(html);

    const baseUrl =
      new URL(url);

    const links = $("a")
      .map((_, el) =>
        $(el).attr("href")
      )
      .get()
      .filter(Boolean);

    const normalizedUrls =
      Array.from(
        new Set(
          links
            .map((link) => {

              try {

                const fullUrl =
                  new URL(
                    link!,
                    url
                  );

                fullUrl.hash = "";

                return fullUrl.href;

              } catch {

                return null;
              }
            })
            .filter(Boolean)
        )
      ) as string[];

    const subpageUrls =
      normalizedUrls

        .filter((subUrl) => {

          return (
            subUrl.startsWith(
              baseUrl.origin
            ) &&
            !visited.has(
              subUrl
            ) &&
            isValidSubpage(
              subUrl
            )
          );
        })

        .sort(
          (a, b) =>
            scoreUrl(b) -
            scoreUrl(a)
        )

        .slice(
          0,
          MAX_SUBPAGES
        );

    console.log(
      `Found ${subpageUrls.length} candidate subpages`
    );

    // ======================================
    // CONCURRENT SCRAPING
    // ======================================

    const results =
      await Promise.allSettled(

        subpageUrls.map(
          (subUrl) =>
            scrapeSinglePage(
              subUrl
            )
        )
      );

    for (const result of results) {

      if (
        result.status ===
          "fulfilled" &&
        result.value
      ) {

        const hash =
          result.value
            .metadata
            ?.contentHash;

        // duplicate content prevention
        if (
          hash &&
          contentHashes.has(
            hash
          )
        ) {

          console.log(
            `Duplicate content skipped: ${result.value.url}`
          );

          continue;
        }

        if (hash) {
          contentHashes.add(
            hash
          );
        }

        items.push(
          result.value
        );
      }
    }

  } catch (crawlError) {

    console.warn(
      "Subpage crawling failed",
      crawlError
    );
  }

  // ======================================
  // COMPLETE
  // ======================================

  console.log(
    "\n===================================="
  );

  console.log(
    "SCRAPING COMPLETE"
  );

  console.log(
    "===================================="
  );

  console.log(
    `Successfully scraped ${items.length} high-quality pages`
  );

  return items;
}