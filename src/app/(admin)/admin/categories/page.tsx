import React from 'react';
import Link from 'next/link';
import { fetchCategories, removeCategory } from '@/actions/category.actions';

export default async function AdminCategoriesPage() {
    const categories = await fetchCategories();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                <Link href="/admin/categories/create" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Create Category
                </Link>
            </div>

            <div className="bg-white shadow updateoverflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {categories.length === 0 ? (
                        <li className="px-4 py-4 sm:px-6 text-gray-500">No categories found.</li>
                    ) : (
                        categories.map((category: any) => (
                            <li key={category._id} className="block hover:bg-gray-50">
                                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                    <div className="flex items-center truncate">
                                        <p className="text-sm font-medium text-blue-600 truncate">{category.name}</p>
                                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {category.status}
                                        </span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link href={`/admin/categories/edit/${category._id}`} className="text-indigo-600 hover:text-indigo-900 ">
                                            Edit
                                        </Link>
                                        <form action={async () => {
                                            'use server';
                                            await removeCategory(category._id);
                                        }}>
                                            <button type="submit" className="text-red-600 hover:text-red-900  ml-4">
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            <div className="mt-8 text-sm text-gray-500">
                <p>Note: Deleting a category that is a parent to other categories or assigned to projects may cause issues. (Safe deletion logic to be enhanced)</p>
            </div>
        </div>
    );
}
