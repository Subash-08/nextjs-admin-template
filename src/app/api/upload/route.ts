import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/services/upload.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sanitizeFileName } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/rate-limit";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
    try {
        // 1. Session check - require admin or editor role
        const session = await getServerSession(authOptions);
        if (!session || !['admin', 'editor'].includes(session.user.role)) {
            return NextResponse.json({ success: false, error: "Unauthorized: Admin or editor role required" }, { status: 401 });
        }

        // 2. Rate limiting (10 requests per 10 seconds - using default)
        const { success: rateLimitSuccess, limit, remaining, reset } = await checkRateLimit(req);
        if (!rateLimitSuccess) {
            return NextResponse.json(
                { success: false, error: "Too many requests" },
                { 
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': limit.toString(),
                        'X-RateLimit-Remaining': remaining.toString(),
                        'X-RateLimit-Reset': new Date(reset).toISOString()
                    }
                }
            );
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const folder = formData.get("folder") as string;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file received." }, { status: 400 });
        }

        // 3. File size validation
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ success: false, error: "File exceeds maximum size of 5MB." }, { status: 400 });
        }

        // 4. File type validation
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return NextResponse.json({ success: false, error: "Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed." }, { status: 400 });
        }

        // 5. Sanitize filename (We'll use a new File object or just pass it differently if uploadToCloudinary handles it. We'll modify uploadToCloudinary to accept a sanitized name)
        // Since uploadToCloudinary uses arrayBuffer, we just pass the file. The cloudinary uploader might not use the original filename by default unless specified. But we can pass it if we update the service.
        // Let's sanitize it here and we'll pass it to uploadToCloudinary shortly.
        const sanitizedName = sanitizeFileName(file.name);

        const result: any = await uploadToCloudinary(file, folder || "next-js-admin");

        // 6. Return structured response with publicId, format etc.
        return NextResponse.json({ 
            success: true, 
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
                fileSize: result.bytes
            }
        }, { status: 200 });
    } catch (error) {
        console.error('[API_ERROR]', {
            endpoint: '/api/upload',
            method: 'POST',
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString(),
        });
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
