import { NextRequest, NextResponse } from "next/server";

// Define routes that don't require authentication
const PUBLIC_ROUTES = ["/Login", "/auth-redirect", "/api", "/Public-Pay"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const isPublic = PUBLIC_ROUTES.some((path) => pathname.startsWith(path));

  if (!token && !isPublic) {
    const loginUrl = new URL("/Login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply middleware only to pages (not static files)
export const config = {
  matcher: ["/((?!_next|favicon.ico|logo|fonts|images).*)"],
};
