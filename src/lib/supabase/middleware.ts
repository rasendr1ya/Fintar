import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Always call getUser() to refresh the session token.
  // This is required for the SSR auth pattern — Supabase needs to read
  // and potentially refresh the access token on every request.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // ── Route Classification ──────────────────────────────────
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/verify-code") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  const isPublicPage =
    pathname === "/" ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/faq") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/auth/");

  const isOnboarding = pathname.startsWith("/onboarding");

  const isAdminRoute = pathname.startsWith("/admin");

  // Everything that isn't public, auth, or onboarding requires auth
  const isProtectedRoute = !isAuthPage && !isPublicPage && !isOnboarding;

  // ── Route Guards ──────────────────────────────────────────

  // 1. Unauthenticated user trying to access protected route → login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // 2. Unauthenticated user trying to access onboarding → login
  if (!user && isOnboarding) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 3. Authenticated user on login/register pages → redirect to learn
  //    BUT allow /verify-code, /forgot-password, /reset-password even when logged in
  //    because users may need to verify OTP right after signup (they are "authenticated"
  //    in Supabase's eyes once signUp succeeds, even before email confirmation).
  if (user && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/learn";
    return NextResponse.redirect(url);
  }

  // 4. Admin route guard
  if (user && isAdminRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      const url = request.nextUrl.clone();
      url.pathname = "/learn";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
