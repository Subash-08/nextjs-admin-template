import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAllBlogCategories } from '@/services/blogCategoryService';
import BlogCreateForm from '@/components/admin/blog/BlogCreateForm';

export const metadata = {
  title: 'Create New Blog | Admin',
};

export default async function CreateBlogPage() {
  const session = await getServerSession(authOptions);

  if (!session || !['admin', 'editor'].includes(session.user.role)) {
    redirect('/login');
  }

  const categories = await getAllBlogCategories();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Blog Post</h1>
        <p className="text-gray-500 mt-1">
          Follow the steps below to create and publish a new blog post
        </p>
      </div>

      <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading form...</div>}>
        <BlogCreateForm categories={JSON.parse(JSON.stringify(categories))} userId={session.user.id} />
      </Suspense>
    </div>
  );
}
