import React from 'react';
import ProjectForm from '@/components/admin/ProjectForm';
import { fetchCategories } from '@/actions/category.actions';
import { fetchProjectById } from '@/actions/project.actions';
import { notFound } from 'next/navigation';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [project, categories] = await Promise.all([
        fetchProjectById(id),
        fetchCategories()
    ]);

    if (!project) {
        notFound();
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Edit Project: {project.title}</h1>
            <ProjectForm project={project} categories={categories} />
        </div>
    );
}
