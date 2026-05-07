import { IProject } from '@/models/Project';
import ResponsiveImage from '@/components/shared/ResponsiveImage';
import Container from '@/components/layout/Container';

export default function CaseStudyHero({ project }: { project: IProject }) {
    // Use override or cover image
    const heroImage = project.heroImageOverride?.url ? project.heroImageOverride : project.coverImage;
    const overlayOpacity = project.heroImageOverlayOpacity || 0.4;
    const overlayColor = project.heroImageOverlayColor || '#000000';

    return (
        <section className="relative h-screen min-h-[700px] flex items-end pb-20 justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 select-none">
                <ResponsiveImage
                    src={heroImage.url}
                    alt={heroImage.alt || project.title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
                {/* Dynamic Overlay */}
                <div
                    className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                    style={{ opacity: Math.max(overlayOpacity, 0.6) }} // Ensure enough contrast at bottom
                />
            </div>

            {/* Content */}
            <Container className="relative z-20 w-full text-center">
                <div className="max-w-5xl mx-auto">
                    <div className="inline-flex items-center space-x-3 text-sm font-semibold tracking-[0.2em] uppercase mb-8 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 text-white shadow-2xl">
                        <span>{typeof project.categoryId === 'object' ? (project.categoryId as any).name : 'Case Study'}</span>
                        {project.projectYear && (
                            <>
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                <span>{project.projectYear}</span>
                            </>
                        )}
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-tight tracking-tight text-white drop-shadow-xl">
                        {project.title}
                    </h1>

                    <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed mb-12">
                        {project.shortSummary}
                    </p>

                    <div className="flex flex-wrap justify-center gap-10 md:gap-20 text-base font-medium text-white border-t border-white/10 pt-10">
                        {project.clientName && (
                            <div className="flex flex-col items-center gap-1 group">
                                <span className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1 group-hover:text-blue-300 transition-colors">Client</span>
                                <span className="text-lg">{project.clientName}</span>
                            </div>
                        )}
                        {project.projectLocation && (
                            <div className="flex flex-col items-center gap-1 group">
                                <span className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1 group-hover:text-blue-300 transition-colors">Location</span>
                                <span className="text-lg">{project.projectLocation}</span>
                            </div>
                        )}
                        {project.projectDuration && (
                            <div className="flex flex-col items-center gap-1 group">
                                <span className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1 group-hover:text-blue-300 transition-colors">Duration</span>
                                <span className="text-lg">{project.projectDuration}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Container>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
                <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}
