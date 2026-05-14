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

    const result =
      await answerQuestion(
        question
      );

    return NextResponse.json({
      success: true,

      answer:
        result.answer,

      retrievedChunks:
        result.retrievedChunks,
    });
  } catch (error: any) {
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