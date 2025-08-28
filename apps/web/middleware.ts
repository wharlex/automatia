import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_PREFIX = "/app/admin";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Only apply to admin routes
  if (!pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.next();
  }

  try {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    const role = token?.role as string | undefined;
    
    // Check if user has admin role
    if (!role || !["OWNER", "ADMIN"].includes(role)) {
      // Redirect non-admin users to main app
      return NextResponse.redirect(new URL("/app", req.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // On error, redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = { 
  matcher: ["/app/admin/:path*"] 
};
