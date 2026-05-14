import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getBlogs } from '@/services/blogService';
import Blog from '@/models/Blog';
import dbConnect from '@/lib/db';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import BlogListTable from '@/components/admin/blog/BlogListTable';
import BlogStats from '@/components/admin/blog/BlogStats';

export const metadata = {
  title: 'Blog Management | Admin',
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    category?: string;
    type?: string;
    search?: string;
  }>;
}

async function getBlogStats() {
  await dbConnect();
  
  const [published, drafts, aiPending, trash] = await Promise.all([
    Blog.countDocuments({ 'workflow.status': 'published' }),
    Blog.countDocuments({ 'workflow.status': 'draft', 'workflow.creationType': 'manual' }),
    Blog.countDocuments({ 'workflow.status': 'draft', 'workflow.creationType': 'n8n_auto_generated' }),
    Blog.countDocuments({ 'workflow.status': 'trash' }),
  ]);
  
  return { published, drafts, aiPending, trash };
}

export default async function AdminBlogsPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session || !['admin', 'editor'].includes(session.user.role)) {
    redirect('/login');
  }

  const resolvedSearchParams = await searchParams;

  const page = Number(resolvedSearchParams.page) || 1;
  const status = (resolvedSearchParams.status as any) || 'published';
  const categorySlug = resolvedSearchParams.category;
  const creationType = resolvedSearchParams.type as any;
  const search = resolvedSearchParams.search;

  const [stats, blogsData] = await Promise.all([
    getBlogStats(),
    getBlogs({
      page,
      limit: 20,
      status,
      categorySlug,
      creationType,
      search,
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your blog posts and AI-generated content
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {stats.aiPending > 0 && (
            <Link 
              href="/admin/blogs?status=draft&type=n8n_auto_generated"
              className="px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-sm font-medium transition-colors flex-1 sm:flex-none text-center"
            >
              Review AI Blogs ({stats.aiPending})
            </Link>
          )}
          <Link
            href="/admin/blogs/create"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex-1 sm:flex-none"
          >
            <Plus size={18} />
            Create Manual Blog
          </Link>
        </div>
      </div>

      {/* Stats */}
      <BlogStats stats={stats} />

      {/* Blog List */}
      <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading blogs...</div>}>
        <BlogListTable 
          blogs={JSON.parse(JSON.stringify(blogsData.data))} 
          pagination={blogsData.pagination}
          currentFilters={{
            status: resolvedSearchParams.status,
            category: resolvedSearchParams.category,
            type: resolvedSearchParams.type,
            search: resolvedSearchParams.search
          }}
        />
      </Suspense>
    </div>
  );
}
