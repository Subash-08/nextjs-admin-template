# 🚀 Next.js Portfolio Template

**Professional portfolio template with integrated Blog, Projects, and Case Studies.**

Built with Next.js 16, TypeScript, MongoDB, NextAuth, Cloudinary, and Tiptap.

---

## ✨ Features

### 🎨 Core Features
- ✅ **Modern Design** - Responsive, accessible, production-ready
- ✅ **Dark/Light Mode** - Theme switching support
- ✅ **Authentication** - NextAuth with role-based access (admin/editor/user)
- ✅ **File Uploads** - Cloudinary integration for images
- ✅ **Email System** - Contact forms with SMTP

### 📝 Blog System
- ✅ **Manual Blog Creation** - 3-step wizard with Tiptap editor
- ✅ **AI-Generated Blogs** - n8n webhook integration
- ✅ **Block-Based Editor** - 8+ content block types (H2, H3, Paragraph, List, Image, Code, Quote, FAQ, CTA)
- ✅ **HTML Import** - Paste any HTML, preview blocks, import
- ✅ **Drag & Drop** - Reorder blocks with @dnd-kit
- ✅ **SEO Optimized** - Meta tags, structured data, sitemap, RSS
- ✅ **Category System** - Organize blogs by category
- ✅ **AI Review Queue** - Review AI-generated content before publishing
- ✅ **Trash Management** - Soft delete with restore capability
- ✅ **Internal Linking** - Track and validate internal links

### 🎯 Projects & Case Studies
- ✅ **Portfolio Grid** - Showcase your work
- ✅ **Case Study Pages** - Detailed project breakdowns
- ✅ **Category Filtering** - Filter by type/technology
- ✅ **Gallery Support** - Multiple images per project
- ✅ **Client Testimonials** - Social proof
- ✅ **Results Metrics** - Before/after stats

### 🔍 SEO & Performance
- ✅ **ISR (Incremental Static Regeneration)** - Fast, always fresh
- ✅ **Dynamic Sitemap** - Auto-generated for blogs & projects
- ✅ **RSS Feed** - Blog feed for subscribers
- ✅ **Structured Data** - Article, Breadcrumb, FAQ schemas
- ✅ **Open Graph** - Social media previews
- ✅ **Meta Tags** - Dynamic per page
- ✅ **Image Optimization** - Next.js Image component + Cloudinary

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Database** | MongoDB + Mongoose |
| **Auth** | NextAuth.js |
| **Styling** | Tailwind CSS |
| **UI Components** | Radix UI + Headless UI |
| **Forms** | React Hook Form + Zod |
| **Editor** | Tiptap (rich text) |
| **Images** | Cloudinary |
| **Deployment** | Vercel |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone 
cd nextjs-portfolio-template
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

**Required variables:**
```bash
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset
N8N_WEBHOOK_SECRET=<32-char-secret>
```

Generate secrets:
```bash
openssl rand -base64 32  # For NEXTAUTH_SECRET
openssl rand -base64 32  # For N8N_WEBHOOK_SECRET
```

### 3. Database Setup

**Start MongoDB:**
```bash
# If using MongoDB Atlas (recommended):
# 1. Create account at https://www.mongodb.com/cloud/atlas
# 2. Create cluster
# 3. Get connection string
# 4. Add to MONGODB_URI in .env.local

# If using local MongoDB:
brew services start mongodb-community  # macOS
sudo systemctl start mongod  # Linux
```

**Seed initial data:**
```bash
npm run db:seed-categories  # Creates blog categories
```

### 4. Create Admin User

**Run this script once:**
```bash
npx tsx src/scripts/createAdminUser.ts
```

Default admin credentials:
- Email: `admin@example.com`
- Password: `admin123`

**⚠️ IMPORTANT: Change password immediately after first login!**

### 5. Start Development

```bash
npm run dev
```

Open http://localhost:3000

---

