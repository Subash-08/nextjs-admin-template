import { NextRequest, NextResponse } from "next/server";
import { getUsers, createUser } from "@/services/user.service";
import { checkRateLimit } from "@/lib/rate-limit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getErrorMessage } from "@/lib/utils";
import { APIResponse } from "@/types/api.types";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ success: false, error: "Unauthorized" } as APIResponse, { status: 401 });
        }

        const { success: rateLimitSuccess } = await checkRateLimit(req);
        if (!rateLimitSuccess) {
            return NextResponse.json({ success: false, error: "Too many requests" } as APIResponse, { status: 429 });
        }

        const users = await getUsers();
        return NextResponse.json({ success: true, data: users } as APIResponse);
    } catch (error) {
        console.error('[API_ERROR]', { endpoint: '/api/users', method: 'GET', error: getErrorMessage(error) });
        return NextResponse.json({ success: false, error: getErrorMessage(error) } as APIResponse, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ success: false, error: "Unauthorized" } as APIResponse, { status: 401 });
        }

        const { success: rateLimitSuccess } = await checkRateLimit(req);
        if (!rateLimitSuccess) {
            return NextResponse.json({ success: false, error: "Too many requests" } as APIResponse, { status: 429 });
        }

        const body = await req.json();
        const user = await createUser(body);
        return NextResponse.json({ success: true, data: user } as APIResponse, { status: 201 });
    } catch (error) {
        console.error('[API_ERROR]', { endpoint: '/api/users', method: 'POST', error: getErrorMessage(error) });
        return NextResponse.json({ success: false, error: getErrorMessage(error) } as APIResponse, { status: 500 });
    }
}
