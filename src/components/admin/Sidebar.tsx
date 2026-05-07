'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderTree, Users, FileCode, LogOut, LayoutGrid, FolderKanban } from 'lucide-react';
import { signOut } from 'next-auth/react';

const Sidebar = () => {
    const pathname = usePathname();

    const links = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
        {
            label: 'Portfolio Layout',
            href: '/admin/portfolio-layout',
            icon: LayoutGrid,
        },
        {
            label: 'Categories',
            href: '/admin/categories',
            icon: FolderTree,
        },
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm">
            <div className="p-6 border-b border-gray-100">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Admin<span className="text-blue-600">Panel</span></h1>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <Icon size={20} />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex w-full items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
