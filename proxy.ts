import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { requireEnv } from "@/lib/env";
import {
  REFERRAL_COOKIE,
  REFERRAL_COOKIE_MAX_AGE,
  sanitizeReferral,
} from "@/lib/utils/referral";

const PUBLIC_ROUTES = [
  "/",
  "/join",
  "/verify",
  "/check-email",
  "/auth/confirm",
];

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isOnboardingRoute = pathname.startsWith("/onboarding");
  const isScheduleRoute = pathname.startsWith("/schedule");

  if (!user && !isPublicRoute && !isScheduleRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  if (user) {
    const { data: dbUser } = await supabase
      .from("users")
      .select("has_completed_onboarding")
      .eq("id", user.id)
      .single();

    const hasCompletedOnboarding = dbUser?.has_completed_onboarding ?? false;

    if (!hasCompletedOnboarding && !isPublicRoute && !isOnboardingRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/onboarding/profile";
      return NextResponse.redirect(redirectUrl);
    }

    if (hasCompletedOnboarding && isOnboardingRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/schedule";
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Capturing the referral here rather than in the page means it survives
  // without JavaScript and is written before anything renders. A Server
  // Component cannot set a cookie during render; middleware can.
  if (pathname === "/join") {
    const referral = sanitizeReferral(request.nextUrl.searchParams.get("ref"));
    if (referral) {
      supabaseResponse.cookies.set(REFERRAL_COOKIE, referral, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: REFERRAL_COOKIE_MAX_AGE,
      });
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Crawlers fetch the metadata files and the generated preview images with
    // no session, so those paths have to stay outside the auth gate above.
    // Otherwise every unfurl of a shared invite link gets a 307 to `/` where
    // the card should be, and the preview quietly disappears.
    "/((?!_next/static|_next/image|api/og|opengraph-image|twitter-image|icon|apple-icon|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
