/**
 * Rate limiting implementation for authentication endpoints
 * Addresses OWASP A07:2021 - Identification and Authentication Failures
 * Prevents brute force attacks
 */

import { securityLogger } from './logger'

interface RateLimitEntry {
  count: number
  resetTime: number
  blockedUntil?: number
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private readonly maxAttempts: number
  private readonly windowMs: number
  private readonly blockDurationMs: number

  constructor(
    maxAttempts = 5,
    windowMs = 15 * 60 * 1000, // 15 minutes
    blockDurationMs = 60 * 60 * 1000 // 1 hour
  ) {
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
    this.blockDurationMs = blockDurationMs

    // Clean up expired entries every 10 minutes
    setInterval(() => this.cleanup(), 10 * 60 * 1000)
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier (email, IP, etc.)
   * @returns true if rate limit exceeded
   */
  isRateLimited(identifier: string, ip?: string): boolean {
    const now = Date.now()
    const entry = this.store.get(identifier)

    // Check if currently blocked
    if (entry?.blockedUntil && entry.blockedUntil > now) {
      securityLogger.rateLimitExceeded(identifier, ip)
      return true
    }

    // Initialize or reset entry if window expired
    if (!entry || entry.resetTime < now) {
      this.store.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      })
      return false
    }

    // Increment counter
    entry.count++

    // Check if limit exceeded
    if (entry.count > this.maxAttempts) {
      entry.blockedUntil = now + this.blockDurationMs
      securityLogger.rateLimitExceeded(identifier, ip)
      return true
    }

    return false
  }

  /**
   * Reset rate limit for an identifier (e.g., after successful auth)
   */
  reset(identifier: string): void {
    this.store.delete(identifier)
  }

  /**
   * Get remaining attempts
   */
  getRemainingAttempts(identifier: string): number {
    const entry = this.store.get(identifier)
    if (!entry) return this.maxAttempts

    const now = Date.now()
    if (entry.resetTime < now) return this.maxAttempts

    return Math.max(0, this.maxAttempts - entry.count)
  }

  /**
   * Get time until reset (in seconds)
   */
  getTimeUntilReset(identifier: string): number {
    const entry = this.store.get(identifier)
    if (!entry) return 0

    const now = Date.now()
    const resetTime = entry.blockedUntil || entry.resetTime

    return Math.max(0, Math.ceil((resetTime - now) / 1000))
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime < now && (!entry.blockedUntil || entry.blockedUntil < now)) {
        this.store.delete(key)
      }
    }
  }
}

// Separate rate limiters for different purposes
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000, 60 * 60 * 1000) // 5 attempts per 15 min, block for 1 hour
export const apiRateLimiter = new RateLimiter(100, 15 * 60 * 1000, 5 * 60 * 1000) // 100 requests per 15 min, block for 5 min
