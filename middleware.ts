import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if trying to access /admin
  if (pathname.startsWith("/admin")) {
    const authToken = request.cookies.get("auth-token")?.value;

    if (!authToken) {
      console.log("Middleware: No auth token, redirecting to /auth");
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    // Only admin users should access /admin
    if (authToken !== "admin") {
      console.log("Middleware: User not admin, redirecting to /");
      return NextResponse.redirect(new URL("/", request.url));
    }

    console.log("Middleware: Admin access granted");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
