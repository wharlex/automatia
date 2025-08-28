import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/modules",
    "/integrations",
    "/statistics",
    "/billing",
    "/support",
    "/settings",
    "/marketplace",
  ]

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    // In a real app, you would check for authentication token here
    // For demo purposes, we'll allow access
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/modules/:path*",
    "/integrations/:path*",
    "/statistics/:path*",
    "/billing/:path*",
    "/support/:path*",
    "/settings/:path*",
    "/marketplace/:path*",
  ],
}
