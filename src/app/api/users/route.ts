import { NextRequest, NextResponse } from "next/server";
import { getUsers, createUser } from "@/services/user.service";

export async function GET() {
    try {
        const users = await getUsers();
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const user = await createUser(body);
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
