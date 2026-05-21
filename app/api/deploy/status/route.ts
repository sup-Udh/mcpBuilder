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
        id: data.id,
        name: data.name,
        sourceUrl: data.source_url,
        sourceType: data.source_type,
        deploymentStatus:
          data.deployment_status,
        ingestStatus:
          data.ingest_status,
        endpoint: data.endpoint,
        totalDocuments:
          data.total_documents,
        totalChunks:
          data.total_chunks,
        totalEmbeddings:
          data.total_embeddings,
        errorMessage:
          data.error_message,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
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
