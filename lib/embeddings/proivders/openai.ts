// lib/embeddings/proivders/openai.ts

import OpenAI from 'openai';

// ==========================================
// CLIENT
// ==========================================

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = 'text-embedding-3-small';
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

// ==========================================
// SLEEP
// ==========================================

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ==========================================
// EMBED SINGLE TEXT (with retry)
// ==========================================

export async function embedText(
  text: string
): Promise<number[]> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await client.embeddings.create({
        model: MODEL,
        input: text,
      });

      return response.data[0].embedding;
    } catch (error: any) {
      const isRateLimit = error?.status === 429;
      const isServerError = error?.status >= 500;

      if (attempt === MAX_RETRIES - 1) {
        throw error;
      }

      if (isRateLimit) {
        const retryAfter = parseInt(error?.headers?.['retry-after'] || '0', 10);
        const waitMs = retryAfter > 0
          ? retryAfter * 1000
          : BASE_DELAY_MS * Math.pow(2, attempt);

        console.warn(
          `Rate limited. Waiting ${waitMs}ms before retry ${attempt + 1}/${MAX_RETRIES}`
        );

        await sleep(waitMs);
      } else if (isServerError) {
        const waitMs = BASE_DELAY_MS * Math.pow(2, attempt);

        console.warn(
          `Server error ${error?.status}. Waiting ${waitMs}ms before retry ${attempt + 1}/${MAX_RETRIES}`
        );

        await sleep(waitMs);
      } else {
        throw error;
      }
    }
  }

  throw new Error('Embedding failed after all retries');
}

// ==========================================
// EMBED BATCH (multiple texts in one call)
// ==========================================

export async function embedBatch(
  texts: string[]
): Promise<number[][]> {
  if (texts.length === 0) return [];

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await client.embeddings.create({
        model: MODEL,
        input: texts,
      });

      // Sort by index to ensure correct ordering
      const sorted = response.data.sort((a, b) => a.index - b.index);

      return sorted.map((item) => item.embedding);
    } catch (error: any) {
      const isRateLimit = error?.status === 429;
      const isServerError = error?.status >= 500;

      if (attempt === MAX_RETRIES - 1) {
        throw error;
      }

      if (isRateLimit || isServerError) {
        const waitMs = isRateLimit
          ? (parseInt(error?.headers?.['retry-after'] || '0', 10) * 1000 || BASE_DELAY_MS * Math.pow(2, attempt))
          : BASE_DELAY_MS * Math.pow(2, attempt);

        console.warn(
          `${isRateLimit ? 'Rate limited' : 'Server error'}. Waiting ${waitMs}ms before retry ${attempt + 1}/${MAX_RETRIES}`
        );

        await sleep(waitMs);
      } else {
        throw error;
      }
    }
  }

  throw new Error('Batch embedding failed after all retries');
}

// ==========================================
// ESTIMATE TOKENS
// ==========================================

export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}