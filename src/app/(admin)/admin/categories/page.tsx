import React from 'react';
import Link from 'next/link';
import { fetchCategories, removeCategory } from '@/actions/category.actions';
import { Plus } from 'lucide-react';

export default async function AdminCategoriesPage() {
    const categories = await fetchCategories();

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Categories</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{categories.length} categor{categories.length !== 1 ? 'ies' : 'y'} total</p>
                </div>
                <Link
                    href="/admin/categories/create"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-sm shrink-0"
                >
                    <Plus size={16} />
                    Create Category
                </Link>
            </div>

            {/* Categories List */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {categories.length === 0 ? (
                    <div className="text-center py-16 px-6">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Plus size={20} className="text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">No categories yet</p>
                        <p className="text-sm text-gray-500 mb-4">Create your first category to organize projects.</p>
                        <Link
                            href="/admin/categories/create"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            <Plus size={14} /> Create Category
                        </Link>
                    </div>
                ) : (
                    <ul role="list" className="divide-y divide-gray-100">
                        {categories.map((category: any) => (
                            <li key={category._id} className="hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between gap-4 px-5 py-4">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{category.name}</p>
                                        <span
                                            className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                category.status === 'active'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {category.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <Link
                                            href={`/admin/categories/edit/${category._id}`}
                                            className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        <form
                                            action={async () => {
                                                'use server';
                                                await removeCategory(category._id);
                                            }}
                                        >
                                            <button
                                                type="submit"
                                                className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Notice */}
            <p className="text-xs text-gray-400 leading-relaxed">
                Note: Deleting a category that is a parent to other categories or assigned to projects may cause issues. (Safe deletion logic to be enhanced)
            </p>
        </div>
    );
}
