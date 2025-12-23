/**
 * Input validation schemas and utilities
 * Addresses OWASP A03:2021 - Injection
 * Prevents XSS, SQL Injection, and other injection attacks
 */

import { z } from 'zod'

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Invalid email format')
  .max(255, 'Email too long')
  .refine(
    (email) => {
      // Additional email validation to prevent common injection patterns
      const dangerousPatterns = /<script|javascript:|onerror=|onclick=/i
      return !dangerousPatterns.test(email)
    },
    { message: 'Invalid email format' }
  )

/**
 * Password validation schema
 * Enforces strong password requirements
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .refine(
    (password) => {
      // Check for at least one uppercase letter
      return /[A-Z]/.test(password)
    },
    { message: 'Password must contain at least one uppercase letter' }
  )
  .refine(
    (password) => {
      // Check for at least one lowercase letter
      return /[a-z]/.test(password)
    },
    { message: 'Password must contain at least one lowercase letter' }
  )
  .refine(
    (password) => {
      // Check for at least one number
      return /[0-9]/.test(password)
    },
    { message: 'Password must contain at least one number' }
  )
  .refine(
    (password) => {
      // Check for at least one special character
      return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    },
    { message: 'Password must contain at least one special character' }
  )

/**
 * Login credentials validation schema
 */
export const loginCredentialsSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required').max(128),
})

/**
 * Environment variables validation schema
 */
export const envSchema = z.object({
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required').refine(
    (secret) => {
      // Remove quotes if present
      const cleanSecret = secret.replace(/^["']|["']$/g, '')
      return cleanSecret.length >= 32
    },
    { message: 'NEXTAUTH_SECRET must be at least 32 characters (excluding quotes)' }
  ),
  NEXTAUTH_URL: z.string().min(1, 'NEXTAUTH_URL is required'),
  NEXT_PUBLIC_BASE_SERVER_URL: z.string().min(1, 'API URL is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
})

/**
 * Sanitize string to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent tag injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

/**
 * Validate and sanitize user input
 */
export function validateCredentials(credentials: unknown): {
  success: boolean
  data?: { email: string; password: string }
  error?: string
} {
  try {
    const validated = loginCredentialsSchema.parse(credentials)
    return {
      success: true,
      data: validated,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || 'Invalid credentials',
      }
    }
    return {
      success: false,
      error: 'Invalid input',
    }
  }
}

/**
 * Validate environment variables at startup
 */
export function validateEnvironment(): void {
  const isDevelopment = process.env.NODE_ENV !== 'production'

  try {
    const result = envSchema.safeParse({
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXT_PUBLIC_BASE_SERVER_URL: process.env.NEXT_PUBLIC_BASE_SERVER_URL,
      NODE_ENV: process.env.NODE_ENV,
    })

    if (!result.success) {
      console.error('⚠️  Environment validation warnings:')
      result.error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`)
      })

      // In production, throw error. In development, just warn.
      if (!isDevelopment) {
        throw new Error('Invalid environment configuration')
      } else {
        console.warn('⚠️  Continuing in development mode with validation warnings')
      }
    } else {
      console.log('✅ Environment validation passed')
    }
  } catch (error) {
    if (!isDevelopment) {
      throw error
    } else {
      console.warn('⚠️  Environment validation error (continuing in development mode):', error)
    }
  }
}