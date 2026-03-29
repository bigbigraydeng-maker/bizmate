import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

import {
  chatPathForLocale,
  getLocaleFromPath,
  isOnboardingPath,
  isProtectedDashboardPath,
  loginPathForLocale,
  onboardingPathForLocale,
} from "@/lib/auth/path-utils";
import { routing } from "./i18n/routing";

const handleI18n = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const response = handleI18n(request);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const locale = getLocaleFromPath(pathname);

  if (isProtectedDashboardPath(pathname) && !user) {
    const login = loginPathForLocale(locale);
    return NextResponse.redirect(new URL(login, request.url));
  }

  if (user) {
    const { data: companies } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);

    const hasCompany = Boolean(companies?.length);

    if (
      !hasCompany &&
      isProtectedDashboardPath(pathname) &&
      !isOnboardingPath(pathname)
    ) {
      return NextResponse.redirect(
        new URL(onboardingPathForLocale(locale), request.url),
      );
    }

    if (hasCompany && isOnboardingPath(pathname)) {
      return NextResponse.redirect(
        new URL(chatPathForLocale(locale), request.url),
      );
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|auth|.*\\..*).*)"],
};
