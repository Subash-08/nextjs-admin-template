import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getBlogs } from '@/services/blogService';
import AIReviewCard from '@/components/admin/blog/AIReviewCard';

export const metadata = {
  title: 'AI Blog Review Queue | Admin',
};

export default async function AIReviewQueuePage() {
  const session = await getServerSession(authOptions);

  if (!session || !['admin', 'editor'].includes(session.user.role)) {
    redirect('/login');
  }

  const { data: aiBlogs } = await getBlogs({
    page: 1,
    limit: 50,
    status: 'draft',
  });

  const serializedBlogs = JSON.parse(JSON.stringify(aiBlogs));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Blog Review Queue</h1>
        <p className="text-gray-500 mt-1">
          Review AI-generated blog posts before publishing ({serializedBlogs.length} pending)
        </p>
      </div>

      {serializedBlogs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No AI blogs awaiting review</h3>
          <p className="text-gray-500">
            AI-generated blogs from n8n will appear here when they are created.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {serializedBlogs.map((blog: any) => (
            <Suspense key={blog._id} fallback={<div>Loading...</div>}>
              <AIReviewCard blog={blog} />
            </Suspense>
          ))}
        </div>
      )}
    </div>
  );
}
