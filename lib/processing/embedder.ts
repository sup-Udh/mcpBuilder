import { TextChunk } from './chunker';

/**
 * Embeds chunks using Google's Gemini Embedding model (text-embedding-004).
 */
export async function embedChunksGemini(chunks: TextChunk[]): Promise<TextChunk[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('your-gemini-api-key')) {
    console.warn("GEMINI_API_KEY is not set. Skipping Gemini embeddings.");
    return chunks;
  }

  // Gemini currently prefers single inputs or specific batching, we will iterate
  for (const chunk of chunks) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'models/text-embedding-004',
          content: {
            parts: [{ text: chunk.text }]
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      chunk.embedding = data.embedding.values;
    } catch (error) {
      console.error("Failed to generate Gemini embedding for chunk", error);
    }
  }

  return chunks;
}
