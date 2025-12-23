# Security Implementation Guide

This document outlines the security measures implemented in this application to meet OWASP Top 10 standards.

## OWASP Top 10 Compliance

### A01:2021 - Broken Access Control ✅

**Implemented Protections:**
- Role-Based Access Control (RBAC) in middleware (middleware.ts:26-51)
- Token expiration validation in JWT callbacks (lib/auth.ts:23-37, 152-157)
- Session validation in middleware (middleware.ts:15-24, 57-63)
- Automatic session refresh every 24 hours (lib/auth.ts:129)

**How it works:**
- Users are assigned roles (admin, manager, user, etc.)
- Middleware checks token validity and role permissions before allowing access
- Expired tokens force re-authentication

### A02:2021 - Cryptographic Failures ✅

**Implemented Protections:**
- Secure session tokens with httpOnly cookies (lib/security/headers.ts:58-64)
- Secure cookie settings (httpOnly, secure in production, sameSite)
- Environment variable validation at startup (lib/security/validation.ts:71-90)
- 32+ character minimum for NEXTAUTH_SECRET

**Best Practices:**
- Use HTTPS in production (enforced via HSTS headers)
- Store secrets in environment variables, not in code
- Rotate NEXTAUTH_SECRET regularly

### A03:2021 - Injection ✅

**Implemented Protections:**
- Input validation using Zod schemas (lib/security/validation.ts)
- Email sanitization and validation (lib/security/validation.ts:13-25)
- XSS prevention via string sanitization (lib/security/validation.ts:56-62)
- Content Security Policy headers (lib/security/headers.ts:15-28)

**Validation Applied:**
- Email format validation with dangerous pattern detection
- Password strength requirements (8+ chars, uppercase, lowercase, number, special char)
- All user inputs are validated before processing

### A04:2021 - Insecure Design ✅

**Implemented Protections:**
- Rate limiting on login attempts (lib/security/rate-limiter.ts)
  - 5 attempts per 15 minutes
  - 1 hour block after exceeding limit
- Security logging for monitoring (lib/security/logger.ts)
- Defense-in-depth with multiple security layers

**Configuration:**
- Login rate limiter: 5 attempts / 15 min window
- API rate limiter: 100 requests / 15 min window
- Automatic cleanup of expired rate limit entries

### A05:2021 - Security Misconfiguration ✅

**Implemented Protections:**
- TypeScript strict mode enabled (ignoreBuildErrors: false)
- Security headers configured (next.config.mjs:19-51, lib/security/headers.ts)
- Secure cookie configuration (lib/security/headers.ts:58-64)
- Environment validation at startup (lib/auth.ts:12)

**Security Headers Applied:**
- Content-Security-Policy (CSP)
- Strict-Transport-Security (HSTS)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy

### A06:2021 - Vulnerable and Outdated Components ✅

**Current Status:**
- Next.js 16.0.3 (latest stable)
- next-auth 4.24.13 (stable, v5 has breaking changes)
- React 19.2.0 (latest)
- Zod 3.25.76 (latest validation library)

**Maintenance:**
- Regular dependency updates required
- Security advisories monitoring recommended
- Use `npm audit` or `pnpm audit` regularly

### A07:2021 - Identification and Authentication Failures ✅

**Implemented Protections:**
- Strong password requirements (lib/security/validation.ts:27-54)
  - Minimum 8 characters
  - Uppercase, lowercase, number, and special character required
- Rate limiting to prevent brute force attacks (lib/security/rate-limiter.ts)
- Secure session management with 30-day max age
- Token expiration validation
- Failed login attempt logging

**Password Requirements:**
```
- Minimum length: 8 characters
- Maximum length: 128 characters
- Must contain: uppercase, lowercase, number, special character
```

### A08:2021 - Software and Data Integrity Failures ✅

**Implemented Protections:**
- JWT signature validation via NextAuth
- Session data validation before use
- Secure cookie settings prevent tampering
- Environment variable validation

### A09:2021 - Security Logging and Monitoring Failures ✅

**Implemented Protections:**
- Comprehensive security event logging (lib/security/logger.ts)
- Sanitized logs (no sensitive data exposure)
- Critical event alerting system
- Tracked events include:
  - Authentication success/failure
  - Token expiration
  - Rate limit exceeded
  - Unauthorized access attempts
  - Session creation/destruction

**Log Events Tracked:**
```typescript
AUTH_SUCCESS
AUTH_FAILURE
AUTH_INVALID_CREDENTIALS
TOKEN_EXPIRED
TOKEN_INVALID
RATE_LIMIT_EXCEEDED
UNAUTHORIZED_ACCESS
SESSION_CREATED
SESSION_DESTROYED
SUSPICIOUS_ACTIVITY
```

### A10:2021 - Server-Side Request Forgery (SSRF) ✅

**Implemented Protections:**
- API URL validation in environment schema
- Content-Security-Policy restricts external connections
- Validated and whitelisted API endpoints

