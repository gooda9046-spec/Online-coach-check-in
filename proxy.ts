import { NextResponse, type NextRequest } from "next/server";

// Fast, Edge-safe gate: just checks the cookie is present. The actual page
// does the real session lookup against the database and redirects too, so
// this is a first line of defense, not the only one.
export function proxy(request: NextRequest) {
  if (!request.cookies.has("forge_session")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/product-demo"],
};
