import React from 'react';
import ProjectForm from '@/components/admin/ProjectForm';
import { fetchCategories } from '@/actions/category.actions';

export default async function CreateProjectPage() {
    const categories = await fetchCategories();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Create New Project</h1>
            <ProjectForm categories={categories} />
        </div>
    );
}
