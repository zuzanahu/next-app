import { NextRequest, NextResponse } from "next/server";
import { getUserFromSession } from "./utils/getUserFromSession";

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;

  if (nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (nextUrl.pathname === "/login") {
    const user = await getUserFromSession();

    if (user) {
      return NextResponse.redirect(new URL("/predmety", request.url));
    }
  }

  if (nextUrl.pathname.startsWith("/administrace")) {
    const session = await getUserFromSession();

    // If user is not logged in and reaches for administrace page then redirect him
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    //if user wants to go to administration and is logged in, but doensn't have the necessary permissions, redirect to predmety
    if (session.user.role?.canViewAdministration === false) {
      return NextResponse.redirect(new URL("/predmety", request.url));
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  // use nodejs because of connecting to the database
  runtime: "nodejs",
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
