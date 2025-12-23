import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { applySecurityHeaders } from "./lib/security/headers"
import { securityLogger } from "./lib/security/logger"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Apply security headers to all responses
    const response = NextResponse.next()
    applySecurityHeaders(response)

    // Token validation - check expiration
    if (token?.expiresAt) {
      const expiryTime = new Date(token.expiresAt as string).getTime()
      const currentTime = Date.now()

      if (currentTime >= expiryTime) {
        securityLogger.tokenExpired(token.sub || 'unknown', token.email || undefined)
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    // Role-based access control (RBAC)
    // Add your role-based rules here
    const userRole = token?.role as string

    // Get client IP from headers
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

    // Example: Admin-only routes
    if (path.startsWith('/dashboard/admin') && userRole !== 'admin') {
      securityLogger.unauthorizedAccess(
        path,
        token?.sub,
        clientIp
      )
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Example: Manager and Admin routes
    if (path.startsWith('/dashboard/reports')) {
      const allowedRoles = ['admin', 'manager']
      if (!allowedRoles.includes(userRole)) {
        securityLogger.unauthorizedAccess(
          path,
          token?.sub,
          clientIp
        )
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return response
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Basic token existence check
        if (!token) return false

        // Additional validation: check if token has required fields
        return !!(token.sub && token.role && token.accessToken)
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
  ],
}