## Configuration

### Environment Variables

Required environment variables (see `.env.example`):

```env
NEXTAUTH_SECRET=<32+ character random string>
NEXTAUTH_URL=<your-app-url>
NEXT_PUBLIC_BASE_SERVER_URL=<your-api-url>
NODE_ENV=development|production
```

**Generate secure secret:**
```bash
openssl rand -base64 32
```

### Role-Based Access Control

Configure role-based access in `middleware.ts`:

```typescript
// Admin-only routes
if (path.startsWith('/dashboard/admin') && userRole !== 'admin') {
  // Redirect to dashboard
}

// Multiple roles
const allowedRoles = ['admin', 'manager']
if (!allowedRoles.includes(userRole)) {
  // Redirect
}
```

### Rate Limiting Configuration

Adjust rate limits in `lib/security/rate-limiter.ts`:

```typescript
// Login rate limiter
new RateLimiter(
  5,              // maxAttempts
  15 * 60 * 1000, // windowMs (15 minutes)
  60 * 60 * 1000  // blockDurationMs (1 hour)
)
```

## Production Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Generate and set secure `NEXTAUTH_SECRET` (32+ characters)
- [ ] Set production `NEXTAUTH_URL` to your domain
- [ ] Enable HTTPS/SSL on your server
- [ ] Configure production logging service (Sentry, DataDog, etc.)
- [ ] Set up monitoring and alerting
- [ ] Review and adjust rate limits for your use case
- [ ] Configure CSP directives for your specific domains
- [ ] Set up automated security updates
- [ ] Regular security audits and penetration testing
- [ ] Implement database backups and disaster recovery
- [ ] Configure WAF (Web Application Firewall) if available

## Security Monitoring

### Logging Integration

Update `lib/security/logger.ts` to integrate with your logging service:

```typescript
// Example: Sentry integration
if (!this.isDevelopment) {
  Sentry.captureMessage(JSON.stringify(sanitizedEntry), {
    level: entry.severity as SeverityLevel,
  })
}
```

### Alerting

Configure alerts for critical events in `lib/security/logger.ts`:

```typescript
private alertCriticalEvent(entry: SecurityLogEntry): void {
  // Send to PagerDuty, Slack, email, etc.
}
```

## Security Testing

### Testing Authentication

1. **Rate Limiting Test:**
   - Attempt 6 failed logins within 15 minutes
   - Verify account is locked for 1 hour
   - Check security logs for RATE_LIMIT_EXCEEDED events

2. **Token Expiration Test:**
   - Login and get valid session
   - Wait for token expiration
   - Verify automatic redirect to login

3. **RBAC Test:**
   - Login with different roles
   - Attempt to access restricted routes
   - Verify proper redirects and logging

4. **Input Validation Test:**
   - Submit malicious inputs (XSS, SQL injection attempts)
   - Verify inputs are sanitized/rejected

### Security Headers Verification

Check headers using browser DevTools or curl:

```bash
curl -I https://your-domain.com
```

Verify presence of:
- Content-Security-Policy
- Strict-Transport-Security (production only)
- X-Frame-Options
- X-Content-Type-Options

## Incident Response

If a security incident occurs:

1. **Check Security Logs:**
   - Review logs in `lib/security/logger.ts` output
   - Identify affected users and scope

2. **Immediate Actions:**
   - Rotate `NEXTAUTH_SECRET`
   - Force logout all users
   - Investigate attack vector

3. **Post-Incident:**
   - Patch vulnerability
   - Notify affected users
   - Update security measures
   - Document incident

## Additional Security Recommendations

1. **Two-Factor Authentication (2FA):**
   - Consider implementing TOTP-based 2FA
   - Use libraries like `otplib` or `speakeasy`

2. **Password Reset:**
   - Implement secure password reset flow
   - Use time-limited tokens
   - Log all password changes

3. **Account Lockout:**
   - Consider permanent lockout after X failed attempts
   - Implement CAPTCHA after Y attempts

4. **Session Management:**
   - Implement "logout all devices" functionality
   - Show active sessions to users
   - Allow session revocation

5. **API Security:**
   - Implement API key rotation
   - Add request signing
   - Consider OAuth 2.0 for API access

## Maintenance

### Regular Tasks

**Weekly:**
- Review security logs for anomalies
- Check for failed login patterns

**Monthly:**
- Update dependencies (`npm update`)
- Review and rotate API keys
- Security audit of new features

**Quarterly:**
- Rotate NEXTAUTH_SECRET
- Penetration testing
- Security training for team

**Annually:**
- Full security audit
- Review and update security policies
- Disaster recovery testing

## Support

For security issues or questions:
1. Review this documentation
2. Check security logs
3. Consult OWASP resources: https://owasp.org/
4. Report security vulnerabilities privately

---

**Last Updated:** 2025-12-13
**Security Standard:** OWASP Top 10 2021