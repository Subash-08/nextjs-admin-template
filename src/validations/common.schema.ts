import { z } from 'zod';

export const IImageSchema = z.object({
    url: z.string().url('Invalid image URL'),
    publicId: z.string().optional(),
    alt: z.string().optional(),
    caption: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    format: z.string().optional(),
    fileSize: z.number().optional()
});

export const TechStackSchema = z.object({
    name: z.string().min(1, 'Tech name is required'),
    icon: z.string().optional()
});

export const ProcessStepSchema = z.object({
    title: z.string().min(1, 'Process title is required'),
    description: z.string().min(1, 'Process description is required')
});

export const MetricSchema = z.object({
    label: z.string().min(1, 'Metric label is required'),
    value: z.string().min(1, 'Metric value is required')
});

export const TestimonialSchema = z.object({
    quote: z.string().min(1, 'Testimonial quote is required'),
    author: z.string().min(1, 'Testimonial author is required'),
    role: z.string().optional(),
    company: z.string().optional(),
    avatar: IImageSchema.optional()
});

export const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId');
