// app/api/chat/route.ts

import {
  NextRequest,
  NextResponse,
} from 'next/server';

import {
  answerQuestion,
} from '@/lib/rag/answer-question';

export async function POST(
  req: NextRequest
) {
  try {
    console.log(
      '\n===================================='
    );

    console.log(
      'CHAT REQUEST'
    );

    console.log(
      '===================================='
    );

    const { question } =
      await req.json();

    // ======================================
    // VALIDATION
    // ======================================

    if (!question) {
      return NextResponse.json(
        {
          error:
            'Question is required',
        },

        {
          status: 400,
        }
      );
    }

    console.log(
      `Incoming question: ${question}`
    );

    // ======================================
    // RUN RAG PIPELINE
    // ======================================

    const result =
      await answerQuestion(
        question
      );

    console.log(
      '\n===================================='
    );

    console.log(
      'CHAT RESPONSE READY'
    );

    console.log(
      '===================================='
    );

    console.log(
      `Retrieved chunks: ${result.retrievedChunks.length}`
    );

    console.log(
      `LLM chunks: ${result.llmChunks.length}`
    );

    // ======================================
    // RETURN RESPONSE
    // ======================================

    return NextResponse.json({
      success: true,

      answer:
        result.answer,

      // ALL retrieved chunks
      retrievedChunks:
        result.retrievedChunks,

      // ONLY chunks sent to GPT
      llmChunks:
        result.llmChunks,

      retrievalMetadata: {
        totalRetrieved:
          result.retrievedChunks
            .length,

        llmContextChunks:
          result.llmChunks
            .length,
      },
    });
  } catch (error: any) {
    console.error(
      '\n===================================='
    );

    console.error(
      'CHAT PIPELINE FAILED'
    );

    console.error(
      '===================================='
    );

    console.error(error);

    return NextResponse.json(
      {
        error:
          error.message ||
          'Chat failed',
      },

      {
        status: 500,
      }
    );
  }
}