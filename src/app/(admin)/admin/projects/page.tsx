import React from 'react';
import Link from 'next/link';
import { fetchProjects } from '@/actions/project.actions';

export default async function AdminProjectsPage() {
    const projects = await fetchProjects();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
                <Link href="/admin/projects/create" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Create Project
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                    {projects.length === 0 ? (
                        <li className="px-4 py-4 sm:px-6 text-gray-500 dark:text-gray-400">No projects found.</li>
                    ) : (
                        projects.map((project: any) => (
                            <li key={project._id} className="block hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Link href={`/admin/projects/edit/${project._id}`} className="block">
                                    <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                        <div className="flex items-center">
                                            {project.thumbnail?.url && (
                                                <img src={project.thumbnail.url} alt={project.title} className="h-10 w-10 rounded-full object-cover mr-4" />
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">{project.title}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{project.clientName}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${project.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {project.status}
                                        </span>
                                    </div>
                                </Link>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
