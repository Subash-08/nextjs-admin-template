'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { IBlogCategory } from '@/types/blog';
import { createBlogAction, updateBlogAction } from '@/actions/blog.actions';
import BasicInfoStep from './create-steps/BasicInfoStep';
import ContentEditorStep from './create-steps/ContentEditorStep';
import ReviewPublishStep from './create-steps/ReviewPublishStep';

interface Props {
  categories: IBlogCategory[];
  userId: string;
  initialData?: any; // For edit mode
}

type Step = 'basic' | 'content' | 'review';

export default function BlogCreateForm({ categories, userId, initialData }: Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    author: initialData?.author || 'Your Name',
    excerpt: initialData?.excerpt || '',
    categorySlug: initialData?.category?.slug || '',
    tags: initialData?.tags || [],

    // Featured Image
    featuredImage: initialData?.featuredImage || {
      url: '',
      publicId: '',
      alt: '',
      width: 0,
      height: 0,
    },

    // SEO
    seo: {
      metaTitle: initialData?.seo?.metaTitle || '',
      metaDescription: initialData?.seo?.metaDescription || '',
      focusKeyword: initialData?.seo?.focusKeyword || '',
      secondaryKeywords: initialData?.seo?.secondaryKeywords || [],
      structuredDataType: initialData?.seo?.structuredDataType || 'BlogPosting',
    },

    // Content
    contentBlocks: initialData?.contentBlocks || [],

    // Workflow
    workflow: {
      status: 'draft' as const,
      creationType: 'manual' as const,
    },

    // Flags
    flags: {
      isFeatured: initialData?.flags?.isFeatured || false,
      isEvergreen: initialData?.flags?.isEvergreen || false,
    },
  });

  // Tracked links (managed separately in LinkManagerPanel)
  const [internalLinks, setInternalLinks] = useState<any[]>(initialData?.internalLinks || []);
  const [externalLinks, setExternalLinks] = useState<any[]>(initialData?.externalLinks || []);

  const handleLinksChange = useCallback((internal: any[], external: any[]) => {
    setInternalLinks(internal);
    setExternalLinks(external);
  }, []);

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSaveDraft = async () => {
    setSaving(true);

    try {
      let result;
      const payload = {
        ...formData,
        workflow: { ...formData.workflow, status: 'draft' as const },
        internalLinks,
        externalLinks,
      };
      if (initialData?._id) {
        result = await updateBlogAction(initialData._id, { ...payload, updatedBy: userId });
      } else {
        result = await createBlogAction({ ...payload, createdBy: userId });
      }

      if (result.success) {
        alert('Draft saved successfully!');
        router.push('/admin/blogs');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!formData.title) return alert('Title is required');
    if (!formData.excerpt) return alert('Excerpt is required');
    if (!formData.categorySlug) return alert('Category is required');
    if (!formData.featuredImage.url) return alert('Featured image is required');
    if (formData.contentBlocks.length === 0) return alert('Content is required');

    setSaving(true);

    try {
      let result;
      const payload = {
        ...formData,
        workflow: { ...formData.workflow, status: 'published' as const },
        internalLinks,
        externalLinks,
      };
      if (initialData?._id) {
        result = await updateBlogAction(initialData._id, { ...payload, updatedBy: userId });
      } else {
        result = await createBlogAction({ ...payload, createdBy: userId });
      }

      if (result.success) {
        alert('Blog published successfully!');
        router.push('/admin/blogs');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Failed to publish blog');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-6">
          <StepIndicator
            number={1}
            title="Basic Info"
            active={currentStep === 'basic'}
            completed={currentStep !== 'basic'}
          />
          <div className="h-px w-8 bg-gray-200 hidden sm:block"></div>
          <StepIndicator
            number={2}
            title="Content"
            active={currentStep === 'content'}
            completed={currentStep === 'review'}
          />
          <div className="h-px w-8 bg-gray-200 hidden sm:block"></div>
          <StepIndicator
            number={3}
            title="Review & Publish"
            active={currentStep === 'review'}
            completed={false}
          />
        </div>

        <button
          onClick={handleSaveDraft}
          disabled={saving}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
        >
          Save Draft
        </button>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {currentStep === 'basic' && (
          <BasicInfoStep
            data={formData}
            categories={categories}
            onChange={updateFormData}
            onNext={() => setCurrentStep('content')}
          />
        )}

        {currentStep === 'content' && (
          <ContentEditorStep
            blocks={formData.contentBlocks}
            onChange={(blocks) => updateFormData({ contentBlocks: blocks })}
            onBack={() => setCurrentStep('basic')}
            onNext={() => setCurrentStep('review')}
            blogId={initialData?._id}
            initialInternalLinks={internalLinks}
            initialExternalLinks={externalLinks}
            onLinksChange={handleLinksChange}
          />
        )}

        {currentStep === 'review' && (
          <ReviewPublishStep
            data={formData}
            onBack={() => setCurrentStep('content')}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
            saving={saving}
          />
        )}
      </div>
    </div>
  );
}

function StepIndicator({
  number,
  title,
  active,
  completed,
}: {
  number: number;
  title: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 ${active ? 'opacity-100' : 'opacity-50'}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          completed || active
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-500 border border-gray-200'
        }`}
      >
        {completed ? '✓' : number}
      </div>
      <span className={`text-sm font-medium hidden sm:block ${active || completed ? 'text-gray-900' : 'text-gray-500'}`}>
        {title}
      </span>
    </div>
  );
}
