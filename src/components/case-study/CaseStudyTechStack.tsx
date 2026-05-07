import { IProject } from '@/models/Project';

export default function CaseStudyTechStack({ techStack }: { techStack: IProject['techStack'] }) {
    if (!techStack || techStack.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-3">
            {techStack.map((tech, index) => (
                <div
                    key={index}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:border-gray-300 cursor-default"
                >
                    {tech.name}
                </div>
            ))}
        </div>
    );
}
