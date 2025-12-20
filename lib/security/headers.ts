/**
 * Security headers configuration
 * Addresses OWASP A05:2021 - Security Misconfiguration
 * Implements defense-in-depth security headers
 */

import { NextResponse } from 'next/server'

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  const isDevelopment = process.env.NODE_ENV === 'development'

  // Content Security Policy (CSP)
  // Prevents XSS attacks by controlling resource loading
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://organization-71j0.onrender.com https://vercel.live",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ]
  response.headers.set('Content-Security-Policy', cspDirectives.join('; '))

  // Strict-Transport-Security (HSTS)
  // Forces HTTPS connections
  if (!isDevelopment) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  // X-Frame-Options
  // Prevents clickjacking attacks
  response.headers.set('X-Frame-Options', 'DENY')

  // X-Content-Type-Options
  // Prevents MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // X-XSS-Protection
  // Enables browser XSS filtering (legacy support)
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Referrer-Policy
  // Controls referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions-Policy
  // Controls browser features
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )

  // X-DNS-Prefetch-Control
  // Controls DNS prefetching
  response.headers.set('X-DNS-Prefetch-Control', 'on')

  // Remove server information
  response.headers.delete('X-Powered-By')

  return response
}

/**
 * Get secure cookie options
 */
export function getSecureCookieOptions() {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return {
    httpOnly: true, // Prevents JavaScript access to cookies
    secure: !isDevelopment, // Requires HTTPS in production
    sameSite: 'lax' as const, // CSRF protection
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  }
}