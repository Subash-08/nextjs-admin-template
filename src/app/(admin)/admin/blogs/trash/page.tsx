import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getBlogs } from '@/services/blogService';
import TrashBlogCard from '@/components/admin/blog/TrashBlogCard';

export const metadata = {
  title: 'Trash | Admin',
};

export default async function TrashPage() {
  const session = await getServerSession(authOptions);

  if (!session || !['admin', 'editor'].includes(session.user.role)) {
    redirect('/login');
  }

  const { data: trashedBlogs } = await getBlogs({
    page: 1,
    limit: 100,
    status: 'trash',
  });

  const serializedBlogs = JSON.parse(JSON.stringify(trashedBlogs));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Trash</h1>
        <p className="text-gray-500 mt-1">
          Deleted blogs ({serializedBlogs.length}) - Restore or permanently delete
        </p>
      </div>

      {serializedBlogs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          Trash is empty
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {serializedBlogs.map((blog: any) => (
            <Suspense key={blog._id} fallback={<div>Loading...</div>}>
              <TrashBlogCard blog={blog} />
            </Suspense>
          ))}
        </div>
      )}
    </div>
  );
}
