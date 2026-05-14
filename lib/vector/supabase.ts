// lib/vector/supabase.ts

import { createClient } from '@supabase/supabase-js';

import { EmbeddingChunk } from '../embeddings/types';

// ==========================================
// ENV VALIDATION
// ==========================================

const supabaseUrl =
  process.env.SUPABASE_URL;

const supabaseKey =
  process.env
    .SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing SUPABASE_URL environment variable'
  );
}

if (!supabaseKey) {
  throw new Error(
    'Missing SUPABASE_SERVICE_ROLE_KEY environment variable'
  );
}

// ==========================================
// CLIENT
// ==========================================

export const supabase =
  createClient(
    supabaseUrl,
    supabaseKey
  );

// ==========================================
// STORE EMBEDDED CHUNKS
// ==========================================

export async function storeEmbeddedChunks(
  chunks: EmbeddingChunk[]
) {
  console.log(
    '\n===================================='
  );

  console.log(
    'STORING EMBEDDINGS'
  );

  console.log(
    '===================================='
  );

  console.log(
    `Chunks to store: ${chunks.length}`
  );

  if (chunks.length === 0) {
    console.warn(
      'No chunks provided'
    );

    return;
  }

  // ======================================
  // FORMAT DB ROWS
  // ======================================

  const rows = chunks.map(
    (chunk) => ({
      chunk_id: chunk.id,

      source_url:
        chunk.sourceUrl,

      source_title:
        chunk.sourceTitle,

      source_type:
        chunk.sourceType,

      heading:
        chunk.heading ||
        null,

      chunk_index:
        chunk.chunkIndex,

      content: chunk.text,

      word_count:
        chunk.wordCount,

      embedding:
        chunk.embedding,

      embedding_model:
        chunk.embedingModel,
    })
  );

  console.log(
    'Prepared database rows'
  );

  // ======================================
  // UPSERT
  // ======================================

  const { error } =
    await supabase
      .from('documents')

      .upsert(rows, {
        onConflict:
          'chunk_id',

        ignoreDuplicates:
          false,
      });

  if (error) {
    console.error(
      'Supabase upsert failed',
      error
    );

    throw new Error(
      `Failed storing embeddings: ${error.message}`
    );
  }

  console.log(
    `Successfully stored ${rows.length} chunks`
  );

  console.log(
    '\n===================================='
  );

  console.log(
    'VECTOR STORAGE COMPLETE'
  );

  console.log(
    '===================================='
  );
}

// ==========================================
// VECTOR SEARCH
// ==========================================

export async function searchSimilarChunks(
  queryEmbedding: number[],
  topK = 10
) {
  console.log(
    '\n===================================='
  );

  console.log(
    'VECTOR SEARCH'
  );

  console.log(
    '===================================='
  );

  console.log(
    `Top K: ${topK}`
  );

  const { data, error } =
    await supabase.rpc(
      'match_documents',
      {
        query_embedding:
          queryEmbedding,

        match_count: topK,
      }
    );

  if (error) {
    console.error(
      'Vector search failed',
      error
    );

    throw new Error(
      `Vector search failed: ${error.message}`
    );
  }

  // ======================================
  // DEDUPE RESULTS
  // ======================================

  const deduped: any[] = [];

  const seenChunkIds =
    new Set<string>();

  const seenContents =
    new Set<string>();

  for (const item of data || []) {
    // dedupe chunk id
    if (
      seenChunkIds.has(
        item.chunk_id
      )
    ) {
      continue;
    }

    // dedupe similar content
    const normalizedContent =
      item.content
        .slice(0, 300)
        .trim();

    if (
      seenContents.has(
        normalizedContent
      )
    ) {
      continue;
    }

    seenChunkIds.add(
      item.chunk_id
    );

    seenContents.add(
      normalizedContent
    );

    deduped.push(item);

    // stop once enough
    if (
      deduped.length >= topK
    ) {
      break;
    }
  }

  console.log(
    `Retrieved ${deduped.length} unique matches`
  );

  // ======================================
  // DEBUG OUTPUT
  // ======================================

  if (deduped.length) {
    console.log(
      '\nTOP MATCHES:\n'
    );

    deduped.forEach(
      (
        item: any,
        index: number
      ) => {
        console.log(
          `#${index + 1}`
        );

        console.log(
          `Similarity: ${item.similarity.toFixed(
            4
          )}`
        );

        console.log(
          `Title: ${item.source_title}`
        );

        console.log(
          `Heading: ${item.heading}`
        );

        console.log(
          `Chunk ID: ${item.chunk_id}`
        );

        console.log(
          `Preview:\n${item.content.slice(
            0,
            250
          )}...\n`
        );
      }
    );
  }

  return deduped;
}