## 📂 Project Structure
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (dashboard)/       # Admin pages (protected)
│   │   │   └── admin/
│   │   │       ├── blogs/     # Blog management
│   │   │       ├── projects/  # Project management
│   │   │       └── settings/  # Site settings
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth
│   │   │   ├── webhooks/      # n8n integration
│   │   │   └── upload/        # File uploads
│   │   ├── blog/              # Public blog pages
│   │   ├── works/             # Public project pages
│   │   └── layout.tsx         # Root layout
│   │
│   ├── components/            # React components
│   │   ├── admin/            # Admin-only components
│   │   ├── blog/             # Blog components
│   │   ├── projects/         # Project components
│   │   ├── seo/              # SEO components
│   │   ├── shared/           # Reusable components
│   │   └── layout/           # Layout components
│   │
│   ├── models/               # Mongoose schemas
│   │   ├── Blog.ts
│   │   ├── BlogCategory.ts
│   │   ├── Project.ts
│   │   ├── User.ts
│   │   └── ...
│   │
│   ├── services/             # Business logic
│   │   ├── blogService.ts
│   │   ├── projectService.ts
│   │   └── ...
│   │
│   ├── actions/              # Server Actions
│   │   ├── blog.actions.ts
│   │   ├── project.actions.ts
│   │   └── ...
│   │
│   ├── lib/                  # Utilities
│   │   ├── auth.ts          # NextAuth config
│   │   ├── db.ts            # MongoDB connection
│   │   ├── blog/            # Blog utilities
│   │   └── seo.ts           # SEO helpers
│   │
│   ├── types/                # TypeScript types
│   ├── validations/          # Zod schemas
│   ├── config/               # Configuration
│   │   ├── site.ts          # ⭐ UPDATE THIS FIRST
│   │   └── env.ts           # Environment validation
│   │
│   └── scripts/              # Database seeds
│
├── public/                   # Static assets
├── .env.example             # Environment template
├── .env.local               # Your environment (git-ignored)
├── next.config.mjs          # Next.js config
├── tailwind.config.ts       # Tailwind config
└── package.json

---

## 🎨 Customization Guide

### 1. Site Configuration (REQUIRED)

**File:** `/src/config/site.ts`

Update all values:
```typescript
export const siteConfig = {
  name: 'Your Company Name',  // ← Change
  tagline: 'Your Tagline',    // ← Change
  email: 'hello@example.com', // ← Change
  // ... update all fields
};
```

### 2. Branding

**Logo:**
- Place logo in `/public/logo.png` (recommended: 200x50px)
- Update in `/src/components/layout/Header.tsx`

**Favicon:**
- Generate: https://realfavicongenerator.net/
- Place in `/public/`

**OG Image:**
- Create 1200x630px image
- Place in `/public/og-image.jpg`

### 3. Color Scheme

