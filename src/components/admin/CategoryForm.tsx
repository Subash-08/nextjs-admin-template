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
        { message: '' }
    );

    const inputClass =
        'block w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20';

    const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

    return (
        <form action={formAction}>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/40">
                    <h3 className="text-sm font-semibold text-gray-900">Category Details</h3>
                </div>
                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className={labelClass}>
                                Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                defaultValue={category?.name || ''}
                                required
                                className={inputClass}
                                placeholder="e.g. Web Design"
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label htmlFor="slug" className={labelClass}>
                                Slug
                            </label>
                            <input
                                type="text"
                                name="slug"
                                id="slug"
                                defaultValue={category?.slug || ''}
                                className={inputClass}
                                placeholder="e.g. web-design"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Parent Category */}
                        <div>
                            <label htmlFor="parentId" className={labelClass}>
                                Parent Category
                            </label>
                            <select
                                id="parentId"
                                name="parentId"
                                defaultValue={category?.parentId || 'none'}
                                className={inputClass}
                            >
                                <option value="none">None</option>
                                {categories.filter(c => c._id !== category?._id).map((c) => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label htmlFor="status" className={labelClass}>
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                defaultValue={category?.status || 'active'}
                                className={inputClass}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {state?.message && (
                        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">
                            {state.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end mt-5">
                <button
                    type="submit"
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {category ? 'Update Category' : 'Create Category'}
                </button>
            </div>
        </form>
    );
}
