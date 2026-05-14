# Security Checklist

## Authentication & Authorization
- [x] NextAuth JWT strategy configured
- [x] Passwords hashed with bcrypt (10 rounds)
- [x] Session validation in middleware
- [x] Role-based access control (admin, editor, user)
- [x] Server Actions check session before mutations
- [x] API routes verify authentication

## Input Validation
- [x] Zod schemas for all user inputs
- [x] File upload validation (size, type, name)
- [x] SQL/NoSQL injection prevention (Mongoose handles)
- [x] XSS prevention (React escapes, DOMPurify for HTML)
- [x] CSRF protection (Next.js SameSite cookies)

## Rate Limiting
- [x] Upload endpoint: 10 req/10s
- [x] Public API endpoints protected
- [x] Uses Upstash Redis (Vercel-compatible)

## Data Protection
- [x] Environment variables validated at build
- [x] Secrets not committed (.env.local in .gitignore)
- [x] MongoDB connection string not exposed to client
- [x] Cloudinary API keys server-side only

## Content Security
- [x] File uploads restricted to images only
- [x] Max file size enforced (5MB)
- [x] File names sanitized
- [x] No dangerous HTML in user content

## Audit Trail
- [x] createdBy/updatedBy tracking
- [x] Timestamps on all documents
- [x] Error logging (console, future: Sentry)

## Future Enhancements
- [ ] Add Content Security Policy headers
- [ ] Implement 2FA for admin accounts
- [ ] Add webhook signature verification (if using)
- [ ] Penetration testing before production
