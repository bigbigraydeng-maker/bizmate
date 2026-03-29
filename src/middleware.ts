import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Task 1.2: wire next-intl createMiddleware. Task 1.4: auth for (dashboard). */
export function middleware(request: NextRequest) {
  void request;
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
