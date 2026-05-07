import React from 'react';
import { fetchProjectBySlug } from '@/actions/project.actions';
import ResponsiveImage from '@/components/shared/ResponsiveImage';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const project = await fetchProjectBySlug(slug);

    return {
        title: project.seoTitle || project.title,
        description: project.seoDescription || project.shortSummary,
        openGraph: {
            images: project.ogImage?.url ? [project.ogImage.url] : [],
        },
    };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await fetchProjectBySlug(slug);

    if (!project || project.status !== 'published') {
        notFound();
    }

    return (
        <article className="min-h-screen bg-white dark:bg-gray-900">
            {/* Hero Section */}
            <div className="w-full h-[60vh] relative">
                <ResponsiveImage
                    src={project.coverImage?.url || '/placeholder.jpg'}
                    alt={project.title}
                    aspectRatio="16:9"
                    className="h-full"
                    priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">{project.title}</h1>
                        <p className="text-xl md:text-2xl max-w-2xl mx-auto">{project.shortSummary}</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                {/* Project Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16 border-b border-gray-200 dark:border-gray-700 pb-12">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Client</h3>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{project.clientName}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Industry</h3>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{project.clientIndustry}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Services</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.tags?.map((tag: string) => (
                                <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Website</h3>
                        {project.clientWebsite ? (
                            <a href={project.clientWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Visit Live Site
                            </a>
                        ) : (
                            <p className="text-gray-400">N/A</p>
                        )}
                    </div>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-12">
                        {project.overview && (
                            <section>
                                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Overview</h2>
                                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">{project.overview}</div>
                            </section>
                        )}

                        {project.problemStatement && (
                            <section>
                                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">The Challenge</h2>
                                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">{project.problemStatement}</div>
                            </section>
                        )}

                        {project.processSteps && project.processSteps.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Process</h2>
                                <div className="space-y-4">
                                    {project.processSteps.map((step: string, idx: number) => (
                                        <div key={idx} className="flex items-start">
                                            <span className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mr-4">
                                                {idx + 1}
                                            </span>
                                            <p className="text-gray-700 dark:text-gray-300 mt-1">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {project.galleryImages && project.galleryImages.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Gallery</h2>
                                <div className="space-y-8">
                                    {project.galleryImages.map((img: any, idx: number) => (
                                        <ResponsiveImage
                                            key={idx}
                                            src={img.url}
                                            alt={img.alt || `Gallery Image ${idx + 1}`}
                                            aspectRatio="16:10"
                                            className="rounded-lg shadow-lg"
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        {project.challenges && project.challenges.length > 0 && (
                            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Key Challenges</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                                    {project.challenges.map((c: string, idx: number) => (
                                        <li key={idx}>{c}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {project.solution && project.solution.length > 0 && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Our Solution</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                                    {project.solution.map((s: string, idx: number) => (
                                        <li key={idx}>{s}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {project.metrics && project.metrics.length > 0 && (
                            <div className="bg-gray-900 text-white p-6 rounded-xl">
                                <h3 className="text-xl font-bold mb-4">Results</h3>
                                <div className="space-y-4">
                                    {project.metrics.map((m: string, idx: number) => (
                                        <div key={idx} className="border-l-4 border-blue-500 pl-4">
                                            <p className="text-lg font-semibold">{m}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
