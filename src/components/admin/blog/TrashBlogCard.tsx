'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { RotateCcw, Trash2 } from 'lucide-react';
import type { IBlog } from '@/types/blog';
import { restoreBlogFromTrashAction, deleteBlogPermanentlyAction } from '@/actions/blog.actions';

interface Props {
  blog: IBlog;
}

export default function TrashBlogCard({ blog }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRestore = async () => {
    if (!confirm('Restore this blog?')) return;

    setLoading(true);
    const result = await restoreBlogFromTrashAction(String(blog._id));
    setLoading(false);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Permanently delete this blog? This action cannot be undone!')) return;

    setLoading(true);
    const result = await deleteBlogPermanentlyAction(String(blog._id));
    setLoading(false);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{blog.title}</h3>
        <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-2">
          <span>Category: {blog.category?.name || 'Unknown'}</span>
          <span>•</span>
          <span>
            Deleted{' '}
            {blog.workflow?.trashedAt
              ? formatDistanceToNow(new Date(blog.workflow.trashedAt), { addSuffix: true })
              : 'recently'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={handleRestore}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm disabled:opacity-50"
        >
          <RotateCcw size={16} />
          Restore
        </button>

        <button
          onClick={handleDelete}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm disabled:opacity-50"
        >
          <Trash2 size={16} />
          Delete Forever
        </button>
      </div>
    </div>
  );
}
