import React from 'react';
import Link from 'next/link';
import { fetchProjects } from '@/actions/project.actions';
import { Plus } from 'lucide-react';

export default async function AdminProjectsPage() {
    const projects = await fetchProjects();

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Projects</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
                </div>
                <Link
                    href="/admin/projects/create"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-sm shrink-0"
                >
                    <Plus size={16} />
                    Create Project
                </Link>
            </div>

            {/* Projects List */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {projects.length === 0 ? (
                    <div className="text-center py-16 px-6">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Plus size={20} className="text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">No projects yet</p>
                        <p className="text-sm text-gray-500 mb-4">Get started by creating your first project.</p>
                        <Link
                            href="/admin/projects/create"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            <Plus size={14} /> Create Project
                        </Link>
                    </div>
                ) : (
                    <ul role="list" className="divide-y divide-gray-100">
                        {projects.map((project: any) => (
                            <li key={project._id} className="group hover:bg-gray-50 transition-colors">
                                <Link href={`/admin/projects/edit/${project._id}`} className="block px-5 py-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {project.thumbnail?.url ? (
                                                <img
                                                    src={project.thumbnail.url}
                                                    alt={project.title}
                                                    className="h-10 w-10 rounded-lg object-cover shrink-0 border border-gray-100"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center text-gray-400 text-xs font-bold">
                                                    {project.title?.charAt(0)?.toUpperCase()}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                                    {project.title}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate mt-0.5">
                                                    {project.clientName}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                project.status === 'published'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : project.status === 'archived'
                                                    ? 'bg-gray-100 text-gray-600'
                                                    : 'bg-amber-100 text-amber-700'
                                            }`}
                                        >
                                            {project.status}
                                        </span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
