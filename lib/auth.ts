import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getServerSession } from "next-auth"
import { LoginUser } from "@/apiServices/auth/api.authServices"
import { ApiError } from "@/types/api"
import { validateCredentials, validateEnvironment } from "./security/validation"
import { loginRateLimiter } from "./security/rate-limiter"
import { securityLogger, SecurityEventType } from "./security/logger"

// Validate environment variables at startup
if (typeof window === 'undefined') {
  validateEnvironment()
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  accessToken?: string
  expiresAt?: string
}

/**
 * Check if token is expired
 */
function isTokenExpired(expiresAt?: string): boolean {
  if (!expiresAt) return true

  try {
    const expiryTime = new Date(expiresAt).getTime()
    const currentTime = Date.now()
    // Add 5 minute buffer to refresh before actual expiration
    return currentTime >= expiryTime - 5 * 60 * 1000
  } catch {
    return true
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Input validation - OWASP A03:2021 Injection Prevention
        if (!credentials?.email || !credentials?.password) {
          securityLogger.log({
            eventType: SecurityEventType.AUTH_INVALID_CREDENTIALS,
            details: { error: 'Missing credentials' },
            severity: 'low',
          })
          return null
        }

        const validation = validateCredentials(credentials)
        if (!validation.success) {
          securityLogger.log({
            eventType: SecurityEventType.AUTH_INVALID_CREDENTIALS,
            details: { error: validation.error },
            severity: 'low',
          })
          return null
        }

        const { email, password } = validation.data!

        // Rate limiting - OWASP A07:2021 Authentication Failures Prevention
        const clientIp = req?.headers?.['x-forwarded-for'] || req?.headers?.['x-real-ip'] || 'unknown'
        const ipAddress = Array.isArray(clientIp) ? clientIp[0] : clientIp

        if (loginRateLimiter.isRateLimited(email, ipAddress)) {
          const timeUntilReset = loginRateLimiter.getTimeUntilReset(email)
          securityLogger.log({
            eventType: SecurityEventType.RATE_LIMIT_EXCEEDED,
            email,
            ip: ipAddress,
            details: { timeUntilReset },
            severity: 'high',
          })
          return null
        }

        try {
          const response = await LoginUser({
            email,
            password
          });

          if (response.success && response.data) {
            // Reset rate limiter on successful auth
            loginRateLimiter.reset(email)

            const apiUser = response.data;
            const user = {
              id: apiUser._id,
              name: apiUser.fullName || apiUser.username,
              email: apiUser.email,
              role: apiUser.role,
              accessToken: response.token,
              expiresAt: response.expiresAt,
            }

            // Log successful authentication - OWASP A09:2021
            securityLogger.authSuccess(user.id, user.email, ipAddress)

            return user
          }
        } catch (error) {
          // Pass specific error message to the client
          if (error instanceof ApiError) {
            securityLogger.authFailure(
              email,
              ipAddress,
              `API Error: ${error.statusCode}`
            )
            // Throw error with specific message for 429 and other API errors
            throw new Error(error.message)
          } else {
            securityLogger.authFailure(
              email,
              ipAddress,
              'Unknown error'
            )
            throw new Error('An unexpected error occurred. Please try again.')
          }
        }

        // Log failed authentication attempt
        securityLogger.authFailure(email, ipAddress, 'Invalid credentials')
        throw new Error('Invalid email or password')
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours - refresh session daily
  },
  pages: {
    signIn: "/login",
    error: "/login", // Don't expose error details
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.role = (user as User).role
        token.accessToken = (user as User).accessToken
        token.expiresAt = (user as User).expiresAt
        token.userId = user.id
        token.email = user.email || undefined
      }

      // Token expiration check - OWASP A07:2021
      if (token.expiresAt && isTokenExpired(token.expiresAt as string)) {
        securityLogger.tokenExpired(
          (token.userId as string) || 'unknown',
          token.email || undefined
        )
        // Mark token as expired by clearing sensitive data
        token.accessToken = undefined
        token.isExpired = true
      }

      return token
    },
    async session({ session, token }) {
      // Check if token is expired or invalid
      if (!token || !token.sub || token.isExpired) {
        // Return empty session to force re-authentication
        throw new Error('Session expired')
      }

      // Populate session with token data
      session.user.id = token.sub
      session.user.role = token.role as string
      session.user.accessToken = token.accessToken as string
      session.user.expiresAt = token.expiresAt as string

      // Log session access for monitoring
      if (process.env.NODE_ENV === 'production') {
        securityLogger.log({
          eventType: SecurityEventType.SESSION_CREATED,
          userId: session.user.id,
          email: session.user.email || undefined,
          severity: 'low',
        })
      }

      return session
    }
  },
  events: {
    async signOut({ token }) {
      // Log sign out events
      if (token?.sub) {
        securityLogger.log({
          eventType: SecurityEventType.SESSION_DESTROYED,
          userId: token.sub,
          email: token.email || undefined,
          severity: 'low',
        })
      }
    },
  },
}

export async function auth() {
  return await getServerSession(authOptions)
}

// Client-side function to get auth token
export async function getAuthToken(): Promise<string | null> {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const session = await response.json();
      
      return session?.user?.accessToken || null;
    }
    return null;
  } catch (error) {
    return null;
  }
}
