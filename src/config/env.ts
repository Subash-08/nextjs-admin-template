import { z } from "zod";

const envSchema = z.object({
    MONGODB_URI: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(32),
    NEXTAUTH_URL: z.string().url().optional(),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
    NEXT_PUBLIC_APP_URL: z.string().url().optional().default('http://localhost:3000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GITHUB_ID: z.string().optional(),
    GITHUB_SECRET: z.string().optional(),
    N8N_WEBHOOK_SECRET: z.string().min(32, 'N8N webhook secret must be at least 32 characters').optional(),
    CRON_SECRET: z.string().optional(),
});

const envParsed = envSchema.safeParse(process.env);

if (!envParsed.success) {
    console.error(
        "❌ Invalid environment variables:",
        JSON.stringify(envParsed.error.format(), null, 4)
    );
    throw new Error('Invalid environment variables');
}

export const env = envParsed.data;
