// lib/embeddings/embedder.ts

import { Chunk } from '../processing/types';

import { EmbeddingChunk } from './types';

import {
  embedBatch,
  estimateTokenCount,
} from './proivders/openai';

// ==========================================
// CONFIG
// ==========================================

const BATCH_SIZE = 20;
const MAX_TOKENS_PER_BATCH = 8000;

// ==========================================
// SLEEP
// ==========================================

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ==========================================
// EMBED SINGLE CHUNK (kept for compatibility)
// ==========================================

export async function embedChunk(
  chunk: Chunk
): Promise<EmbeddingChunk> {
  console.log(
    `Embedding chunk ${chunk.chunkIndex} (${chunk.wordCount} words)`
  );

  const [embedding] = await embedBatch([chunk.text]);

  return {
    ...chunk,
    embedding,
    embedingModel: 'text-embedding-3-small',
    embeddingDimensions: embedding.length,
  };
}

// ==========================================
// CREATE BATCHES
// ==========================================

function createBatches(chunks: Chunk[]): Chunk[][] {
  const batches: Chunk[][] = [];
  let currentBatch: Chunk[] = [];
  let currentTokens = 0;

  for (const chunk of chunks) {
    const tokens = estimateTokenCount(chunk.text);

    if (
      currentBatch.length >= BATCH_SIZE ||
      (currentTokens + tokens > MAX_TOKENS_PER_BATCH && currentBatch.length > 0)
    ) {
      batches.push(currentBatch);
      currentBatch = [];
      currentTokens = 0;
    }

    currentBatch.push(chunk);
    currentTokens += tokens;
  }

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  return batches;
}

// ==========================================
// EMBED MULTIPLE CHUNKS (batch processing)
// ==========================================

export async function embedChunks(
  chunks: Chunk[]
): Promise<EmbeddingChunk[]> {
  console.log('\n====================================');
  console.log('STARTING EMBEDDING PIPELINE');
  console.log('====================================');
  console.log(`Chunks to embed: ${chunks.length}`);

  const batches = createBatches(chunks);

  console.log(
    `Created ${batches.length} batches (max ${BATCH_SIZE} chunks, max ${MAX_TOKENS_PER_BATCH} tokens per batch)`
  );

  const embeddedChunks: EmbeddingChunk[] = [];
  let processedCount = 0;

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];

    console.log(
      `\nProcessing batch ${i + 1}/${batches.length} (${batch.length} chunks)`
    );

    try {
      const texts = batch.map((chunk) => chunk.text);
      const embeddings = await embedBatch(texts);

      for (let j = 0; j < batch.length; j++) {
        embeddedChunks.push({
          ...batch[j],
          embedding: embeddings[j],
          embedingModel: 'text-embedding-3-small',
          embeddingDimensions: embeddings[j].length,
        });
      }

      processedCount += batch.length;

      console.log(
        `Batch ${i + 1} complete. Total embedded: ${processedCount}/${chunks.length}`
      );

      // Small delay between batches to avoid rate limits
      if (i < batches.length - 1) {
        await sleep(200);
      }
    } catch (error) {
      console.error(`Batch ${i + 1} failed. Falling back to individual embedding.`);

      // Fallback: embed individually
      for (const chunk of batch) {
        try {
          const [embedding] = await embedBatch([chunk.text]);

          embeddedChunks.push({
            ...chunk,
            embedding,
            embedingModel: 'text-embedding-3-small',
            embeddingDimensions: embedding.length,
          });

          processedCount++;

          console.log(
            `Individual embed: chunk ${chunk.chunkIndex} → ${embedding.length} dimensions`
          );

          await sleep(300);
        } catch (individualError) {
          console.error(
            `Failed embedding chunk ${chunk.chunkIndex}`,
            individualError
          );
        }
      }
    }
  }

  console.log('\n====================================');
  console.log('EMBEDDING COMPLETE');
  console.log('====================================');
  console.log(
    `Successfully embedded ${embeddedChunks.length}/${chunks.length} chunks`
  );

  return embeddedChunks;
}