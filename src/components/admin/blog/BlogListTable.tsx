'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import {
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Archive,
  MoreVertical,
} from 'lucide-react';
import type { IBlog } from '@/types';
import {
  publishBlogAction,
  unpublishBlogAction,
  moveBlogToTrashAction,
} from '@/actions/blog.actions';

interface BlogListTableProps {
  blogs: IBlog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  currentFilters: {
    status?: string;
    category?: string;
    type?: string;
    search?: string;
  };
}

export default function BlogListTable({
  blogs,
  pagination,
  currentFilters,
}: BlogListTableProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePublish = async (id: string) => {
    setLoading(id);
    const result = await publishBlogAction(id);
    setLoading(null);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const handleUnpublish = async (id: string) => {
    setLoading(id);
    const result = await unpublishBlogAction(id);
    setLoading(null);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const handleTrash = async (id: string) => {
    if (!confirm('Move this blog to trash?')) return;

    setLoading(id);
    const result = await moveBlogToTrashAction(id);
    setLoading(null);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            value={currentFilters.status || 'published'}
            onChange={(e) => {
              const params = new URLSearchParams();
              params.set('status', e.target.value);
              if (currentFilters.category) params.set('category', currentFilters.category);
              if (currentFilters.type) params.set('type', currentFilters.type);
              router.push(`/admin/blogs?${params.toString()}`);
            }}
          >
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="archived">Archived</option>
            <option value="trash">Trash</option>
          </select>

          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            value={currentFilters.type || 'all'}
            onChange={(e) => {
              const params = new URLSearchParams();
              if (currentFilters.status) params.set('status', currentFilters.status);
              if (e.target.value !== 'all') params.set('type', e.target.value);
              router.push(`/admin/blogs?${params.toString()}`);
            }}
          >
            <option value="all">All Types</option>
            <option value="manual">Manual</option>
            <option value="n8n_auto_generated">AI Generated</option>
          </select>
        </div>

        <div className="w-full sm:w-auto">
          <input
            type="search"
            placeholder="Search blogs..."
            className="px-3 py-2 border border-gray-300 rounded-lg w-full text-sm"
            defaultValue={currentFilters.search || ''}
            onChange={(e) => {
              const params = new URLSearchParams();
              if (currentFilters.status) params.set('status', currentFilters.status);
              if (currentFilters.type) params.set('type', currentFilters.type);
              if (e.target.value) params.set('search', e.target.value);
              router.push(`/admin/blogs?${params.toString()}`);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-medium">Blog</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No blogs found matching your criteria.
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={String(blog._id)} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {blog.featuredImage?.url ? (
                        <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden shrink-0 relative">
                          <Image
                            src={blog.featuredImage.url}
                            alt={blog.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center shrink-0">
                          <span className="text-gray-400 text-xs">No img</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{blog.title}</p>
                        <p className="text-gray-500 text-xs line-clamp-1">/{blog.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {blog.category?.name || 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-md ${blog.workflow?.creationType === 'manual'
                          ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-700/10'
                          : 'bg-purple-50 text-purple-700 ring-1 ring-purple-700/10'
                        }`}
                    >
                      {blog.workflow?.creationType === 'manual' ? 'Manual' : 'AI Generated'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-md ${blog.workflow?.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                          : blog.workflow?.status === 'draft'
                            ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20'
                            : 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20'
                        }`}
                    >
                      {blog.workflow?.status || 'draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                    {blog.workflow?.publishedAt
                      ? format(new Date(blog.workflow.publishedAt), 'MMM d, yyyy')
                      : blog.createdAt ? format(new Date(blog.createdAt), 'MMM d, yyyy') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {blog.workflow?.status === 'published' && (
                        <Link
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="View Live"
                        >
                          <Eye size={16} />
                        </Link>
                      )}

                      <Link
                        href={`/admin/blogs/${String(blog._id)}`}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit Blog"
                      >
                        <Edit size={16} />
                      </Link>

                      {blog.workflow?.status === 'draft' && (
                        <button
                          onClick={() => handlePublish(String(blog._id))}
                          disabled={loading === String(blog._id)}
                          className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors disabled:opacity-50"
                          title="Publish"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}

                      {blog.workflow?.status === 'published' && (
                        <button
                          onClick={() => handleUnpublish(String(blog._id))}
                          disabled={loading === String(blog._id)}
                          className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors disabled:opacity-50"
                          title="Unpublish to Draft"
                        >
                          <XCircle size={16} />
                        </button>
                      )}

                      <button
                        onClick={() => handleTrash(String(blog._id))}
                        disabled={loading === String(blog._id)}
                        className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-50"
                        title="Move to Trash"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-sm">
          <div className="text-gray-500">
            Showing <span className="font-medium text-gray-900">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
            <span className="font-medium text-gray-900">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
            <span className="font-medium text-gray-900">{pagination.total}</span> results
          </div>

          <div className="flex gap-2">
            {pagination.page > 1 && (
              <Link
                href={`/admin/blogs?page=${pagination.page - 1}&status=${currentFilters.status || 'published'}${currentFilters.type ? `&type=${currentFilters.type}` : ''}${currentFilters.search ? `&search=${currentFilters.search}` : ''}`}
                className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-white text-gray-700 font-medium transition-colors"
              >
                Previous
              </Link>
            )}

            {pagination.hasMore && (
              <Link
                href={`/admin/blogs?page=${pagination.page + 1}&status=${currentFilters.status || 'published'}${currentFilters.type ? `&type=${currentFilters.type}` : ''}${currentFilters.search ? `&search=${currentFilters.search}` : ''}`}
                className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-white text-gray-700 font-medium transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
