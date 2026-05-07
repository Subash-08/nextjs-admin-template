"use client";

import { useSession, signOut } from "next-auth/react";

export default function AdminDashboardPage() {
    const { data: session } = useSession();

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <div className="bg-card p-6 rounded-lg border shadow-sm max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">Welcome Admin</h2>

                <div className="space-y-2 mb-6">
                    <p><span className="font-medium">Email:</span> {session?.user?.email}</p>
                    <p><span className="font-medium">Role:</span> <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">{session?.user?.role}</span></p>
                    <p><span className="font-medium">ID:</span> <span className="font-mono text-sm text-muted-foreground">{session?.user?.id}</span></p>
                </div>

                <button
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
