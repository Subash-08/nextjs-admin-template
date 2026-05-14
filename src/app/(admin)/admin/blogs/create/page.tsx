'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import BlockEditor from '@/components/admin/blog/BlockEditor';
import { createBlogAction } from '@/actions/blog.actions';
import type { IContentBlock } from '@/types/blog';

export default function CreateBlogPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    author: 'Admin',
    categorySlug: '',
    tags: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
      focusKeyword: '',
    },
    featuredImage: {
      url: '',
      publicId: '',
      alt: '',
    },
  });

  const [blocks, setBlocks] = useState<IContentBlock[]>([]);

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!form.title.trim()) return alert('Title is required');
    if (!form.excerpt.trim()) return alert('Excerpt is required');
    if (!form.categorySlug.trim()) return alert('Category is required');
    if (blocks.length === 0) return alert('Add at least one content block');

    setSaving(true);
    try {
      const result = await createBlogAction({
        title: form.title,
        excerpt: form.excerpt,
        author: form.author,
        categorySlug: form.categorySlug,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        contentBlocks: blocks,
        featuredImage: form.featuredImage.url
          ? form.featuredImage
          : { url: 'https://placeholder.com/800x400', publicId: 'placeholder', alt: form.title },
        seo: {
          metaTitle: form.seo.metaTitle || form.title,
          metaDescription: form.seo.metaDescription || form.excerpt,
          focusKeyword: form.seo.focusKeyword,
        },
        workflow: { status, creationType: 'manual' },
      });

      if (result.success) {
        router.push('/admin/blogs');
        router.refresh();
      } else {
        alert(result.error || 'Failed to save blog');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Blog Post</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manual content creation</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit('draft')}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSubmit('published')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Excerpt */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Enter blog title..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt <span className="text-red-500">*</span></label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))}
                placeholder="Short description shown in blog listings..."
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{form.excerpt.length}/500 characters</p>
            </div>
          </div>

          {/* Block Editor */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <BlockEditor blocks={blocks} onChange={setBlocks} />
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="text-base font-semibold text-gray-900">SEO Settings</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Title</label>
              <input
                type="text"
                value={form.seo.metaTitle}
                onChange={(e) => setForm(f => ({ ...f, seo: { ...f.seo, metaTitle: e.target.value } }))}
                placeholder="Defaults to blog title if empty"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">{form.seo.metaTitle.length}/60 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Description</label>
              <textarea
                value={form.seo.metaDescription}
                onChange={(e) => setForm(f => ({ ...f, seo: { ...f.seo, metaDescription: e.target.value } }))}
                placeholder="Defaults to excerpt if empty"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{form.seo.metaDescription.length}/160 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Focus Keyword</label>
              <input
                type="text"
                value={form.seo.focusKeyword}
                onChange={(e) => setForm(f => ({ ...f, seo: { ...f.seo, focusKeyword: e.target.value } }))}
                placeholder="Primary SEO keyword"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Category & Tags */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Slug <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.categorySlug}
                onChange={(e) => setForm(f => ({ ...f, categorySlug: e.target.value }))}
                placeholder="e.g. web-development"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Author</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm(f => ({ ...f, author: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="tag1, tag2, tag3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">Comma-separated</p>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Featured Image</h3>
            <input
              type="url"
              value={form.featuredImage.url}
              onChange={(e) => setForm(f => ({ ...f, featuredImage: { ...f.featuredImage, url: e.target.value } }))}
              placeholder="Image URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={form.featuredImage.alt}
              onChange={(e) => setForm(f => ({ ...f, featuredImage: { ...f.featuredImage, alt: e.target.value } }))}
              placeholder="Alt text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Block count summary */}
          <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 text-sm text-blue-700">
            <p className="font-medium">{blocks.length} block{blocks.length !== 1 ? 's' : ''} added</p>
            <p className="text-blue-500 mt-1 text-xs">Use the editor on the left to build your content.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
