import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { getServiceSupabase } from '@/lib/supabase/server';

// ==========================================
// POST /api/user/delete
// ==========================================

export async function POST(
  req: NextRequest
) {
  try {
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
    // DELETE USER
    // ======================================

    console.log(`Deleting user account: ${userId}`);

    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Failed to delete user:', deleteError);
      return NextResponse.json(
        { error: deleteError.message || 'Failed to delete user' },
        { status: 500 }
      );
    }

    console.log(`Successfully deleted user account: ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete account API error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Delete account failed',
      },
      { status: 500 }
    );
  }
}
