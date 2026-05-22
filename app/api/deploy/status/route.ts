// app/api/deploy/status/route.ts

import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { getServiceSupabase } from '@/lib/supabase/server';

// ==========================================
// GET /api/deploy/status?serverId=xxx
// ==========================================

export async function GET(
  req: NextRequest
) {
  try {
    const serverId =
      req.nextUrl.searchParams.get(
        'serverId'
      );

    if (!serverId) {
      return NextResponse.json(
        {
          error:
            'serverId query parameter is required',
        },
        { status: 400 }
      );
    }

    // ======================================
    // FETCH SERVER STATUS
    // ======================================

    const supabase = getServiceSupabase();

    const { data, error } =
      await supabase
        .from('mcp_servers')
        .select(
          'id, name, source_url, source_type, deployment_status, ingest_status, endpoint, total_documents, total_chunks, total_embeddings, error_message, created_at, updated_at'
        )
        .eq('id', serverId)
        .single();

    if (error || !data) {
      return NextResponse.json(
        {
          error:
            'Server not found',
        },
        { status: 404 }
      );
    }

    // ======================================
    // RESPONSE
    // ======================================

    return NextResponse.json({
      success: true,

      server: {
        id: (data as any).id,
        name: (data as any).name,
        sourceUrl: (data as any).source_url,
        sourceType: (data as any).source_type,
        deploymentStatus:
          (data as any).deployment_status,
        ingestStatus:
          (data as any).ingest_status,
        endpoint: (data as any).endpoint,
        totalDocuments:
          (data as any).total_documents,
        totalChunks:
          (data as any).total_chunks,
        totalEmbeddings:
          (data as any).total_embeddings,
        errorMessage:
          (data as any).error_message,
        createdAt: (data as any).created_at,
        updatedAt: (data as any).updated_at,
      },
    });
  } catch (error: any) {
    console.error(
      'Status check error:',
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          'Status check failed',
      },
      { status: 500 }
    );
  }
}
