import { z } from 'zod';
import { ObjectIdSchema } from './common.schema';

export const CategoryCreateSchema = z.object({
    name: z.string().min(1).max(100),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    description: z.string().optional(),
    parentId: ObjectIdSchema.optional().or(z.literal('none')),
    status: z.enum(['active', 'inactive']).default('active'),
    displayOrder: z.number().default(0)
});

export const CategoryUpdateSchema = CategoryCreateSchema.partial();
