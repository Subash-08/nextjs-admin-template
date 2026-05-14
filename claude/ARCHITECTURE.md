# System Architecture

## Application Flow
```text
User Request
    ↓
Next.js Middleware (auth check)
    ↓
Page Component (Server Component)
    ↓
Service Layer (business logic)
    ↓
Mongoose Model (DB schema + validation)
    ↓
MongoDB (data persistence)
```

## Folder Structure
```text
/src
├── app/                    # Next.js App Router
│   ├── (auth)/            # Login, Register (route group)
│   ├── (dashboard)/       # Admin pages (route group)
│   ├── api/               # API routes
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # Robots.txt config
├── components/
│   ├── ui/                # Generic UI primitives
│   ├── forms/             # Form components
│   ├── shared/            # Business components (ProjectCard)
│   ├── seo/               # SEO components (StructuredData)
│   └── skeletons/         # Loading skeletons
├── actions/               # Server Actions
├── services/              # Business logic layer
├── models/                # Mongoose schemas
├── lib/                   # Core utilities (db, auth, utils)
├── validations/           # Zod schemas
├── types/                 # TypeScript types
└── config/                # App configuration
```

## Data Flow Patterns

### Create Project (Mutation)
```text
Admin Form Submission
    ↓
Server Action (addProject)
    ↓
1. Validate session (getServerSession)
2. Validate data (Zod schema)
3. Call projectService.create()
    ↓
Service Layer
    ↓
1. Check for duplicate slug
2. Create project document
3. Return sanitized project
    ↓
Redirect to /admin/projects
```

### View Project (Query)
```text
User visits /works/[slug]
    ↓
Page Component (generateMetadata + page)
    ↓
1. projectService.getBySlug(slug)
2. Generate SEO metadata
3. Render project with RSC
    ↓
ISR: Page cached for 1 hour
```

### Authentication Flow
```text
Login Attempt
    ↓
NextAuth Credentials Provider
    ↓
1. Find user by email
2. Compare password (bcrypt)
3. Generate JWT
4. Return session
    ↓
Middleware validates JWT on protected routes
```

## Database Schema Relationships
- `User (1) ←─── (many) Project` (createdBy, updatedBy)
- `Category (1) ←─── (many) Project` (categoryId)
- `Category (1) ←─── (many) Category` (parentId) [hierarchical]
- `Project (1) ←─── (many) Project` (relatedProjects)
- `PortfolioLayoutBox (1) ←─── (1) Project` (projectId)

## Caching Strategy
- **ISR**: Public pages revalidate every hour
- **MongoDB**: Connection pooling with singleton
- **Images**: Cloudinary CDN + Next.js Image optimization
- **Future**: Redis for API response caching
