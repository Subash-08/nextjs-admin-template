import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import ResponsiveImage from '@/components/shared/ResponsiveImage';
import { IProject } from '@/models/Project';

interface WorkCardProps {
    project: IProject;
}

export default function WorkCard({ project }: WorkCardProps) {
    return (
        <Link href={`/works/${project.slug}`} className="group block h-full w-full">
            <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[7/5] sm:aspect-[7/5] md:aspect-[7/5] shadow-sm transition-shadow hover:shadow-md w-full">
                <ResponsiveImage
                    src={project.thumbnail?.url}
                    alt={project.thumbnail?.alt || project.title}
                    aspectRatio="4:5"
                    fill
                    className="transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-white p-2 rounded-full text-black">
                        <ArrowUpRight size={20} />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 p-6 w-full text-white transform transition-transform duration-300 group-hover:-translate-y-1">
                    <div className="flex items-center space-x-2 text-xs font-medium uppercase tracking-wider mb-2 text-gray-300">
                        <span>{typeof project.categoryId === 'object' ? (project.categoryId as any).name : 'Project'}</span>
                        <span>•</span>
                        <span>{project.clientName}</span>
                    </div>
                    <h3 className="text-xl font-bold leading-tight group-hover:text-blue-300 transition-colors">
                        {project.title}
                    </h3>
                    {project.shortSummary && (
                        <p className="mt-2 text-sm text-gray-300 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 h-0 group-hover:h-auto">
                            {project.shortSummary}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
