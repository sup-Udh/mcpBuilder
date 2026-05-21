// lib/vector/supabase.ts

import { createClient } from '@supabase/supabase-js';

import { EmbeddingChunk } from '../embeddings/types';

import { IngestedItem } from '../ingestion/types';

// ==========================================
// ENV VALIDATION
// ==========================================

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;

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
// UPDATE SERVER STATUS
// ==========================================

export async function updateServerStatus(
  serverId: string,
  updates: {
    deployment_status?: string;
    ingest_status?: string;
    endpoint?: string;
    error_message?: string;
    total_documents?: number;
    total_chunks?: number;
    total_embeddings?: number;
  }
) {
  const { error } = await supabase
    .from('mcp_servers')
    .update(updates)
    .eq('id', serverId);

  if (error) {
    console.error('Failed to update server status:', error);
    throw new Error(`Failed to update server status: ${error.message}`);
  }

  console.log(
    `Updated server ${serverId}: ${JSON.stringify(updates)}`
  );
}

// ==========================================
// STORE DOCUMENTS
// ==========================================

export async function storeDocuments(
  serverId: string,
  documents: IngestedItem[]
): Promise<{ id: string; url: string }[]> {
  console.log('\n====================================');
  console.log('STORING DOCUMENTS');
  console.log('====================================');
  console.log(`Documents to store: ${documents.length}`);

  const rows = documents.map((doc) => ({
    server_id: serverId,
    title: doc.title,
    url: doc.url,
    content: doc.content,
    metadata: doc.metadata || {},
  }));

  const { data, error } = await supabase
    .from('mcp_documents')
    .insert(rows)
    .select('id, url');

  if (error) {
    console.error('Failed to store documents:', error);
    throw new Error(`Failed to store documents: ${error.message}`);
  }

  console.log(`Successfully stored ${data.length} documents`);

  return data;
}

// ==========================================
// STORE EMBEDDED CHUNKS
// ==========================================

export async function storeEmbeddedChunks(
  chunks: EmbeddingChunk[],
  documentUrlToId?: Map<string, string>
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
  // FORMAT DB ROWS
  // ======================================

  const rows = chunks.map((chunk) => ({
    server_id: chunk.serverId,
    document_id: documentUrlToId?.get(chunk.sourceUrl) || null,
    chunk_index: chunk.chunkIndex,
    text: chunk.text,
    heading: chunk.heading || null,
    source_url: chunk.sourceUrl,
    embedding: chunk.embedding,
    metadata: {
      source_title: chunk.sourceTitle,
      source_type: chunk.sourceType,
      word_count: chunk.wordCount,
      embedding_model: chunk.embedingModel,
      ...(chunk.metadata || {}),
    },
  }));

  // ======================================
  // BATCH INSERT (50 at a time)
  // ======================================

  const BATCH_SIZE = 50;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);

    const { error } = await supabase
      .from('mcp_chunks')
      .insert(batch);

    if (error) {
      console.error(
        `Failed storing batch ${Math.floor(i / BATCH_SIZE) + 1}:`,
        error
      );
      throw new Error(
        `Failed storing embeddings: ${error.message}`
      );
    }

    console.log(
      `Stored batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} chunks`
    );
  }

  console.log(`Successfully stored ${rows.length} chunks`);

  console.log('\n====================================');
  console.log('VECTOR STORAGE COMPLETE');
  console.log('====================================');
}

// ==========================================
// VECTOR SEARCH
// ==========================================

export async function searchSimilarChunks(
  queryEmbedding: number[],
  serverId: string,
  topK = 20
) {
  console.log('\n====================================');
  console.log('VECTOR SEARCH');
  console.log('====================================');
  console.log(`Server ID: ${serverId}`);
  console.log(`Requested retrieval count: ${topK}`);

  // ======================================
  // FETCH CANDIDATES VIA RPC
  // ======================================

  const fetchCount = Math.max(topK * 3, 30);

  const { data, error } = await supabase.rpc(
    'match_mcp_chunks',
    {
      query_embedding: queryEmbedding,
      target_server_id: serverId,
      match_count: fetchCount,
    }
  );

  if (error) {
    console.error('Vector search failed', error);
    throw new Error(`Vector search failed: ${error.message}`);
  }

  // ======================================
  // DEDUPE
  // ======================================

  const deduped: any[] = [];
  const seenContentFingerprints = new Set<string>();

  for (const item of data || []) {
    const fingerprint = item.text
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 500);

    if (seenContentFingerprints.has(fingerprint)) {
      continue;
    }

    seenContentFingerprints.add(fingerprint);
    deduped.push(item);

    if (deduped.length >= topK) {
      break;
    }
  }

  console.log(`Retrieved ${deduped.length} chunks`);

  return deduped;
}