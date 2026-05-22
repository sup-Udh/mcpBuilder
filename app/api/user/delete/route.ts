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

    const cookieHeader =
      req.headers.get('cookie');

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

    if (!userId && cookieHeader) {
      const cookies = cookieHeader
        .split(';')
        .map((c) => c.trim());

      for (const cookie of cookies) {
        if (
          cookie.includes('sb-') &&
          cookie.includes('-auth-token')
        ) {
          try {
            const value =
              cookie.split('=').slice(1).join('=');

            const decoded = decodeURIComponent(value);
            const parsed = JSON.parse(decoded);

            const accessToken =
              parsed?.access_token ||
              (Array.isArray(parsed) ? parsed[0] : null);

            if (accessToken) {
              const {
                data: { user },
              } = await supabase.auth.getUser(
                accessToken
              );

              if (user) {
                userId = user.id;
                break;
              }
            }
          } catch {
            // Continue trying other cookies
          }
        }
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
