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

      server_id:
        chunk.serverId,

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

  serverId: string,

  topK = 20
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
    `Server ID: ${serverId}`
  );

  console.log(
    `Requested retrieval count: ${topK}`
  );

  // ======================================
  // FETCH LARGE CANDIDATE POOL
  // ======================================

  const fetchCount =
    Math.max(topK * 3, 30);

  const { data, error } =
    await supabase.rpc(
      'match_documents',
      {
        query_embedding:
          queryEmbedding,

        target_server_id:
          serverId,

        match_count:
          fetchCount,
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
  // DEDUPE
  // ======================================

  const deduped: any[] = [];

  const seenChunkIds =
    new Set<string>();

  const seenContentFingerprints =
    new Set<string>();

  for (const item of data || []) {
    if (
      item.chunk_id &&
      seenChunkIds.has(
        item.chunk_id
      )
    ) {
      continue;
    }

    const fingerprint =
      item.content
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 500);

    if (
      seenContentFingerprints.has(
        fingerprint
      )
    ) {
      continue;
    }

    if (item.chunk_id) {
      seenChunkIds.add(
        item.chunk_id
      );
    }

    seenContentFingerprints.add(
      fingerprint
    );

    deduped.push(item);

    if (
      deduped.length >= topK
    ) {
      break;
    }
  }

  console.log(
    `Retrieved ${deduped.length} chunks`
  );

  return deduped;
}