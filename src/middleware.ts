import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev_12345",
  }
);

export const config = {
  matcher: [
    /*
     * Match all protected paths, excluding:
     * - login
     * - api/auth (NextAuth API routes)
     * - static files & public images (_next, favicon, png, svg, etc.)
     */
    "/((?!login|api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff|woff2)).*)",
  ],
};
