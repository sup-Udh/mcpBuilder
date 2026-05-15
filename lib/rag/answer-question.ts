// lib/rag/answer-question.ts

import OpenAI from 'openai';

import { semanticSearch } from '../vector/search';

// ==========================================
// OPENAI CLIENT
// ==========================================

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ==========================================
// CONFIG
// ==========================================

// retrieve many chunks
const RETRIEVAL_COUNT = 20;

// only best chunks go to LLM
const LLM_CONTEXT_COUNT = 5;

// ==========================================
// ANSWER QUESTION
// ==========================================

export async function answerQuestion(
  question: string
) {
  console.log(
    '\n===================================='
  );

  console.log(
    'RAG QUESTION ANSWERING'
  );

  console.log(
    '===================================='
  );

  console.log(
    `Question: ${question}`
  );

  // ======================================
  // RETRIEVE MANY CHUNKS
  // ======================================

  const retrievedChunks =
    await semanticSearch(
      question,
      RETRIEVAL_COUNT
    );

  console.log(
    `Retrieved ${retrievedChunks.length} chunks`
  );

  // ======================================
  // SELECT BEST CHUNKS FOR LLM
  // ======================================

  const llmChunks =
    retrievedChunks.slice(
      0,
      LLM_CONTEXT_COUNT
    );

  console.log(
    `Selected ${llmChunks.length} chunks for LLM context`
  );

  // ======================================
  // BUILD CONTEXT
  // ======================================

  const context =
    llmChunks
      .map(
        (
          item: any,
          index: number
        ) => {
          return `
[DOCUMENT ${index + 1}]

Title:
${item.source_title}

Heading:
${item.heading}

Similarity:
${item.similarity}

Content:
${item.content}
`;
        }
      )
      .join('\n\n');

  console.log(
    '\n===================================='
  );

  console.log(
    'LLM CONTEXT'
  );

  console.log(
    '===================================='
  );

  console.log(
    `Context length: ${context.length} chars`
  );

  // ======================================
  // GENERATE ANSWER
  // ======================================

  console.log(
    '\n===================================='
  );

  console.log(
    'GENERATING ANSWER'
  );

  console.log(
    '===================================='
  );

  const response =
    await client.chat.completions.create({
      model: 'gpt-4.1-mini',

      temperature: 0.2,

      max_tokens: 500,

      messages: [
        {
          role: 'system',

          content: `
You are a retrieval-augmented assistant.

Answer the user's question ONLY using the provided context.

Rules:
- Do NOT use outside knowledge.
- Use the retrieved documents only.
- If the answer is unclear from the documents, say so.
- Prefer precise technical explanations.
- Synthesize across multiple documents if needed.
- Keep answers concise but informative.
`,
        },

        {
          role: 'user',

          content: `
CONTEXT:

${context}

QUESTION:

${question}
`,
        },
      ],
    });

  const answer =
    response.choices[0]
      ?.message?.content ||
    'No answer generated.';

  console.log(
    '\n===================================='
  );

  console.log(
    'ANSWER GENERATED'
  );

  console.log(
    '===================================='
  );

  // ======================================
  // RETURN EVERYTHING
  // ======================================

  return {
    answer,

    // ALL retrieved chunks
    retrievedChunks,

    // ONLY chunks sent to GPT
    llmChunks,
  };
}