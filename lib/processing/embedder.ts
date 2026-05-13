import { GoogleGenerativeAI } from "@google/generative-ai";
import { TextChunk } from "./chunker";

const apiKey = process.env.GEMINI_API_KEY!;

const genAI = new GoogleGenerativeAI(apiKey);

export async function embedChunksGemini(
  chunks: TextChunk[]
): Promise<TextChunk[]> {

  if (!apiKey) {
    console.warn("Missing GEMINI_API_KEY");
    return chunks;
  }

  // IMPORTANT:
  // USE embedding-001
  const model = genAI.getGenerativeModel({
    model: "embedding-001",
  });

  for (const chunk of chunks) {
    try {

      const result = await model.embedContent({
        content: {
          role: "user",
          parts: [
            {
              text: chunk.text,
            },
          ],
        },
      });

      chunk.embedding = result.embedding.values;

    } catch (err) {
      console.error("Failed embedding chunk:", err);
    }
  }

  return chunks;
}