# Common Development Workflows

## Adding a New Project (Admin)
1. Login to /admin
2. Navigate to Projects
3. Click "Create New Project"
4. Fill required fields:
   - Title, Slug, Short Summary, Description
   - Client Name, Company
   - Category
   - Thumbnail, Cover Image
5. Add case study details (optional):
   - Overview, Problem Statement, Objectives
   - Challenges, Solutions, Process Steps
   - Metrics, Testimonial
6. Set SEO metadata
7. Set status (draft/published)
8. Save

## Deploying to Production (Vercel)
1. Push to main branch
2. Vercel auto-deploys
3. Verify build logs
4. Test critical paths:
   - Homepage loads
   - Project detail pages render
   - Admin login works
   - Image uploads work
5. Submit sitemap to Google Search Console

## Creating a New Client Project from Template
1. Clone this repo: `git clone [template-repo]`
2. Create new repo for client
3. Update branding:
   - `/src/config/site.ts` (name, description, links)
   - Tailwind colors in `tailwind.config.ts`
   - Logos in `/public`
4. Update environment variables:
   - MongoDB (new database)
   - Cloudinary (new cloud or folder)
   - NextAuth secret
   - App URL
5. Deploy to Vercel
6. Create admin user
7. Populate with client's projects

## Adding a New Model
1. Create `/src/models/NewModel.ts`
   - Define interface extending Document
   - Create Mongoose schema
   - Add indexes
   - Prevent hot reload overwrite
2. Create `/src/services/newModelService.ts`
   - CRUD operations
   - Business logic
3. Create `/src/validations/newModel.schema.ts`
   - Zod schemas for create/update
4. Create API routes (if needed)
   - `/src/app/api/new-model/route.ts`
5. Create Server Actions (if needed)
   - `/src/actions/newModel.actions.ts`
6. Create admin pages
   - `/src/app/(dashboard)/admin/new-model/`
7. Update types
   - Export from `/src/types/index.ts`

## Debugging Common Issues

### "Cannot find module @/..."
- Check `tsconfig.json` paths configuration
- Restart TypeScript server (Cmd+Shift+P → Restart TS Server)

### "MongoError: Connection failed"
- Verify MONGODB_URI in .env.local
- Check IP whitelist in MongoDB Atlas
- Ensure dbConnect() is called

### "Unauthorized" on API calls
- Check session in browser DevTools (Application → Cookies)
- Verify authOptions configuration
- Check middleware matcher patterns

### Images not loading
- Verify Cloudinary env vars
- Check next.config.mjs remotePatterns
- Inspect browser console for CORS errors

### Slow page loads
- Check MongoDB queries (add indexes)
- Verify ISR configuration
- Run Lighthouse audit
- Check bundle size (`npm run build`)
