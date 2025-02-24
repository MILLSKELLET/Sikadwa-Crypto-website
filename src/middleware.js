import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { role } = token;

  const adminRoutes = req.nextUrl.pathname.startsWith("/admin");
  const userRoutes = req.nextUrl.pathname.startsWith("/user");

  if (adminRoutes && role !== "admin") {
    return NextResponse.redirect(new URL("/user", req.url));
  }

  if (userRoutes && role !== "user") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"], // Apply middleware to these routes
};
