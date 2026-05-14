import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { getBlogById } from '@/services/blogService';
import { getAllBlogCategories } from '@/services/blogCategoryService';
import BlogCreateForm from '@/components/admin/blog/BlogCreateForm';

export const metadata = {
  title: 'Edit Blog | Admin',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !['admin', 'editor'].includes(session.user.role)) {
    redirect('/login');
  }

  const { id } = await params;
  const [blog, categories] = await Promise.all([
    getBlogById(id),
    getAllBlogCategories()
  ]);

  if (!blog) {
    notFound();
  }

  // Parse to plain object for Client Component
  const serializedBlog = JSON.parse(JSON.stringify(blog));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
        <p className="text-gray-500 mt-1">
          Update the content, SEO, and settings for this post
        </p>
      </div>

      <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading form...</div>}>
        <BlogCreateForm 
          categories={JSON.parse(JSON.stringify(categories))} 
          userId={session.user.id} 
          initialData={serializedBlog} 
        />
      </Suspense>
    </div>
  );
}
