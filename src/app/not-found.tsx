import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-bold mb-4 text-gray-200">404</h1>
      <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        We could not find the page you are looking for. It might have been moved or deleted.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link 
          href="/"
          className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Return Home
        </Link>
        <Link 
          href="/works"
          className="px-6 py-3 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200 transition-colors"
        >
          View Our Works
        </Link>
      </div>
    </div>
  );
}
