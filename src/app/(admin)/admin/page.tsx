import React from 'react';
import Project from '@/models/Project';
import Category from '@/models/Category';
import dbConnect from '@/lib/db';
import Link from 'next/link';
import { FolderKanban, CheckCircle2, FileEdit, FolderTree, Plus, ArrowRight } from 'lucide-react';

export default async function AdminDashboardPage() {
    await dbConnect();

    const projectCount = await Project.countDocuments();
    const categoryCount = await Category.countDocuments();
    const publishedProjects = await Project.countDocuments({ status: 'published' });
    const draftProjects = await Project.countDocuments({ status: 'draft' });

    const stats = [
        {
            label: 'Total Projects',
            value: projectCount,
            icon: FolderKanban,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-100',
        },
        {
            label: 'Published',
            value: publishedProjects,
            icon: CheckCircle2,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
        },
        {
            label: 'Drafts',
            value: draftProjects,
            icon: FileEdit,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
        },
        {
            label: 'Categories',
            value: categoryCount,
            icon: FolderTree,
            color: 'text-violet-600',
            bg: 'bg-violet-50',
            border: 'border-violet-100',
        },
    ];

    const quickActions = [
        {
            label: 'Create New Project',
            href: '/admin/projects/create',
            description: 'Add a new portfolio project',
        },
        {
            label: 'Manage Projects',
            href: '/admin/projects',
            description: 'View and edit all projects',
        },
        {
            label: 'Create Category',
            href: '/admin/categories/create',
            description: 'Add a new project category',
        },
        {
            label: 'Portfolio Layout',
            href: '/admin/portfolio-layout',
            description: 'Configure the portfolio grid',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Overview of your portfolio content</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className={`bg-white rounded-xl border ${stat.border} p-5 flex items-center gap-4 shadow-sm`}
                        >
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl shrink-0`}>
                                <Icon size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">
                                    {stat.label}
                                </p>
                                <p className={`text-3xl font-bold mt-0.5 ${stat.color}`}>
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quickActions.map((action) => (
                        <Link
                            key={action.href}
                            href={action.href}
                            className="group bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-300 hover:shadow-sm transition-all duration-150"
                        >
                            <div>
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {action.label}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
                            </div>
                            <ArrowRight
                                size={16}
                                className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-4"
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
