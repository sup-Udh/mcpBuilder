// app/api/retrieve/route.ts

import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { embedText } from '@/lib/embeddings/proivders/openai';

import { searchSimilarChunks } from '@/lib/vector/supabase';

export async function POST(
  req: NextRequest
) {
  try {
    console.log(
      '\n===================================='
    );

    console.log(
      'RETRIEVAL REQUEST'
    );

    console.log(
      '===================================='
    );

    // ======================================
    // BODY
    // ======================================

    const {
      query,
      serverId,
      topK,
    } = await req.json();

    // ======================================
    // VALIDATION
    // ======================================

    if (!query) {
      return NextResponse.json(
        {
          error:
            'Query is required',
        },
        {
          status: 400,
        }
      );
    }

    if (!serverId) {
      return NextResponse.json(
        {
          error:
            'Server ID is required',
        },
        {
          status: 400,
        }
      );
    }

    console.log(
      `Server ID: ${serverId}`
    );

    console.log(
      `Query: ${query}`
    );

    // ======================================
    // EMBED QUERY
    // ======================================

    const embedding =
      await embedText(query);

    console.log(
      `Generated embedding (${embedding.length} dimensions)`
    );

    // ======================================
    // VECTOR SEARCH
    // ======================================

    const chunks =
      await searchSimilarChunks(
        embedding,
        serverId,
        topK || 8
      );

    console.log(
      `Retrieved ${chunks.length} chunks`
    );

    // ======================================
    // RESPONSE
    // ======================================

    return NextResponse.json({
      success: true,

      query,

      serverId,

      chunks,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error.message ||
          'Retrieval failed',
      },
      {
        status: 500,
      }
    );
  }
}