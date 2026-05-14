import { z } from 'zod';

export const N8nBlogWebhookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
  contentHtml: z.string().min(100, 'Content must be at least 100 characters'),
  excerpt: z.string().min(50).max(500),
  author: z.string().default('AI Generated'),

  seo: z.object({
    metaTitle: z.string().min(10).max(60),
    metaDescription: z.string().min(50).max(160),
    focusKeyword: z.string().min(1),
    secondaryKeywords: z.array(z.string()).optional(),
    structuredDataType: z.enum(['Article', 'BlogPosting', 'HowTo', 'FAQPage']).optional(),
  }),

  category: z.object({
    slug: z.string().min(1, 'Category slug is required'),
  }),

  tags: z.array(z.string()).optional(),

  aiMetadata: z.object({
    generatedBy: z.string(),
    generationDate: z.string().datetime(),
    modelUsed: z.string(),
    qualityScore: z.number().min(0).max(100).optional(),
  }),

  // Webhook authentication
  webhookSecret: z.string().min(1),
});

export const BlogCreateSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  excerpt: z.string().min(50).max(500),
  author: z.string().min(1),

  contentBlocks: z.array(z.object({
    id: z.string(),
    type: z.enum(['h2', 'h3', 'paragraph', 'list', 'image', 'code', 'quote', 'video', 'faq', 'spacer', 'cta']),
    order: z.number(),
    content: z.string().optional(),
    listType: z.enum(['ordered', 'unordered']).optional(),
    listItems: z.array(z.string()).optional(),
    imageUrl: z.string().url().optional(),
    imageAlt: z.string().optional(),
    imageCaption: z.string().optional(),
    imageWidth: z.number().optional(),
    imageHeight: z.number().optional(),
    codeLanguage: z.string().optional(),
    codeContent: z.string().optional(),
    question: z.string().optional(),
    answer: z.string().optional(),
    ctaText: z.string().optional(),
    ctaLink: z.string().optional(),
    ctaStyle: z.enum(['primary', 'secondary']).optional(),
    videoUrl: z.string().optional(),
    videoThumbnail: z.string().optional(),
    videoDuration: z.number().optional(),
    anchorId: z.string().optional(),
  })),

  featuredImage: z.object({
    url: z.string().url(),
    publicId: z.string(),
    alt: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
  }),

  seo: z.object({
    metaTitle: z.string().min(10).max(60),
    metaDescription: z.string().min(50).max(160),
    focusKeyword: z.string(),
    secondaryKeywords: z.array(z.string()).optional(),
  }),

  categorySlug: z.string(),
  tags: z.array(z.string()).optional(),

  workflow: z.object({
    status: z.enum(['draft', 'published']),
    creationType: z.enum(['manual', 'n8n_auto_generated']),
  }),
});

export const BlogUpdateSchema = BlogCreateSchema.partial();
