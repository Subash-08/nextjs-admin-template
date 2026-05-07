import { NextResponse } from "next/server";
import { registerSchema } from "@/validations/auth.schema";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = registerSchema.parse(body);

        await dbConnect();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        // Role is "editor" by default for new registrations via this route
        const user = await User.create({
            name,
            email,
            password,
            role: "editor",
        });

        return NextResponse.json(
            { message: "User registered successfully", userId: user._id },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}
