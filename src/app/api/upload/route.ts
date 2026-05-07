import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/services/upload.service";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const folder = formData.get("folder") as string;

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        const result = await uploadToCloudinary(file, folder || "next-js-admin");

        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
