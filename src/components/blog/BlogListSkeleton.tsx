interface Props {
  count?: number;
}

export default function BlogListSkeleton({ count = 6 }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse flex flex-col group">
          <div className="relative h-64 w-full rounded-2xl bg-gray-200 overflow-hidden mb-6"></div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="h-4 w-20 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-24 bg-gray-200 rounded-full"></div>
          </div>
          
          <div className="h-8 w-3/4 bg-gray-200 rounded-lg mb-3"></div>
          <div className="h-8 w-1/2 bg-gray-200 rounded-lg mb-4"></div>
          
          <div className="h-4 w-full bg-gray-200 rounded-lg mb-2"></div>
          <div className="h-4 w-full bg-gray-200 rounded-lg mb-2"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded-lg"></div>
        </div>
      ))}
    </div>
  );
}
