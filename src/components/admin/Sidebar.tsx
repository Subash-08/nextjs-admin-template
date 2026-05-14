'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FolderKanban, FileText, LayoutGrid, FolderTree,
  LogOut, PlusCircle, Inbox, Trash2, Tags, ChevronDown, ChevronRight, Mail,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

const Sidebar = () => {
  const pathname = usePathname();
  const [blogExpanded, setBlogExpanded] = useState(pathname?.startsWith('/admin/blogs') ?? false);

  const topLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { href: '/admin/portfolio-layout', label: 'Portfolio Layout', icon: LayoutGrid },
    { href: '/admin/categories', label: 'Project Categories', icon: FolderTree },
    { href: '/admin/newsletters', label: 'Newsletter', icon: Mail },
  ];

  const blogLinks = [
    { href: '/admin/blogs', label: 'All Posts', icon: FileText, exact: true },
    { href: '/admin/blogs/new', label: 'New Post', icon: PlusCircle, exact: false },
    { href: '/admin/blogs/review-queue', label: 'AI Review Queue', icon: Inbox, exact: false },
    { href: '/admin/blogs/trash', label: 'Trash', icon: Trash2, exact: false },
    { href: '/admin/blogs/categories', label: 'Categories', icon: Tags, exact: false },
  ];

  const isLinkActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <div className="w-60 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-5 border-b border-gray-100">
        <h1 className="text-lg font-bold tracking-tight text-gray-900">
          Admin<span className="text-blue-600">Panel</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {topLinks.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                active ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon size={17} className="shrink-0" />
              <span className="truncate">{link.label}</span>
            </Link>
          );
        })}

        {/* Blogs Collapsible Group */}
        <div>
          <button
            onClick={() => setBlogExpanded((p) => !p)}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              pathname?.startsWith('/admin/blogs')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText size={17} className="shrink-0" />
              <span>Blogs</span>
            </div>
            {blogExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {blogExpanded && (
            <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3">
              {blogLinks.map((link) => {
                const Icon = link.icon;
                const active = isLinkActive(link.href, link.exact);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      active ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={15} className="shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all duration-150"
        >
          <LogOut size={17} className="shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
