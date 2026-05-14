import { EmbeddingChunk } from "../embeddings/types";

import { embedText } from "../embeddings/proivders/bge";

// ==========================================
// COSINE SIMILARITY
// ==========================================

export function cosineSimilarity(
  a: number[],
  b: number[]
): number {
  if (a.length !== b.length) {
    throw new Error('Vector dimensions do not match');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];

    normA += a[i] * a[i];

    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ==========================================
// SEARCH CHUNKS
// ==========================================

export async function searchChunks(
  query: string,
  chunks: EmbeddingChunk[],
  topK = 5
) {
  console.log('\n====================================');
  console.log('SEMANTIC SEARCH');
  console.log('====================================');

  console.log(`Query: ${query}`);

  // embed query
  const queryEmbedding = await embedText(query);

  console.log(
    `Query embedding dimensions: ${queryEmbedding.length}`
  );

  // compute similarity
  const scored = chunks.map((chunk) => {
    const score = cosineSimilarity(
      queryEmbedding,
      chunk.embedding
    );

    return {
      chunk,
      score,
    };
  });

  // sort descending
  scored.sort((a, b) => b.score - a.score);

  const topResults = scored.slice(0, topK);

  console.log('\nTOP RESULTS:\n');

  topResults.forEach((result, index) => {
    console.log(`\n#${index + 1}`);
    console.log(`Score: ${result.score.toFixed(4)}`);
    console.log(`Heading: ${result.chunk.heading}`);
    console.log(`Source: ${result.chunk.sourceTitle}`);

    console.log(
      `Preview:\n${result.chunk.text.slice(0, 300)}...\n`
    );
  });

  return topResults;
}