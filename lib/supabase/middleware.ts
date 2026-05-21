import {
  createServerClient,
  type CookieOptions,
} from "@supabase/ssr";

import { NextResponse, type NextRequest }
from "next/server";

export async function updateSession(
  request: NextRequest
) {
  let response = NextResponse.next({
    request,
  });

  const supabase =
    createServerClient(
      process.env
        .NEXT_PUBLIC_SUPABASE_URL!,

      process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY!,

      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)
              ?.value;
          },

          set(
            name: string,
            value: string,
            options: CookieOptions
          ) {
            request.cookies.set({
              name,
              value,
              ...options,
            });

            response =
              NextResponse.next({
                request,
              });

            response.cookies.set({
              name,
              value,
              ...options,
            });
          },

          remove(
            name: string,
            options: CookieOptions
          ) {
            request.cookies.set({
              name,
              value: "",
              ...options,
            });

            response =
              NextResponse.next({
                request,
              });

            response.cookies.set({
              name,
              value: "",
              ...options,
            });
          },
        },
      }
    );

  // ==========================================
  // GET USER
  // ==========================================

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  // ==========================================
  // PROTECTED ROUTES
  // ==========================================

  const protectedRoutes = [
    "/dashboard",
    "/servers",
    "/create",
  ];

  const isProtected =
    protectedRoutes.some(
      (route) =>
        request.nextUrl.pathname.startsWith(
          route
        )
    );

  // ==========================================
  // REDIRECT IF NOT LOGGED IN
  // ==========================================

  if (
    isProtected &&
    !user
  ) {
    const redirectUrl =
      request.nextUrl.clone();

    redirectUrl.pathname =
      "/login";

    return NextResponse.redirect(
      redirectUrl
    );
  }

  // ==========================================
  // REDIRECT LOGGED-IN USERS
  // ==========================================

  if (
    user &&
    request.nextUrl.pathname ===
      "/login"
  ) {
    const redirectUrl =
      request.nextUrl.clone();

    redirectUrl.pathname =
      "/dashboard";

    return NextResponse.redirect(
      redirectUrl
    );
  }

  return response;
}