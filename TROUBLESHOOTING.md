# 🔧 TROUBLESHOOTING GUIDE

**Common issues and solutions.**

---

## 🗄️ Database Issues

### Cannot connect to MongoDB

**Error:**
MongooseServerSelectionError: Could not connect to any servers

**Solutions:**

1. **Check connection string:**
```bash
# Correct format:
mongodb+srv://username:password@cluster.mongodb.net/database

# Common mistakes:
- Missing password
- Wrong database name
- Special characters not URL-encoded
```

2. **Whitelist IP:**
- MongoDB Atlas → Network Access
- Add IP: 0.0.0.0/0 (allow all)
- Wait 2-3 minutes for propagation

3. **Check network:**
```bash
ping cluster.mongodb.net
# Should resolve successfully
```

---

## 🔐 Authentication Issues

### NextAuth session errors

**Error:**
[next-auth][error][JWT_SESSION_ERROR]

**Solutions:**

1. **Regenerate secret:**
```bash
openssl rand -base64 32
# Copy output to NEXTAUTH_SECRET
```

2. **Check NEXTAUTH_URL:**
```bash
# Development:
NEXTAUTH_URL=http://localhost:3000

# Production:
NEXTAUTH_URL=https://yourdomain.com
# Must match exactly (no trailing slash)
```

3. **Clear cookies:**
- Open DevTools → Application → Cookies
- Delete all cookies
- Try login again

### Can't login as admin

**Solutions:**

1. **Reset admin password:**
```bash
npx tsx src/scripts/resetAdminPassword.ts
```

2. **Create new admin:**
```bash
npx tsx src/scripts/createAdminUser.ts
```

3. **Check User model:**
```bash
# In MongoDB Compass or Atlas:
# Collection: users
# Find: { email: "admin@example.com" }
# Verify role: "admin"
```

---

## 🖼️ Image Upload Issues

### Cloudinary upload fails

**Error:**
Upload failed: Unauthorized

**Solutions:**

1. **Check credentials:**
```bash
# .env.local must have:
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=correct-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=correct-preset

# Get from: https://cloudinary.com/console
```

2. **Check upload preset settings:**
- Cloudinary Console → Settings → Upload
- Find your preset
- Ensure: "Signing Mode: Unsigned"
- Folder: "your-folder" (optional)

3. **Test API:**
```bash
curl -X POST https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload \
  -F "file=@/path/to/image.jpg" \
  -F "upload_preset=YOUR_PRESET"

# Should return success response
```

### Image not displaying

**Solutions:**

1. **Check next.config.mjs:**
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
    },
  ],
}
```

2. **Restart dev server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## 🏗️ Build Errors

### Type errors during build

**Error:**
Type error: Property 'X' does not exist on type 'Y'

**Solutions:**

1. **Run type check:**
```bash
npm run type-check
# Shows all TypeScript errors
```

2. **Check imports:**
```typescript
// Wrong:
import { IBlogs } from '@/types';

// Correct:
import type { IBlog } from '@/types';
```

3. **Clear .next cache:**
```bash
rm -rf .next
npm run build
```

### Module not found

**Error:**
Module not found: Can't resolve '@/...'

**Solutions:**

1. **Check tsconfig.json paths:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

2. **Restart dev server:**
```bash
npm run dev
```

3. **Reinstall:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Blog/Editor Issues

### Tiptap editor not loading

**Error:**
Warning: useEditor called on the server

**Solution:**

Make component client-side:
```typescript
'use client';  // Add at top of file

import { useEditor } from '@tiptap/react';
```

### HTML import not parsing

**Solutions:**

1. **Check HTML structure:**
```html
<!-- Valid:-->
<article>
  <h2>Heading</h2>
  <p>Content</p>
</article>

<!-- Invalid: (missing closing tags) -->
<article>
  <h2>Heading
  <p>Content
```

2. **Simplify HTML:**
- Remove inline styles
- Remove empty tags
- Use standard HTML elements

### Blocks not saving

**Solutions:**

1. **Check browser console:**
- Look for API errors
- Check network tab

2. **Verify session:**
```typescript
// In server action:
const session = await getServerSession(authOptions);
if (!session) {
  // User not authenticated
}
```

---

## 🚀 Deployment Issues (Vercel)

### Build fails on Vercel

**Error:**
Build failed with exit code 1

**Solutions:**

1. **Check build logs:**
- Vercel dashboard → Deployments → Failed build
- Read full error message

2. **Test local build:**
```bash
npm run build
# Should complete without errors
```

3. **Common fixes:**
```bash
# Missing environment variables:
# Add in Vercel → Settings → Environment Variables

# TypeScript errors:
npm run type-check

# Linting errors:
npm run lint
```

### Environment variables not working

**Solutions:**

1. **Check variable names:**
```bash
# Vercel dashboard format:
Name: MONGODB_URI
Value: mongodb+srv://...

# Must match .env.local exactly
```

2. **Redeploy:**
- After adding variables
- Redeploy is required (not automatic)

3. **Check visibility:**
```bash
# Client-side variables must start with:
NEXT_PUBLIC_*

# Server-side variables:
Any name (but not accessible in browser)
```

---

## 📧 Email/Contact Form Issues

### Emails not sending

**Solutions:**

1. **Gmail setup:**
```bash
# Use App Password (not regular password):
# 1. Google Account → Security
# 2. 2-Step Verification (enable)
# 3. App Passwords → Generate
# 4. Use generated password in SMTP_PASSWORD
```

2. **Test SMTP:**
```bash
# Use a test tool:
telnet smtp.gmail.com 587
# Should connect successfully
```

3. **Check firewall:**
- Vercel may block port 587
- Use port 465 (SSL) instead

---

## 🔍 SEO Issues

### Sitemap not generating

**Solutions:**

1. **Check route:**
```bash
# File should exist:
/src/app/blog-sitemap.xml/route.ts

# Access at:
http://localhost:3000/blog-sitemap.xml
```

2. **Verify database:**
```bash
# Check published blogs exist:
db.blogs.find({ 'workflow.status': 'published' })
```

### Structured data errors

**Test:**
```bash
# Google Rich Results Test:
https://search.google.com/test/rich-results

# Enter your page URL
# Check for errors
```

**Common fixes:**
- Add required fields to schema
- Ensure valid JSON-LD
- Check image URLs are absolute

---

## 🎨 Styling Issues

### Tailwind classes not working

**Solutions:**

1. **Restart dev server:**
```bash
npm run dev
```

2. **Check tailwind.config.ts:**
```typescript
content: [
  './src/**/*.{js,ts,jsx,tsx,mdx}',
],
```

3. **Clear cache:**
```bash
rm -rf .next
npm run dev
```

---

## 🐛 General Debugging

### Enable debug mode

```bash
# .env.local:
DEBUG=*
NODE_ENV=development
```

### Check logs

**Development:**
```bash
# Terminal where `npm run dev` is running
# Shows all console.log and errors
```

**Production (Vercel):**
```bash
# Vercel dashboard:
# Project → Deployments → View Function Logs
```

### Reset everything

```bash
# Nuclear option (clears everything):
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

---

## 🆘 Still Stuck?

1. **Check README.md** - Review setup steps
2. **Check GitHub Issues** - Search existing issues
3. **Create new issue** with:
   - Error message (full text)
   - Steps to reproduce
   - Environment (OS, Node version, browser)
   - Screenshot (if applicable)

---

**Most issues are solved by:**
- Restarting dev server
- Clearing .next cache
- Checking environment variables
- Verifying database connection
