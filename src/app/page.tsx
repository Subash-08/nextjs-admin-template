import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/layout/Container';
import WorkGrid from '@/components/works/WorkGrid';
import { getFeaturedProjects } from '@/services/project.service';
import { generateSEO } from '@/lib/seo';
import { OrganizationStructuredData } from '@/components/seo/StructuredData';

export const revalidate = 3600; // ISR - 1 hour

export const metadata = generateSEO({
    title: 'Home',
    description: 'I help brands and startups build scalable, user-centric interfaces using modern technologies.',
    keywords: ['portfolio', 'nextjs', 'react', 'web development'],
});

export default async function HomePage() {
    const featuredProjects = await getFeaturedProjects();
    return (
        <main>
            <OrganizationStructuredData />
            {/* Hero Section */}
            <section className="pt-32 pb-20 md:pt-48 md:pb-32 bg-white">
                <Container>
                    <div className="max-w-4xl">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6">
                            Building digital <br className="hidden md:block" />
                            <span className="text-blue-600">experiences</span> that matter.
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
                            I help brands and startups build scalable, user-centric interfaces using modern technologies like React, Next.js, and TypeScript.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/works"
                                className="px-8 py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors flex items-center"
                            >
                                View Selected Work <ArrowRight className="ml-2" size={18} />
                            </Link>
                            <Link
                                href="/contact"
                                className="px-8 py-4 bg-gray-100 text-gray-900 font-medium rounded-full hover:bg-gray-200 transition-colors"
                            >
                                Contact Me
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>
            {/* Featured Projects */}
            <section className="py-20 bg-gray-50 border-t border-gray-100">
                <Container>
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Projects</h2>
                            <p className="text-gray-500">A selection of my recent work.</p>
                        </div>
                        <Link
                            href="/works"
                            className="hidden md:flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                        >
                            View all projects <ArrowRight className="ml-1" size={16} />
                        </Link>
                    </div>

                    {featuredProjects.length > 0 ? (
                        <WorkGrid projects={featuredProjects} />
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No featured projects found. Check back soon!</p>
                        </div>
                    )}

                    <div className="mt-12 text-center md:hidden">
                        <Link
                            href="/works"
                            className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                        >
                            View all projects <ArrowRight className="ml-1" size={16} />
                        </Link>
                    </div>
                </Container>
            </section>
        </main>
    );
}
