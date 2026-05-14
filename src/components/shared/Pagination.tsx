import Link from 'next/link';

interface Props {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const showPages = pages.filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      (page >= currentPage - 1 && page <= currentPage + 1)
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {currentPage > 1 && (
        <Link
          href={`${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${currentPage - 1}`}
          className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm text-gray-700"
        >
          Previous
        </Link>
      )}

      <div className="hidden sm:flex items-center gap-2">
        {showPages.map((page, index) => {
          if (index > 0 && showPages[index - 1] !== page - 1) {
            return (
              <span key={`ellipsis-${page}`} className="px-2 text-gray-400">
                ...
              </span>
            );
          }

          return (
            <Link
              key={page}
              href={`${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${page}`}
              className={`min-w-[40px] flex items-center justify-center h-10 px-3 rounded-lg transition-colors text-sm font-medium ${
                currentPage === page
                  ? 'bg-blue-600 text-white border border-blue-600'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      <div className="sm:hidden text-sm text-gray-500 font-medium px-4">
        Page {currentPage} of {totalPages}
      </div>

      {currentPage < totalPages && (
        <Link
          href={`${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${currentPage + 1}`}
          className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm text-gray-700"
        >
          Next
        </Link>
      )}
    </div>
  );
}
