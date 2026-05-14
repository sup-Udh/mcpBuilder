// lib/ingestion/index.ts

// main detection router for rss/scraper mode analyzer

import { ingestRss } from './rss';
import { scrapeWebpage } from './scraper';
import { IngestedItem } from './types';

import { chunkDocuments } from '../processing/chunker';
import { Chunk } from '../processing/types';

import { embedChunks } from '../embeddings/embedder';
import { EmbeddingChunk } from '../embeddings/types';


// testing cosine similarity here: (delete later!!)
import { searchChunks } from '../search/similarity';


export interface ProcessedResult {
  documents: IngestedItem[];
  chunks: Chunk[];
  embeddedChunks: EmbeddingChunk[];
}

export async function processUrl(
  url: string
): Promise<ProcessedResult> {
  console.log('\n====================================');
  console.log('STARTING INGESTION PIPELINE');
  console.log('====================================');

  console.log(`Target URL: ${url}`);

  let documents: IngestedItem[] = [];

  // ==========================================
  // RSS DETECTION
  // ==========================================

  const isLikelyRss =
    url.endsWith('.xml') ||
    url.endsWith('.rss') ||
    url.includes('/feed');

  console.log(`RSS heuristic result: ${isLikelyRss}`);

  if (isLikelyRss) {
    try {
      console.log('Attempting RSS ingestion...');

      documents = await ingestRss(url);

      console.log(
        `RSS ingestion successful (${documents.length} documents)`
      );
    } catch (e) {
      console.log(
        'RSS ingestion failed. Falling back to webpage scraping...',
        e
      );

      documents = await scrapeWebpage(url);

      console.log(
        `Web scraping successful (${documents.length} documents)`
      );
    }
  } else {
    try {
      console.log('Checking content-type via HEAD request...');

      const controller = new AbortController();

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
        res.headers.get('content-type') || '';

      console.log(`Detected content-type: ${contentType}`);

      if (
        contentType.includes('xml') ||
        contentType.includes('rss')
      ) {
        console.log('Detected RSS content-type');

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

    // fallback if documents still empty
    if (documents.length === 0) {
      console.log('Starting webpage scraping...');

      documents = await scrapeWebpage(url);

      console.log(
        `Web scraping successful (${documents.length} documents)`
      );
    }
  }

  // ==========================================
  // DOCUMENT DEBUGGING
  // ==========================================

  console.log('\n====================================');
  console.log('DOCUMENT ANALYSIS');
  console.log('====================================');

  documents.forEach((doc, index) => {
    console.log(`\nDocument ${index + 1}`);
    console.log(`Title: ${doc.title}`);
    console.log(`URL: ${doc.url}`);
    console.log(
      `Content Length: ${doc.content.length} chars`
    );
  });

  // ==========================================
  // CHUNKING
  // ==========================================

  console.log('\n====================================');
  console.log('STARTING CHUNKING');
  console.log('====================================');

  const chunks = chunkDocuments(documents);
  
  const embeddedChunks = await embedChunks(chunks);

  await searchChunks('how do machines imitate human thinking', embeddedChunks);


  // ==========================================
  // CHUNK DEBUGGING
  // ==========================================

  console.log('\n====================================');
  console.log('CHUNK ANALYSIS');
  console.log('====================================');

  console.log(`Total chunks created: ${chunks.length}`);

  chunks.forEach((chunk, index) => {
    console.log(`\nChunk ${index + 1}`);
    console.log(`Chunk ID: ${chunk.id}`);
    console.log(`Heading: ${chunk.heading}`);
    console.log(`Word Count: ${chunk.wordCount}`);

    console.log(
      `Preview:\n${chunk.text.slice(0, 250)}...`
    );
  });

  console.log('\n====================================');
  console.log('PIPELINE COMPLETE');
  console.log('====================================\n');

  return {
    documents,
    chunks,
    embeddedChunks,
  };
}