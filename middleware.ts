import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let client-side handle all auth logic
  // The AuthPage and AdminLayout components will:
  // 1. Rehydrate auth store from localStorage
  // 2. Verify Firebase auth state
  // 3. Check admin permissions
  // 4. Redirect accordingly

  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/auth") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth"],
};
