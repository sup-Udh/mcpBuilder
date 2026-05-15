// lib/vector/search.ts

import { embedText } from '../embeddings/proivders/openai';

import { searchSimilarChunks } from './supabase';

// ==========================================
// SEARCH CONFIG
// ==========================================

// retrieve MANY chunks for inspection/debugging
const DEFAULT_RETRIEVAL_COUNT = 20;

// minimum acceptable similarity
const MIN_SIMILARITY = 0.15;

// ==========================================
// SEARCH VECTOR DATABASE
// ==========================================

export async function semanticSearch(
  query: string,
  topK = DEFAULT_RETRIEVAL_COUNT
) {
  console.log(
    '\n===================================='
  );

  console.log(
    'SEMANTIC VECTOR SEARCH'
  );

  console.log(
    '===================================='
  );

  console.log(
    `Query: ${query}`
  );

  console.log(
    `Requested retrieval count: ${topK}`
  );

  // ======================================
  // EMBED QUERY
  // ======================================

  const queryEmbedding =
    await embedText(query);

  console.log(
    `Generated query embedding (${queryEmbedding.length} dimensions)`
  );

  // ======================================
  // VECTOR SEARCH
  // ======================================

  const rawResults =
    await searchSimilarChunks(
      queryEmbedding,
      topK
    );

  // ======================================
  // FILTER LOW QUALITY RESULTS
  // ======================================

  const filteredResults =
    rawResults.filter(
      (item: any) =>
        item.similarity >=
        MIN_SIMILARITY
    );

  console.log(
    `Retrieved ${rawResults.length} raw chunks`
  );

  console.log(
    `Filtered to ${filteredResults.length} chunks after similarity threshold`
  );

  // ======================================
  // DEBUG RESULTS
  // ======================================

  console.log(
    '\n===================================='
  );

  console.log(
    'RETRIEVED CHUNKS'
  );

  console.log(
    '===================================='
  );

  filteredResults.forEach(
    (
      item: any,
      index: number
    ) => {
      console.log(
        `\n#${index + 1}`
      );

      console.log(
        `Similarity: ${item.similarity.toFixed(4)}`
      );

      console.log(
        `Title: ${item.source_title}`
      );

      console.log(
        `Heading: ${item.heading}`
      );

      console.log(
        `Chunk Index: ${item.chunk_index}`
      );

      console.log(
        `Preview:\n${item.content.slice(0, 300)}...\n`
      );
    }
  );

  console.log(
    '\n===================================='
  );

  console.log(
    'SEARCH COMPLETE'
  );

  console.log(
    '===================================='
  );

  return filteredResults;
}