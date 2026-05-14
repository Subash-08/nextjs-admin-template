import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAllBlogCategories } from '@/services/blogCategoryService';
import CategoryList from '@/components/admin/blog/CategoryList';
import CreateCategoryForm from '@/components/admin/blog/CreateCategoryForm';

export const metadata = {
  title: 'Blog Categories | Admin',
};

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    redirect('/login');
  }

  const categories = await getAllBlogCategories();
  const serializedCategories = JSON.parse(JSON.stringify(categories));

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Blog Categories</h1>
        <p className="text-gray-500 mt-1">Manage categories for your blog posts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
            <CategoryList categories={serializedCategories} />
          </Suspense>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Category</h2>
          <CreateCategoryForm />
        </div>
      </div>
    </div>
  );
}