**File:** `tailwind.config.ts`

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        // ... your brand colors
      },
    },
  },
}
```

### 4. Database Models

No changes needed unless you want to add custom fields.

If adding fields:
1. Update model in `/src/models/*.ts`
2. Update TypeScript types in `/src/types/*.ts`
3. Update admin forms
4. Update public display components

---

## 🔐 Security Checklist

Before deploying:

- [ ] Change default admin password
- [ ] Set strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] Set strong `N8N_WEBHOOK_SECRET` (32+ characters)
- [ ] Use HTTPS in production (`NEXTAUTH_URL`)
- [ ] Enable CORS restrictions on API routes
- [ ] Review file upload size limits
- [ ] Add rate limiting to contact forms
- [ ] Enable MongoDB IP whitelist (if using Atlas)
- [ ] Review NextAuth session strategy
- [ ] Enable CSP (Content Security Policy) headers

---

## 📝 Blog Management

### Creating Your First Blog Post

1. **Login as admin:** http://localhost:3000/admin
2. **Navigate to:** Admin → Blogs → New Post
3. **Fill in 3 steps:**
   - Step 1: Title, slug, category, SEO
   - Step 2: Content editor (add blocks)
   - Step 3: Review & publish

### Content Block Types

| Block | Usage |
|-------|-------|
| **H2/H3** | Headings (auto-generates anchor links) |
| **Paragraph** | Rich text with Tiptap editor |
| **List** | Ordered or unordered lists |
| **Image** | Upload via Cloudinary |
| **Code** | Code snippets with syntax highlighting |
| **Quote** | Blockquotes |
| **FAQ** | Question/Answer pairs (schema markup) |
| **CTA** | Call-to-action buttons |

### AI Blog Integration

**Setup n8n workflow:**
1. Create n8n account: https://n8n.io
2. Build workflow to generate blog content
3. Add webhook node pointing to: `your-domain.com/api/webhooks/n8n-blog`
4. Send this payload:

```json
{
  "title": "Your Blog Title",
  "contentHtml": "<h2>Heading</h2><p>Content...</p>",
  "excerpt": "Brief summary",
  "seo": {
    "metaTitle": "SEO Title",
    "metaDescription": "SEO Description",
    "focusKeyword": "main keyword"
  },
  "category": { "slug": "web-development" },
  "tags": ["tag1", "tag2"],
  "aiMetadata": {
    "generatedBy": "n8n",
    "modelUsed": "claude-sonnet-4",
    "qualityScore": 95
  },
  "webhookSecret": "your-secret-here"
}
```

Blogs appear in **Admin → AI Review Queue** for approval.

---

## 🎯 Projects Management

### Adding a Project

1. Go to: **Admin → Projects → New Project**
2. Fill in:
   - Title, description, client
   - Cover image + gallery
   - Technologies used
   - Links (live site, GitHub)
   - Case study content

### Project Fields

- **Title** - Project name
- **Slug** - URL-friendly identifier
- **Short Description** - Appears in grid
- **Full Description** - Detailed overview
- **Cover Image** - Main thumbnail (16:9 ratio)
- **Gallery** - Additional screenshots
- **Technologies** - Array of tech used
- **Services** - What you provided
- **Client** - Client name (optional)
- **Testimonial** - Client quote
- **Live URL** - Deployed site
- **GitHub URL** - Source code
- **Status** - Draft or Published

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

**Vercel Environment Variables:**
- Go to: Project Settings → Environment Variables
- Add all from `.env.local`
- Redeploy

### Environment Variables on Vercel

Add these in Vercel dashboard:
MONGODB_URI
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
N8N_WEBHOOK_SECRET
CRON_SECRET

### Custom Domain

1. Add domain in Vercel dashboard
2. Update DNS records (provided by Vercel)
3. Update `NEXTAUTH_URL` to your domain
4. Redeploy

---

## 🔧 Troubleshooting

### MongoDB Connection Issues

```bash
Error: MongooseServerSelectionError
```

**Fix:**
- Check `MONGODB_URI` format
- Whitelist IP in MongoDB Atlas
- Check network firewall

### NextAuth Errors

```bash
Error: [next-auth][error][JWT_SESSION_ERROR]
```

**Fix:**
- Regenerate `NEXTAUTH_SECRET`
- Ensure `NEXTAUTH_URL` matches deployment URL
- Clear browser cookies

### Image Upload Fails

```bash
Error: Upload failed
```

**Fix:**
- Verify Cloudinary credentials
- Check upload preset is unsigned
- Check file size < 10MB

### Build Errors

```bash
Type error: Property 'X' does not exist
```

**Fix:**
```bash
npm run type-check  # Check TypeScript errors
npm run lint        # Check linting errors
rm -rf .next        # Clear cache
npm run build       # Rebuild
```

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Tiptap Documentation](https://tiptap.dev/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 🤝 Contributing

This is a template project. Fork and customize for your needs!

---

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

## 💼 Support

For issues or questions:
1. Check troubleshooting section above
2. Review documentation
3. Check existing GitHub issues
4. Create new issue with:
   - Error message
   - Steps to reproduce
   - Environment (OS, Node version, etc.)

---

## 🎉 What's Next?

After setup:

1. **Customize branding** (`/src/config/site.ts`)
2. **Create first blog post** (Admin → Blogs → New)
3. **Add projects** (Admin → Projects → New)
4. **Build homepage** content
5. **Add services page** content
6. **Configure analytics** (GA4, Hotjar)
7. **Set up newsletter** (Convertkit)
8. **Deploy to Vercel**
9. **Submit to Google Search Console**
10. **Start content marketing!**

---

**Built with ❤️ for developers who value quality and speed.**
