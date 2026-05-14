import React from 'react';
import ProjectForm from '@/components/admin/ProjectForm';
import { fetchCategories } from '@/actions/category.actions';
import { fetchProjectById } from '@/actions/project.actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

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
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
                <Link href="/admin/projects" className="hover:text-blue-600 transition-colors font-medium">
                    Projects
                </Link>
                <ChevronRight size={13} className="text-gray-400" />
                <span className="text-gray-900 font-medium truncate max-w-xs">{project.title}</span>
            </nav>
            <ProjectForm project={project} categories={categories} />
        </div>
    );
}
