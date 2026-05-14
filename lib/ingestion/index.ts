// lib/ingestion/index.ts

// ==========================================
// MAIN INGESTION PIPELINE
// ==========================================

import { ingestRss } from './rss';

import { scrapeWebpage } from './scraper';

import { IngestedItem } from './types';

// ==========================================
// CHUNKING
// ==========================================

import { chunkDocuments } from '../processing/chunker';

import { Chunk } from '../processing/types';

// ==========================================
// EMBEDDINGS
// ==========================================

import { embedChunks } from '../embeddings/embedder';

import { EmbeddingChunk } from '../embeddings/types';

// ==========================================
// VECTOR STORAGE
// ==========================================

import { storeEmbeddedChunks } from '../vector/supabase';

// ==========================================
// VECTOR SEARCH TESTING
// ==========================================

import { semanticSearch } from '../vector/search';

// ==========================================
// TYPES
// ==========================================

export interface ProcessedResult {
  documents: IngestedItem[];

  chunks: Chunk[];

  embeddedChunks: EmbeddingChunk[];
}

// ==========================================
// MAIN PROCESSOR
// ==========================================

export async function processUrl(
  url: string,
  crawlSubpages = false
): Promise<ProcessedResult> {
  console.log('\n====================================');

  console.log(
    'STARTING INGESTION PIPELINE'
  );

  console.log(
    '===================================='
  );

  console.log(`Target URL: ${url}`);

  console.log(
    `Crawl Subpages: ${
      crawlSubpages ? 'YES' : 'NO'
    }`
  );

  let documents: IngestedItem[] = [];

  // ==========================================
  // RSS DETECTION
  // ==========================================

  const isLikelyRss =
    url.endsWith('.xml') ||
    url.endsWith('.rss') ||
    url.includes('/feed');

  console.log(
    `RSS heuristic result: ${isLikelyRss}`
  );

  // ==========================================
  // RSS MODE
  // ==========================================

  if (isLikelyRss) {
    try {
      console.log(
        'Attempting RSS ingestion...'
      );

      documents = await ingestRss(url);

      console.log(
        `RSS ingestion successful (${documents.length} documents)`
      );
    } catch (e) {
      console.log(
        'RSS ingestion failed. Falling back to webpage scraping...',
        e
      );

      documents = await scrapeWebpage(
        url,
        crawlSubpages
      );

      console.log(
        `Web scraping successful (${documents.length} documents)`
      );
    }
  }

  // ==========================================
  // WEBPAGE MODE
  // ==========================================

  else {
    try {
      console.log(
        'Checking content-type via HEAD request...'
      );

      const controller =
        new AbortController();

      const timeoutId = setTimeout(
        () => controller.abort(),
        5000
      );

      const res = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType =
        res.headers.get(
          'content-type'
        ) || '';

      console.log(
        `Detected content-type: ${contentType}`
      );

      // ======================================
      // RSS CONTENT-TYPE DETECTED
      // ======================================

      if (
        contentType.includes('xml') ||
        contentType.includes('rss')
      ) {
        console.log(
          'Detected RSS content-type'
        );

        documents = await ingestRss(url);

        console.log(
          `RSS ingestion successful (${documents.length} documents)`
        );
      }
    } catch (e) {
      console.log(
        'HEAD request failed. Proceeding with webpage scraping...'
      );
    }

    // ======================================
    // FALLBACK TO SCRAPING
    // ======================================

    if (documents.length === 0) {
      console.log(
        'Starting webpage scraping...'
      );

      documents = await scrapeWebpage(
        url,
        crawlSubpages
      );

      console.log(
        `Web scraping successful (${documents.length} documents)`
      );
    }
  }

  // ==========================================
  // DOCUMENT ANALYSIS
  // ==========================================

  console.log('\n====================================');

  console.log('DOCUMENT ANALYSIS');

  console.log(
    '===================================='
  );

  documents.forEach((doc, index) => {
    console.log(`\nDocument ${index + 1}`);

    console.log(`Title: ${doc.title}`);

    console.log(`URL: ${doc.url}`);

    console.log(
      `Content Length: ${doc.content.length} chars`
    );

    console.log(
      `Preview:\n${doc.content.slice(
        0,
        250
      )}...`
    );
  });

  // ==========================================
  // CHUNKING
  // ==========================================

  console.log('\n====================================');

  console.log('STARTING CHUNKING');

  console.log(
    '===================================='
  );

  const chunks = chunkDocuments(
    documents
  );

  // ==========================================
  // CHUNK ANALYSIS
  // ==========================================

  console.log('\n====================================');

  console.log('CHUNK ANALYSIS');

  console.log(
    '===================================='
  );

  console.log(
    `Total chunks created: ${chunks.length}`
  );

  chunks.forEach((chunk, index) => {
    console.log(`\nChunk ${index + 1}`);

    console.log(
      `Chunk ID: ${chunk.id}`
    );

    console.log(
      `Heading: ${chunk.heading}`
    );

    console.log(
      `Word Count: ${chunk.wordCount}`
    );

    console.log(
      `Preview:\n${chunk.text.slice(
        0,
        250
      )}...`
    );
  });

  // ==========================================
  // EMBEDDINGS
  // ==========================================

  console.log('\n====================================');

  console.log(
    'STARTING EMBEDDINGS'
  );

  console.log(
    '===================================='
  );

  const embeddedChunks =
    await embedChunks(chunks);

  console.log(
    `Generated embeddings for ${embeddedChunks.length} chunks`
  );

  // ==========================================
  // STORE IN VECTOR DB
  // ==========================================

  console.log('\n====================================');

  console.log(
    'STORING EMBEDDINGS IN SUPABASE'
  );

  console.log(
    '===================================='
  );

  await storeEmbeddedChunks(
    embeddedChunks
  );

  console.log(
    'Embeddings stored successfully'
  );

  // ==========================================
  // TEST SEARCH
  // ==========================================

  console.log('\n====================================');

  console.log(
    'RUNNING TEST SEMANTIC SEARCH'
  );

  console.log(
    '===================================='
  );

  await semanticSearch(
    'how do machines imitate human thinking'
  );

  // ==========================================
  // PIPELINE COMPLETE
  // ==========================================

  console.log('\n====================================');

  console.log(
    'PIPELINE COMPLETE'
  );

  console.log(
    '====================================\n'
  );

  return {
    documents,

    chunks,

    embeddedChunks,
  };
}