'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { slugify } from '@/lib/blog/slugify';
import type { IBlogCategory } from '@/types/blog';

interface Props {
  data: any;
  categories: IBlogCategory[];
  onChange: (updates: any) => void;
  onNext: () => void;
}

export default function BasicInfoStep({ data, categories, onChange, onNext }: Props) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/(^-|-$)/g, '');
    if (!tag) return;
    const existing: string[] = data.tags || [];
    if (!existing.includes(tag)) {
      onChange({ tags: [...existing, tag] });
    }
    setTagInput('');
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && tagInput === '') {
      // Remove last tag on backspace when input is empty
      const existing: string[] = data.tags || [];
      if (existing.length > 0) {
        onChange({ tags: existing.slice(0, -1) });
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange({ tags: (data.tags || []).filter((t: string) => t !== tagToRemove) });
  };

  // Auto-generate slug from title
  useEffect(() => {
    if (data.title && !data.slug) {
      onChange({ slug: slugify(data.title) });
    }
  }, [data.title, data.slug, onChange]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      // In a real app, you would upload to your server/S3/Cloudinary here.
      // For now, we simulate an upload by creating an object URL
      const objectUrl = URL.createObjectURL(file);
      
      onChange({
        featuredImage: {
          url: objectUrl,
          publicId: file.name,
          alt: data.title || 'Blog featured image',
          width: 800,
          height: 600,
        },
      });
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleNext = () => {
    if (!data.title) return alert('Title is required');
    if (!data.excerpt) return alert('Excerpt is required');
    if (!data.categorySlug) return alert('Category is required');
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blog Title *</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Enter blog title..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
            <input
              type="text"
              value={data.slug}
              onChange={(e) => onChange({ slug: slugify(e.target.value) })}
              placeholder="url-friendly-slug"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">URL: /blog/{data.slug || 'your-slug-here'}</p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <input
              type="text"
              value={data.categorySlug}
              onChange={(e) => onChange({ categorySlug: e.target.value })}
              placeholder="Type category (e.g. Logo Design)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">If the category doesn't exist, it will be created automatically.</p>
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
            <input
              type="text"
              value={data.author}
              onChange={(e) => onChange({ author: e.target.value })}
              placeholder="Author name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
            <textarea
              value={data.excerpt}
              onChange={(e) => onChange({ excerpt: e.target.value })}
              placeholder="Brief summary (150-200 characters)..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{data.excerpt.length}/200 characters</p>
          </div>

          {/* Key Takeaways */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key Takeaways (for AI summaries)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Add 3-5 bullet points summarizing the main points
            </p>
            {(data.keyTakeaways || []).map((takeaway: string, index: number) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={takeaway}
                  onChange={(e) => {
                    const updated = [...(data.keyTakeaways || [])];
                    updated[index] = e.target.value;
                    onChange({ keyTakeaways: updated });
                  }}
                  placeholder={`Takeaway ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = (data.keyTakeaways || []).filter((_: any, i: number) => i !== index);
                    onChange({ keyTakeaways: updated });
                  }}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                onChange({
                  keyTakeaways: [...(data.keyTakeaways || []), ''],
                });
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add Takeaway
            </button>
          </div>

          {/* Tags — pill input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <div
              className="flex flex-wrap gap-2 min-h-[44px] w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent cursor-text bg-white transition-all"
              onClick={() => tagInputRef.current?.focus()}
            >
              {(data.tags || []).map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                    className="text-blue-400 hover:text-blue-700 transition-colors leading-none"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                ref={tagInputRef}
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => { if (tagInput.trim()) addTag(tagInput); }}
                placeholder={(data.tags || []).length === 0 ? 'Type a tag and press Enter...' : 'Add another tag...'}
                className="flex-1 min-w-[140px] outline-none bg-transparent text-sm text-gray-700 placeholder:text-gray-400 py-0.5"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Enter</kbd> or <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">,</kbd> to add a tag. Backspace removes the last tag.</p>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
            {data.featuredImage.url ? (
              <div className="relative">
                <img src={data.featuredImage.url} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                <button
                  onClick={() => onChange({ featuredImage: { url: '', publicId: '', alt: '', width: 0, height: 0 } })}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-red-700"
                >
                  &times;
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                <label className="cursor-pointer">
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-700">Click to upload image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
                {uploadingImage && <p className="text-xs text-gray-500 mt-2">Uploading...</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* SEO Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
            <input
              type="text"
              value={data.seo.metaTitle}
              onChange={(e) => onChange({ seo: { ...data.seo, metaTitle: e.target.value } })}
              placeholder="SEO-optimized title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Focus Keyword</label>
            <input
              type="text"
              value={data.seo.focusKeyword}
              onChange={(e) => onChange({ seo: { ...data.seo, focusKeyword: e.target.value } })}
              placeholder="Primary keyword for this post"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea
              value={data.seo.metaDescription}
              onChange={(e) => onChange({ seo: { ...data.seo, metaDescription: e.target.value } })}
              placeholder="SEO-optimized description (150-160 chars)"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={handleNext}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next: Content Editor →
        </button>
      </div>
    </div>
  );
}
