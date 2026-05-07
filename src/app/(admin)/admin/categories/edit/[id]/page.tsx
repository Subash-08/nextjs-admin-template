import React from 'react';
import CategoryForm from '@/components/admin/CategoryForm';
import { fetchCategories, fetchCategoryById } from '@/actions/category.actions';
import { notFound } from 'next/navigation';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [category, categories] = await Promise.all([
        fetchCategoryById(id),
        fetchCategories()
    ]);

    if (!category) {
        notFound();
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Edit Category: {category.name}</h1>
            <CategoryForm category={category} categories={categories} />
        </div>
    );
}
