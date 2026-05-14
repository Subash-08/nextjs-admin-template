import { ContentSkeleton } from '@/components/skeletons';

export default function ProjectLoading() {
  return (
    <div className="w-full">
      <div className="w-full h-[60vh] bg-gray-100 animate-pulse"></div>
      <div className="-mt-20 relative z-10 bg-white rounded-t-3xl pt-12">
        <ContentSkeleton />
      </div>
    </div>
  );
}
