import { HeroSkeleton, ContentSkeleton } from '@/components/skeletons';

export default function Loading() {
  return (
    <div className="w-full">
      <HeroSkeleton />
      <div className="py-20">
        <ContentSkeleton />
      </div>
    </div>
  );
}
