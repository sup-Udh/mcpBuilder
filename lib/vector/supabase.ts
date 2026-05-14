// lib/vector/supabase.ts

import { createClient } from '@supabase/supabase-js';

import { EmbeddingChunk} from '../embeddings/types';

// ==========================================
// ENV VALIDATION
// ==========================================

const supabaseUrl = process.env.SUPABASE_URL;

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

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

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

// ==========================================
// STORE EMBEDDED CHUNKS
// ==========================================

export async function storeEmbeddedChunks(
  chunks: EmbeddingChunk[]
) {
  console.log('\n====================================');
  console.log('STORING EMBEDDINGS');
  console.log('====================================');

  console.log(`Chunks to store: ${chunks.length}`);

  if (chunks.length === 0) {
    console.warn('No chunks provided');

    return;
  }

  // ======================================
  // FORMAT FOR DB
  // ======================================

  const rows = chunks.map((chunk) => ({
    source_url: chunk.sourceUrl,

    source_title: chunk.sourceTitle,

    source_type: chunk.sourceType,

    heading: chunk.heading || null,

    chunk_index: chunk.chunkIndex,

    content: chunk.text,

    word_count: chunk.wordCount,

    embedding: chunk.embedding,

    embedding_model: chunk.embedingModel,
  }));

  console.log('Prepared database rows');

  // ======================================
  // INSERT
  // ======================================

  const { error } = await supabase
    .from('documents')
    .insert(rows);

  if (error) {
    console.error(
      'Supabase insert failed',
      error
    );

    throw new Error(
      `Failed storing embeddings: ${error.message}`
    );
  }

  console.log(
    `Successfully stored ${rows.length} chunks`
  );

  console.log('\n====================================');
  console.log('VECTOR STORAGE COMPLETE');
  console.log('====================================');
}

// ==========================================
// VECTOR SEARCH
// ==========================================

export async function searchSimilarChunks(
  queryEmbedding: number[],
  topK = 5
) {
  console.log('\n====================================');
  console.log('VECTOR SEARCH');
  console.log('====================================');

  console.log(`Top K: ${topK}`);

  const { data, error } = await supabase.rpc(
    'match_documents',
    {
      query_embedding: queryEmbedding,

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

  console.log(
    `Retrieved ${data?.length || 0} matches`
  );

  if (data?.length) {
    console.log('\nTOP MATCHES:\n');

    data.forEach((item: any, index: number) => {
      console.log(`#${index + 1}`);

      console.log(
        `Similarity: ${item.similarity.toFixed(4)}`
      );

      console.log(`Title: ${item.source_title}`);

      console.log(`Heading: ${item.heading}`);

      console.log(
        `Preview:\n${item.content.slice(0, 250)}...\n`
      );
    });
  }

  return data;
}