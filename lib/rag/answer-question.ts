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
  // RETRIEVE CONTEXT
  // ======================================

  const results =
    await semanticSearch(
      question,
      5
    );

  // ======================================
  // BUILD CONTEXT
  // ======================================

  const context = results
    .map(
      (
        item: any,
        index: number
      ) => {
        return `
[DOCUMENT ${index + 1}]

Title: ${item.source_title}

Heading: ${item.heading}

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
    'GENERATING ANSWER'
  );

  console.log(
    '===================================='
  );

  // ======================================
  // GENERATE ANSWER
  // ======================================

  const response =
    await client.chat.completions.create({
      model: 'gpt-4.1-mini',

      temperature: 0.2,

      max_tokens: 500,

      messages: [
        {
          role: 'system',

          content: `
You are a retrieval-augmented assistant..

Answer the user's question ONLY using the provided context.

Rules:
- Do NOT use outside knowledge.
- If the answer is not in the context, say:
  "I could not find the answer in the provided documents."
- Be concise but accurate.
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
      ?.message?.content;

  console.log(
    '\n===================================='
  );

  console.log(
    'ANSWER GENERATED'
  );

  console.log(
    '===================================='
  );

  return {
    answer,

    retrievedChunks: results,
  };
}