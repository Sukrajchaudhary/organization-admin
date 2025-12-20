/**
 * Security logging utility for production-ready monitoring
 * Addresses OWASP A09:2021 - Security Logging and Monitoring Failures
 */

export enum SecurityEventType {
  AUTH_SUCCESS = 'AUTH_SUCCESS',
  AUTH_FAILURE = 'AUTH_FAILURE',
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  SESSION_CREATED = 'SESSION_CREATED',
  SESSION_DESTROYED = 'SESSION_DESTROYED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
}

export interface SecurityLogEntry {
  timestamp: string
  eventType: SecurityEventType
  userId?: string
  email?: string
  ip?: string
  userAgent?: string
  details?: Record<string, unknown>
  severity: 'low' | 'medium' | 'high' | 'critical'
}

class SecurityLogger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  /**
   * Log security events without exposing sensitive information
   */
  log(entry: Omit<SecurityLogEntry, 'timestamp'>): void {
    const logEntry: SecurityLogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    }

    // Sanitize the log entry to prevent sensitive data exposure
    const sanitizedEntry = this.sanitizeLogEntry(logEntry)

    if (this.isDevelopment) {
      console.log('[SECURITY]', JSON.stringify(sanitizedEntry, null, 2))
    } else {
      // In production, send to logging service (e.g., Sentry, DataDog, CloudWatch)
      console.log(JSON.stringify(sanitizedEntry))

      // TODO: Integrate with your production logging service
      // Example: await sendToLoggingService(sanitizedEntry)
    }

    // Alert on critical events
    if (entry.severity === 'critical') {
      this.alertCriticalEvent(sanitizedEntry)
    }
  }

  /**
   * Remove sensitive data from logs
   */
  private sanitizeLogEntry(entry: SecurityLogEntry): SecurityLogEntry {
    const sanitized = { ...entry }

    // Never log passwords, tokens, or other sensitive data
    if (sanitized.details) {
      const { password, accessToken, refreshToken, secret, ...safeDetails } = sanitized.details as Record<string, unknown>
      sanitized.details = safeDetails
    }

    return sanitized
  }

  /**
   * Handle critical security events
   */
  private alertCriticalEvent(entry: SecurityLogEntry): void {
    // TODO: Implement alerting mechanism (email, SMS, PagerDuty, etc.)
    console.error('[CRITICAL SECURITY EVENT]', JSON.stringify(entry))
  }

  /**
   * Log authentication success
   */
  authSuccess(userId: string, email: string, ip?: string): void {
    this.log({
      eventType: SecurityEventType.AUTH_SUCCESS,
      userId,
      email,
      ip,
      severity: 'low',
    })
  }

  /**
   * Log authentication failure
   */
  authFailure(email: string, ip?: string, reason?: string): void {
    this.log({
      eventType: SecurityEventType.AUTH_FAILURE,
      email,
      ip,
      details: { reason },
      severity: 'medium',
    })
  }

  /**
   * Log rate limit exceeded
   */
  rateLimitExceeded(identifier: string, ip?: string): void {
    this.log({
      eventType: SecurityEventType.RATE_LIMIT_EXCEEDED,
      details: { identifier },
      ip,
      severity: 'high',
    })
  }

  /**
   * Log token expiration
   */
  tokenExpired(userId: string, email?: string): void {
    this.log({
      eventType: SecurityEventType.TOKEN_EXPIRED,
      userId,
      email,
      severity: 'low',
    })
  }

  /**
   * Log unauthorized access attempts
   */
  unauthorizedAccess(path: string, userId?: string, ip?: string): void {
    this.log({
      eventType: SecurityEventType.UNAUTHORIZED_ACCESS,
      userId,
      ip,
      details: { path },
      severity: 'high',
    })
  }
}

export const securityLogger = new SecurityLogger()