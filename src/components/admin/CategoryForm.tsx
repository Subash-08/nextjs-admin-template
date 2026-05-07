'use client';

import React, { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { addCategory, editCategory } from '@/actions/category.actions';

// Define a type for the Category
interface Category {
    _id: string;
    name: string;
    slug: string;
    parentId?: string;
    status: string;
}

interface CategoryFormProps {
    category?: Category | null; // Allow null
    categories?: Category[];
}

export default function CategoryForm({ category, categories = [] }: CategoryFormProps) {
    const [state, formAction] = useFormState(
        category ? editCategory.bind(null, category._id) : addCategory,
        { message: null }
    );

    return (
        <form action={formAction} className="space-y-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            defaultValue={category?.name || ''}
                            required
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
                        <input
                            type="text"
                            name="slug"
                            id="slug"
                            defaultValue={category?.slug || ''}
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                        <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">Parent Category</label>
                        <select
                            id="parentId"
                            name="parentId"
                            defaultValue={category?.parentId || 'none'}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="none">None</option>
                            {categories.filter(c => c._id !== category?._id).map((c) => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            id="status"
                            name="status"
                            defaultValue={category?.status || 'active'}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {category ? 'Update' : 'Create'}
                </button>
            </div>
        </form>
    );
}
