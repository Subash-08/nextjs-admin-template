# Code Conventions & Standards

## File Naming
- Components: PascalCase (ProjectCard.tsx)
- Utilities: camelCase (slugify.ts)
- Types: PascalCase (IProject.ts)
- Pages: lowercase (page.tsx, layout.tsx)

## Component Patterns
```typescript
// Server Component (default)
export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectGrid projects={projects} />;
}

// Client Component (when needed)
'use client';
export default function ProjectForm() { ... }
```

## Type Safety
- NO `any` types (use `unknown` + type guards)
- Export interfaces from models
- Use Zod for runtime validation
- Infer types from Zod: `z.infer<typeof Schema>`

## Error Handling
```typescript
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  console.error('[CONTEXT_ERROR]', error);
  return { 
    success: false, 
    error: error instanceof Error ? error.message : 'Unknown error' 
  };
}
```

## Validation Pattern
```typescript
// 1. Define schema
const Schema = z.object({ ... });

// 2. Validate in action
export async function action(data: unknown) {
  const validated = Schema.parse(data);  // Throws on error
  // ... use validated
}

// 3. Handle in component
try {
  const result = await action(formData);
  if (result.success) { ... }
} catch (error) {
  if (error instanceof z.ZodError) {
    setErrors(error.errors);
  }
}
```

## Service Layer Pattern
```typescript
// services/projectService.ts
export async function create(data: ProjectInput) {
  await dbConnect();
  
  // Business logic
  const slug = await generateUniqueSlug(data.title);
  
  // Database operation
  const project = await Project.create({ ...data, slug });
  
  return project.toObject();  // Return plain object
}
```

## API Route Pattern
```typescript
export async function POST(req: NextRequest) {
  try {
    // 1. Auth
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false }, { status: 401 });
    
    // 2. Rate limit
    const { success } = await checkRateLimit(req.ip);
    if (!success) return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
    
    // 3. Validation
    const data = Schema.parse(await req.json());
    
    // 4. Business logic
    const result = await service.operation(data);
    
    // 5. Response
    return NextResponse.json({ success: true, data: result });
    
  } catch (error) {
    console.error('[API_ERROR]', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
```

## Import Order
```typescript
// 1. External
import { useState } from 'react';
import { NextRequest } from 'next/server';

// 2. Internal (absolute imports with @/)
import { Button } from '@/components/ui/Button';
import { projectService } from '@/services/projectService';

// 3. Types
import type { IProject } from '@/types';

// 4. Relative
import { helper } from './helper';
```

## Styling
- Use Tailwind utility classes
- Extract repeated patterns to components
- Use CSS variables for theme colors
- Mobile-first responsive design
