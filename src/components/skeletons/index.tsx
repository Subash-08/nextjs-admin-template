export function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full animate-pulse">
      <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="w-full h-[60vh] md:h-[80vh] bg-gray-100 animate-pulse flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-4xl space-y-6 text-center">
        <div className="h-16 md:h-24 bg-gray-200 rounded-lg w-3/4 mx-auto"></div>
        <div className="h-6 md:h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
        <div className="flex gap-4 justify-center mt-8">
          <div className="h-12 bg-gray-200 rounded w-32"></div>
          <div className="h-12 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </div>
  );
}

export function ContentSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 space-y-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="w-full aspect-video bg-gray-200 rounded-lg mt-8"></div>
    </div>
  );
}
