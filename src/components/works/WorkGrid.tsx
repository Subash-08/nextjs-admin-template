import { IProject } from '@/models/Project';
import WorkCard from './WorkCard';

interface WorkGridProps {
    projects: IProject[];
}

export default function WorkGrid({ projects }: WorkGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {projects.map((project) => (
                <WorkCard key={(project._id as unknown) as string} project={project} />
            ))}
        </div>
    );
}
