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

import {
  storeEmbeddedChunks,
  storeDocuments,
  updateServerStatus,
} from '../vector/supabase';

// ==========================================
// TYPES
// ==========================================

export interface ProcessedResult {
  serverId: string;

  documents: IngestedItem[];

  chunks: Chunk[];

  embeddedChunks: EmbeddingChunk[];
}

// ==========================================
// MAIN PROCESSOR
// ==========================================

export async function processUrl(
  serverId: string,

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

  console.log(`Server ID: ${serverId}`);

  console.log(`Target URL: ${url}`);

  console.log(
    `Crawl Subpages: ${
      crawlSubpages ? 'YES' : 'NO'
    }`
  );

  let documents: IngestedItem[] = [];

  // ==========================================
  // UPDATE STATUS: SCRAPING
  // ==========================================

  try {
    await updateServerStatus(serverId, {
      deployment_status: 'scraping',
      ingest_status: 'scraping',
    });
  } catch {
    // Status update is best-effort
  }

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

      documents =
        await scrapeWebpage(
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

        documents =
          await ingestRss(url);

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

      documents =
        await scrapeWebpage(
          url,
          crawlSubpages
        );

      console.log(
        `Web scraping successful (${documents.length} documents)`
      );
    }
  }

  // ==========================================
  // ATTACH SERVER IDS
  // ==========================================

  documents = documents.map(
    (doc) => ({
      ...doc,

      serverId,
    })
  );

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
      `Server ID: ${doc.serverId}`
    );

    console.log(
      `Content Length: ${doc.content.length} chars`
    );
  });

  // ==========================================
  // STORE DOCUMENTS IN SUPABASE
  // ==========================================

  console.log('\n====================================');
  console.log('STORING DOCUMENTS');
  console.log('====================================');

  let documentUrlToId = new Map<string, string>();

  try {
    const storedDocs = await storeDocuments(
      serverId,
      documents
    );

    for (const doc of storedDocs) {
      documentUrlToId.set(doc.url, doc.id);
    }

    console.log(
      `Stored ${storedDocs.length} documents with IDs`
    );
  } catch (storeError) {
    console.error(
      'Failed to store documents (continuing with pipeline):',
      storeError
    );
  }

  // ==========================================
  // UPDATE STATUS: CHUNKING
  // ==========================================

  try {
    await updateServerStatus(serverId, {
      deployment_status: 'chunking',
      ingest_status: 'chunking',
      total_documents: documents.length,
    });
  } catch {
    // Status update is best-effort
  }

  // ==========================================
  // CHUNKING
  // ==========================================

  console.log('\n====================================');

  console.log('STARTING CHUNKING');

  console.log(
    '===================================='
  );

  const chunks =
    chunkDocuments(documents);

  // ==========================================
  // UPDATE STATUS: EMBEDDING
  // ==========================================

  try {
    await updateServerStatus(serverId, {
      deployment_status: 'embedding',
      ingest_status: 'embedding',
      total_chunks: chunks.length,
    });
  } catch {
    // Status update is best-effort
  }

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
  // UPDATE STATUS: STORING
  // ==========================================

  try {
    await updateServerStatus(serverId, {
      deployment_status: 'storing',
      ingest_status: 'storing',
      total_embeddings: embeddedChunks.length,
    });
  } catch {
    // Status update is best-effort
  }

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
    embeddedChunks,
    documentUrlToId
  );

  console.log(
    'Embeddings stored successfully'
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
    serverId,

    documents,

    chunks,

    embeddedChunks,
  };
}