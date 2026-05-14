import React from 'react';
import CategoryForm from '@/components/admin/CategoryForm';
import { fetchCategories } from '@/actions/category.actions';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default async function CreateCategoryPage() {
    const categories = await fetchCategories();

    return (
        <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
                <Link href="/admin/categories" className="hover:text-blue-600 transition-colors font-medium">
                    Categories
                </Link>
                <ChevronRight size={13} className="text-gray-400" />
                <span className="text-gray-900 font-medium">Create New Category</span>
            </nav>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Create New Category</h1>
                <CategoryForm categories={categories} />
            </div>
        </div>
    );
}
