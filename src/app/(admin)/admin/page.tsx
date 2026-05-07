import React from 'react';
import Project from '@/models/Project';
import Category from '@/models/Category';
import dbConnect from '@/lib/db';
import Link from 'next/link';

export default async function AdminDashboardPage() {
    await dbConnect();

    const projectCount = await Project.countDocuments();
    const categoryCount = await Category.countDocuments();
    const publishedProjects = await Project.countDocuments({ status: 'published' });
    const draftProjects = await Project.countDocuments({ status: 'draft' });

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Total Projects</h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{projectCount}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Published</h3>
                    <p className="mt-2 text-3xl font-semibold text-green-600 dark:text-green-400">{publishedProjects}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Drafts</h3>
                    <p className="mt-2 text-3xl font-semibold text-yellow-600 dark:text-yellow-400">{draftProjects}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Total Categories</h3>
                    <p className="mt-2 text-3xl font-semibold text-blue-600 dark:text-blue-400">{categoryCount}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
                    <div className="flex flex-col space-y-4">
                        <Link href="/admin/projects/create" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                            + Create New Project
                        </Link>
                        <Link href="/admin/categories/create" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                            + Create New Category
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
