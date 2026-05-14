// lib/vector/search.ts

import { embedText } from "../embeddings/proivders/bge";

import { searchSimilarChunks } from './supabase';

// ==========================================
// SEARCH VECTOR DATABASE
// ==========================================

export async function semanticSearch(
  query: string,
  topK = 5
) {
  console.log('\n====================================');
  console.log('SEMANTIC VECTOR SEARCH');
  console.log('====================================');

  console.log(`Query: ${query}`);

  // ======================================
  // EMBED QUERY
  // ======================================

  const queryEmbedding = await embedText(query);

  console.log(
    `Generated query embedding (${queryEmbedding.length} dimensions)`
  );

  // ======================================
  // VECTOR SEARCH
  // ======================================

  const results = await searchSimilarChunks(
    queryEmbedding,
    topK
  );

  console.log('\n====================================');
  console.log('SEARCH COMPLETE');
  console.log('====================================');

  return results;
}