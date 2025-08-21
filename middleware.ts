import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuth } from "firebase/auth";
import { rdTechAuth, rdTechDb } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { collections } from "./firebase";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const user = rdTechAuth.currentUser;
    if (!user) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    const adminDoc = await getDoc(doc(rdTechDb, collections.admins, "admins"));
    const adminEmails = adminDoc.exists() ? adminDoc.data().emails : [];
    if (!adminEmails.includes(user.email)) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
