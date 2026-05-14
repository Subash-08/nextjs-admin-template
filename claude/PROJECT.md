# Portfolio Template - Project Overview

## Purpose
Reusable Next.js 16 template for portfolio/project showcase, blog websites.

## Tech Stack
- Framework: Next.js 16 (App Router)
- Language: TypeScript (strict mode)
- Database: MongoDB + Mongoose
- Auth: NextAuth.js (JWT)
- Storage: Cloudinary
- Styling: TailwindCSS
- Validation: Zod
- Deployment: Vercel

## Key Features
- Project showcase with comprehensive case studies
- Category-based filtering
- Admin CRUD with drag-and-drop layout builder
- SEO-optimized with metadata, sitemap, structured data
- Image optimization with Cloudinary
- ISR for performance

## Structure
- Public routes: /, /works, /works/[slug], /about, /contact
- Admin routes: /admin/projects, /admin/categories, /admin/layout
- API routes: /api/upload, /api/auth/[...nextauth]

## Models
- User (auth + roles)
- Project (showcase + case study)
- Category (hierarchical)
- PortfolioLayoutBox (homepage grid customization)

## Not Included (Add Per Project)
- Blog system (implement separately with block editor)
- Analytics (Google Analytics, Plausible)
- Contact form (add per client requirements)
- Advanced search/filtering

## Getting Started
1. Clone this template
2. Copy .env.example to .env.local
3. Update environment variables
4. npm install
5. npm run dev
6. Create first admin user via /api/auth/signup
7. Customize branding, colors, content


