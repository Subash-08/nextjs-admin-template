import React from 'react';
import CategoryForm from '@/components/admin/CategoryForm';
import { fetchCategories } from '@/actions/category.actions';

export default async function CreateCategoryPage() {
    const categories = await fetchCategories();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Create New Category</h1>
            <CategoryForm categories={categories} />
        </div>
    );
}
