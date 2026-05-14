import { z } from 'zod';
import { IImageSchema, TechStackSchema, ProcessStepSchema, MetricSchema, TestimonialSchema, ObjectIdSchema } from './common.schema';

export const ProjectCreateSchema = z.object({
    title: z.string().min(1).max(200),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    shortSummary: z.string().min(10).max(500),
    description: z.string().min(50),
    
    thumbnail: IImageSchema.optional(),
    coverImage: IImageSchema.optional(),
    gallery: z.array(IImageSchema).optional(),

    clientName: z.string().optional(),
    company: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    role: z.string().optional(),
    year: z.number().optional(),

    categoryId: ObjectIdSchema.optional().or(z.literal('')),

    overview: z.string().optional(),
    problemStatement: z.string().optional(),
    objectives: z.array(z.string()).optional(),
    challenges: z.array(z.string()).optional(),
    solutions: z.array(z.string()).optional(),

    techStack: z.array(TechStackSchema).optional(),
    processSteps: z.array(ProcessStepSchema).optional(),
    metrics: z.array(MetricSchema).optional(),
    testimonial: TestimonialSchema.optional(),

    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    isFeatured: z.boolean().default(false),
    showInPortfolio: z.boolean().default(true),
    displayOrder: z.number().default(0),

    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    seoKeywords: z.array(z.string()).max(10).optional(),
    tags: z.array(z.string()).optional(),

    relatedProjects: z.array(ObjectIdSchema).optional()
});

export const ProjectUpdateSchema = ProjectCreateSchema.partial();
