import Link from "next/link";
import { NAV_ITEMS } from "@/constants";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r hidden md:block">
                <div className="p-6">
                    <h1 className="text-2xl font-bold">Admin</h1>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 bg-background">
                {children}
            </main>
        </div>
    );
}
