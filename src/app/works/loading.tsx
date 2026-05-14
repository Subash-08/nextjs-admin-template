import { ProjectCardSkeleton } from '@/components/skeletons';

export default function WorksLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-20">
      <div className="h-12 bg-gray-200 rounded w-64 mb-12 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
