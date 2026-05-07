import { z } from "zod";

const envSchema = z.object({
    MONGODB_URI: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().url(),
    CLOUDINARY_CLOUD_NAME: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
    console.error(
        "❌ Invalid environment variables:",
        JSON.stringify(env.error.format(), null, 4)
    );
    process.exit(1);
}

export const ENV = env.data;
