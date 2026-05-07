import { getProjectBySlug, getRelatedProjects } from '@/lib/data/project.queries';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import Container from '@/components/layout/Container';
import CaseStudyHero from '@/components/case-study/CaseStudyHero';
import CaseStudyGallery from '@/components/case-study/CaseStudyGallery';
import CaseStudyProcess from '@/components/case-study/CaseStudyProcess';
import CaseStudyMetrics from '@/components/case-study/CaseStudyMetrics';
import CaseStudyTechStack from '@/components/case-study/CaseStudyTechStack';
import CaseStudyTestimonial from '@/components/case-study/CaseStudyTestimonial';
import WorkCard from '@/components/works/WorkCard';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export const revalidate = 60; // ISR

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);
    if (!project) return { title: 'Project Not Found' };

    return {
        title: project.seoTitle || project.title,
        description: project.seoDescription || project.shortSummary,
        openGraph: {
            images: [project.ogImage?.url || project.coverImage?.url || ''],
        },
    };
}

export default async function CaseStudyPage({ params }: PageProps) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    const relatedProjects = await getRelatedProjects(project._id as string, typeof project.categoryId === 'string' ? project.categoryId : (project.categoryId as any)?._id);

    return (
        <article className="pb-32 bg-white">
            {/* 1. Hero Section */}
            <CaseStudyHero project={project} />

            {/* 2. Overview & Problem */}
            <section className="py-24 lg:py-32 relative">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-7 space-y-12">
                            <div>
                                <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-6">Overview</h2>
                                <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                                    {project.shortSummary}
                                </h3>
                                <div className="prose prose-lg text-gray-600 leading-relaxed max-w-none">
                                    {project.description}
                                </div>
                            </div>

                            {project.problemStatement && (
                                <div className="bg-orange-50/50 p-10 rounded-3xl border border-orange-100">
                                    <h4 className="flex items-center text-xl font-bold text-orange-900 mb-4">
                                        <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3 text-sm">!</span>
                                        The Challenge
                                    </h4>
                                    <p className="text-gray-700 text-lg leading-relaxed">{project.problemStatement}</p>
                                </div>
                            )}

                            {project.projectUrl && (
                                <div className="pt-4">
                                    <a
                                        href={project.projectUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-all hover:scale-105 shadow-lg shadow-gray-900/20"
                                    >
                                        Visit Live Site <ExternalLink size={20} className="ml-3" />
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-4 lg:col-start-9 space-y-12">
                            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                                <h4 className="font-bold text-gray-900 mb-6 text-xl">Technologies</h4>
                                <CaseStudyTechStack techStack={project.techStack} />
                            </div>

                            {project.objectives && (
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-4 text-xl border-b border-gray-100 pb-2">Objectives</h4>
                                    <p className="text-gray-600 leading-relaxed">{project.objectives}</p>
                                </div>
                            )}
                            {project.targetAudience && (
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-4 text-xl border-b border-gray-100 pb-2">Platform & Audience</h4>
                                    <p className="text-gray-600 leading-relaxed">{project.targetAudience}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Container>
            </section>

            {/* 3. Gallery (Full Width Impact) */}
            {project.galleryImages && project.galleryImages.length > 0 && (
                <section className="py-20 bg-gray-50">
                    <Container>
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Gallery</h2>
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Visual Highlights</h3>
                        </div>
                        <CaseStudyGallery images={project.galleryImages} />
                    </Container>
                </section>
            )}

            {/* 4. Process */}
            {project.processSteps && project.processSteps.length > 0 && (
                <section className="py-24 lg:py-32 overflow-hidden">
                    <Container>
                        <div className="text-center max-w-3xl mx-auto mb-20">
                            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Process</h2>
                            <h3 className="text-4xl md:text-5xl font-bold text-gray-900">How we made it happen</h3>
                        </div>
                        <CaseStudyProcess steps={project.processSteps} />
                    </Container>
                </section>
            )}

            {/* 5. Results & Validation (Dark Theme) */}
            <section className="py-24 bg-[#0B1120] text-white relative overflow-hidden">
                {/* Abstract bg shapes */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2" />
                </div>

                <Container className="relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-3">Results</h2>
                            <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Impact & Outcomes</h3>
                            <p className="text-gray-300 text-xl leading-relaxed mb-12 font-light">
                                The solution delivered measurable improvements and satisfied users, proving the value of the design and engineering choices.
                            </p>
                            <CaseStudyMetrics metrics={project.metrics} />
                        </div>
                        <div>
                            <CaseStudyTestimonial testimonial={project.testimonial} />
                        </div>
                    </div>
                </Container>
            </section>

            {/* 6. Solution List */}
            {project.solution && project.solution.length > 0 && (
                <section className="py-24">
                    <Container>
                        <div className="bg-emerald-50/50 rounded-3xl p-12 border border-emerald-100">
                            <div className="text-center max-w-3xl mx-auto mb-12">
                                <h3 className="text-3xl font-bold text-emerald-900">Key Solutions</h3>
                                <p className="text-emerald-700 mt-2">Specific features and implementations that solved the problem.</p>
                            </div>

                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                                {project.solution.map((item: any, idx: number) => (
                                    <li key={idx} className="flex items-start bg-white p-5 rounded-xl shadow-sm border border-emerald-100/50">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold mr-4 mt-0.5">✓</span>
                                        <span className="text-gray-700 font-medium">{typeof item === 'string' ? item : item.value || item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Container>
                </section>
            )}

            {/* 7. Next Projects */}
            <section className="py-24 border-t border-gray-100">
                <Container>
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Selected Work</h2>
                            <p className="text-gray-500 mt-2">More projects you might find interesting</p>
                        </div>

                        <Link href="/works" className="group flex items-center text-gray-900 font-bold hover:text-blue-600 transition-colors">
                            View All <ArrowLeft size={18} className="ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {relatedProjects.map((proj: any) => (
                            <WorkCard key={proj._id as string} project={proj} />
                        ))}
                    </div>
                </Container>
            </section>
        </article>
    );
}
