'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Edit, AlertCircle, Upload, Eye } from 'lucide-react';
import type { IBlog } from '@/types/blog';
import { publishBlogAction, moveBlogToTrashAction, updateBlogAction } from '@/actions/blog.actions';

interface Props {
  blog: IBlog;
}

export default function AIReviewCard({ blog }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleApprove = async () => {
    if (!blog.featuredImage?.url) {
      alert('Please upload a featured image first');
      return;
    }

    if (!confirm('Publish this AI-generated blog?')) return;

    setLoading(true);
    const result = await publishBlogAction(String(blog._id));
    setLoading(false);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const handleReject = async () => {
    if (!confirm('Move this blog to trash?')) return;

    setLoading(true);
    const result = await moveBlogToTrashAction(String(blog._id));
    setLoading(false);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const objectUrl = URL.createObjectURL(file);

      const updateResult = await updateBlogAction(String(blog._id), {
        featuredImage: {
          url: objectUrl,
          publicId: file.name,
          alt: blog.title,
          width: 800,
          height: 600,
        },
      });

      if (updateResult.success) {
        router.refresh();
      } else {
        alert('Failed to update image');
      }
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const qualityScore = blog.workflow?.aiMetadata?.qualityScore || 0;
  const scoreColor =
    qualityScore >= 90
      ? 'text-green-600 bg-green-50'
      : qualityScore >= 70
      ? 'text-yellow-600 bg-yellow-50'
      : 'text-red-600 bg-red-50';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col md:flex-row">
      <div className="p-6 flex-1 space-y-4">
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">{blog.title}</h3>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${scoreColor}`}>
              Score: {qualityScore}/100
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span>Category: {blog.category?.name || 'Uncategorized'}</span>
            <span>•</span>
            <span>Generated: {format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
            <span>•</span>
            <span>{blog.seoMetrics?.wordCount || 0} words</span>
            <span>•</span>
            <span>{blog.seoMetrics?.readingTime || 0} min read</span>
          </div>
        </div>

        {/* Notifications/Warnings */}
        {blog.notifications && blog.notifications.filter((n) => !n.isResolved).length > 0 && (
          <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm flex flex-col gap-2">
            {blog.notifications
              .filter((n) => !n.isResolved)
              .map((notif, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{notif.message}</span>
                </div>
              ))}
          </div>
        )}

        {/* Featured Image Upload */}
        {!blog.featuredImage?.url ? (
          <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <label className="flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-blue-600 transition-colors">
              <Upload size={20} className="mb-2" />
              <span className="text-sm font-medium">
                {uploadingImage ? 'Uploading...' : 'Upload Featured Image (Required)'}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
            </label>
          </div>
        ) : (
          <div className="mt-4 text-sm text-green-600 flex items-center gap-2">
            <CheckCircle size={16} />
            Featured image uploaded
          </div>
        )}
      </div>

      {/* Actions Sidebar */}
      <div className="bg-gray-50 p-6 md:w-64 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col gap-3 justify-center">
        <Link
          href={`/admin/blogs/${String(blog._id)}`}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
        >
          <Edit size={16} />
          Edit Content
        </Link>

        <button
          onClick={handleApprove}
          disabled={loading || !blog.featuredImage?.url}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle size={16} />
          Approve & Publish
        </button>

        <button
          onClick={handleReject}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm disabled:opacity-50"
        >
          <XCircle size={16} />
          Reject (Trash)
        </button>
      </div>
    </div>
  );
}
