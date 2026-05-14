import { Chunk } from "../processing/types";

import { EmbeddingChunk } from "./types";

import { embedText } from "./proivders/openai";
// ==========================================
// EMBED SINGLE CHUNK
// ==========================================

export async function embedChunk(
  chunk: Chunk
): Promise<EmbeddingChunk> {
  console.log(
    `Embedding chunk ${chunk.chunkIndex} (${chunk.wordCount} words)`
  );

  const embedding = await embedText(chunk.text);

  return {
    ...chunk,

    embedding,

    embedingModel: 'all-MiniLM-L6-v2',

    embeddingDimensions: embedding.length,
  };
}

// ==========================================
// EMBED MULTIPLE CHUNKS
// ==========================================

export async function embedChunks(
  chunks: Chunk[]
): Promise<EmbeddingChunk[]> {
  console.log('\n====================================');
  console.log('STARTING EMBEDDING PIPELINE');
  console.log('====================================');

  console.log(`Chunks to embed: ${chunks.length}`);

  const embeddedChunks: EmbeddingChunk[] = [];

  for (const chunk of chunks) {
    try {
      const embedded = await embedChunk(chunk);

      embeddedChunks.push(embedded);

      console.log(
        `Embedded chunk ${chunk.chunkIndex} → ${embedded.embeddingDimensions} dimensions`
      );
    } catch (error) {
      console.error(
        `Failed embedding chunk ${chunk.chunkIndex}`,
        error
      );
    }
  }

  console.log('\n====================================');
  console.log('EMBEDDING COMPLETE');
  console.log('====================================');

  console.log(
    `Successfully embedded ${embeddedChunks.length} chunks`
  );

  return embeddedChunks;
}