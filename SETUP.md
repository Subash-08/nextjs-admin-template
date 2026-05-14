# 🚀 FIRST-TIME SETUP GUIDE

**Follow these steps EXACTLY for each new project.**

---

## ✅ STEP 1: Clone & Install (5 minutes)

```bash
# Clone template
git clone  my-new-project
cd my-new-project

# Remove git history (start fresh)
rm -rf .git
git init
git add .
git commit -m "Initial commit from template"

# Install dependencies
npm install
```

---

## ✅ STEP 2: Environment Setup (10 minutes)

```bash
# Copy environment template
cp .env.example .env.local
```

**Edit `.env.local` and fill in:**

### Required (Must fill before running):
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
NEXT_PUBLIC_APP_NAME="Your Company Name"
```

### Cloudinary (Required for image uploads):
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset

# Get from: https://cloudinary.com/console
# 1. Sign up/login
# 2. Go to Settings → Upload
# 3. Create unsigned upload preset
# 4. Copy cloud name and preset name
```

### Optional (Add later):
```bash
N8N_WEBHOOK_SECRET=
SMTP_HOST=smtp.gmail.com  # If using contact forms
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXX  # If using analytics
```

---

## ✅ STEP 3: Site Configuration (15 minutes)

**File:** `/src/config/site.ts`

Update ALL fields marked with `← Change`:

```typescript
export const siteConfig = {
  name: 'Your Company Name',  // ← Change
  tagline: 'Your Tagline',    // ← Change
  description: '...',          // ← Change
  email: 'hello@example.com', // ← Change
  phone: '+1...',              // ← Change
  social: {
    twitter: '@yourhandle',    // ← Change
    linkedin: 'https://...',   // ← Change
    github: 'https://...',     // ← Change
  },
  // ... update everything
};
```

---

## ✅ STEP 4: Branding Assets (10 minutes)

### Logo
- Create logo (SVG or PNG)
- Place in `/public/logo.png`
- Recommended size: 200x50px
- Update usage in `/src/components/layout/Header.tsx`

### Favicon
- Generate: https://realfavicongenerator.net/
- Download package
- Extract to `/public/`
- Should include: `favicon.ico`, `apple-touch-icon.png`, etc.

### OG Image (Social sharing preview)
- Create 1200x630px image
- Include logo + tagline
- Save as `/public/og-image.jpg`

---

## ✅ STEP 5: Database Setup (5 minutes)

```bash
# Seed blog categories
npm run db:seed-categories

# Create admin user
npx tsx src/scripts/createAdminUser.ts

# Default credentials:
# Email: admin@example.com
# Password: admin123
# ⚠️ Change after first login!
```

---

## ✅ STEP 6: First Run (2 minutes)

```bash
npm run dev
```

**Open:** http://localhost:3000

**Test:**
1. Homepage loads ✓
2. Admin login works ✓
3. Can create blog post ✓

---

## ✅ STEP 7: Customization Checklist

### Update These Files:

- [ ] `/src/config/site.ts` - All site info
- [ ] `/public/logo.png` - Your logo
- [ ] `/public/og-image.jpg` - Social preview
- [ ] `/public/favicon.ico` - Browser icon
- [ ] `tailwind.config.ts` - Brand colors (optional)
- [ ] `/src/components/layout/Footer.tsx` - Footer links
- [ ] Change admin password (after first login)

### Delete These (Sample Data):

- [ ] `/src/scripts/seed-blogs.ts` - Sample blog posts
- [ ] Any test images in `/public/`

---

## ✅ STEP 8: Content Creation

### Create Your First Blog
1. Login: http://localhost:3000/admin
2. Blogs → New Post
3. Fill 3-step wizard
4. Publish!

### Add Your First Project
1. Admin → Projects → New Project
2. Upload cover image
3. Add description, tech stack
4. Publish!

---

## ✅ STEP 9: Deploy to Vercel (15 minutes)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

**Add environment variables in Vercel:**
1. Project Settings → Environment Variables
2. Copy all from `.env.local`
3. Redeploy

---

## ✅ STEP 10: Post-Deployment

### Immediate:
- [ ] Test deployed site
- [ ] Change admin password (if not done)
- [ ] Submit sitemap to Google Search Console
- [ ] Test contact form (if applicable)
- [ ] Verify image uploads work

### Within 1 Week:
- [ ] Write 3-5 blog posts
- [ ] Add 2-3 projects
- [ ] Complete About page
- [ ] Complete Services pages
- [ ] Set up Google Analytics
- [ ] Set up newsletter (if desired)

---

## 🎉 You're Done!

**Next:** Start building content and following the 90-Day Traffic Generation Playbook.

**Questions?** Check README.md or TROUBLESHOOTING.md
