import React from 'react';
import { fetchProjects } from '@/actions/project.actions';
import ResponsiveImage from '@/components/shared/ResponsiveImage';
import Link from 'next/link';

export default async function PortfolioPage() {
    const projects = await fetchProjects();
    const publishedProjects = projects.filter((p: any) => p.status === 'published' && p.showInPortfolio);

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-5xl font-bold mb-12 text-center text-gray-900">Our Portfolio</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publishedProjects.length === 0 ? (
                    <p className="text-center col-span-full text-gray-500">No projects found.</p>
                ) : (
                    publishedProjects.map((project: any) => (
                        <Link key={project._id} href={`/portfolio/${project.slug}`} className="group block">
                            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="relative">
                                    <ResponsiveImage
                                        src={project.thumbnail?.url || '/placeholder.jpg'}
                                        alt={project.title}
                                        aspectRatio="4:5"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{project.clientIndustry}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
