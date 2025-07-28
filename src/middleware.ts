import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// // Define routes that don't require authentication
// const PUBLIC_ROUTES = ["/Login", "/auth-redirect", "/api", "/Public-Pay"];

// export function middleware(request: NextRequest) {
//   const allCookies = request.cookies.getAll();
//   console.log("🍪 ALL COOKIES:", allCookies); // Check if ANY cookies appear

//   // Middleware: Check header instead
//   //const token = request.headers.get("Authorization")?.split(" ")[1];
//   const token = request.cookies.get("token")?.value;
//   //const token = cookies().get("token")?.value;
//   console.log("🔍 TOKEN:", token); // Debug token specifically

//   // const token = request.cookies.get("token")?.value;
//   const pathname = request.nextUrl.pathname;
//   //console.log("🍪 Token in middleware:", token); // debug
//   const isPublic = PUBLIC_ROUTES.some((path) => pathname.startsWith(path));

//   if (!token && !isPublic) {
//     const loginUrl = new URL("/Login", request.url);
//     console.log("🍪 Token in middleware:", token); // debug
//     console.log("📍 Pathname:", pathname); // Debug pathname
//     return NextResponse.redirect(loginUrl);
//   }

//   return NextResponse.next();
// }

// // Apply middleware only to pages (not static files)
// export const config = {
//   matcher: ["/((?!_next|favicon.ico|logo|fonts|images).*)"],
// };
export default function middleware(request: NextRequest) {
  return NextResponse.next();
}
