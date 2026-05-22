// app/api/mcp/delete/route.ts

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { getServiceSupabase } from '@/lib/supabase/server';

// ==========================================
// POST /api/mcp/delete
// ==========================================

export async function POST(
  req: NextRequest
) {
  try {
    const { serverId } = await req.json();

    if (!serverId) {
      return NextResponse.json(
        { error: 'serverId is required' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // ======================================
    // AUTH CHECK
    // ======================================

    const authHeader =
      req.headers.get('authorization');

    let userId: string | null = null;

    if (authHeader) {
      const token = authHeader.replace(
        'Bearer ',
        ''
      );

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (!error && user) {
        userId = user.id;
      }
    }

    if (!userId) {
      const cookieStore = await cookies();
      const clientSupabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: any) {
              try {
                cookieStore.set({ name, value, ...options });
              } catch {}
            },
            remove(name: string, options: any) {
              try {
                cookieStore.set({ name, value: "", ...options });
              } catch {}
            },
          },
        }
      );

      const {
        data: { user },
      } = await clientSupabase.auth.getUser();

      if (user) {
        userId = user.id;
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // ======================================
    // VERIFY OWNERSHIP
    // ======================================

    const { data: server, error: fetchError } =
      await supabase
        .from('mcp_servers')
        .select('id, user_id, name')
        .eq('id', serverId)
        .single();

    if (fetchError || !server) {
      return NextResponse.json(
        { error: 'Server not found' },
        { status: 404 }
      );
    }

    if ((server as any).user_id !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to delete this server' },
        { status: 403 }
      );
    }

    // ======================================
    // DELETE RELATED DATA
    // (chunks first, then documents, then server)
    // ======================================

    console.log(
      `Deleting MCP server: ${(server as any).name} (${serverId})`
    );

    // 1. Delete chunks
    const { error: chunksError } =
      await supabase
        .from('mcp_chunks')
        .delete()
        .eq('server_id', serverId);

    if (chunksError) {
      console.error(
        'Failed to delete chunks:',
        chunksError
      );
    }

    // 2. Delete documents
    const { error: docsError } =
      await supabase
        .from('mcp_documents')
        .delete()
        .eq('server_id', serverId);

    if (docsError) {
      console.error(
        'Failed to delete documents:',
        docsError
      );
    }

    // 3. Delete the server row
    const { error: serverError } =
      await supabase
        .from('mcp_servers')
        .delete()
        .eq('id', serverId);

    if (serverError) {
      console.error(
        'Failed to delete server:',
        serverError
      );

      return NextResponse.json(
        {
          error:
            serverError.message ||
            'Failed to delete server',
        },
        { status: 500 }
      );
    }

    console.log(
      `Successfully deleted MCP server: ${(server as any).name}`
    );

    return NextResponse.json({
      success: true,
      message: `Server "${(server as any).name}" deleted successfully`,
    });
  } catch (error: any) {
    console.error(
      'Delete API error:',
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          'Delete failed',
      },
      { status: 500 }
    );
  }
}
