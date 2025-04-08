// import { NextResponse } from "next/server";

// export function middleware(request) {
//   const { pathname } = request.nextUrl;
//   const token =
//     request.cookies.get("authToken")?.value ||
//     request.headers.get("authorization");

//   if (pathname === "/login") return NextResponse.next();

//   if (!token) {
//     const url = request.nextUrl.clone();
//     url.pathname = "/login";
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// // Match everything except static files
// export const config = {
//   matcher: ["/((?!_next/static|favicon.ico).*)"],
// };
