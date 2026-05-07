import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST() {
    const session = await getServerSession(authOptions);

    if (session) {
        // Client-side signout handles cookie clearing, 
        // server-side we can just return success or invalidate tokens if using DB sessions
        return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
    }

    return NextResponse.json({ message: "No session found" }, { status: 401 });
}
