'use client';

import { useState } from 'react';
import BlockEditor from '../BlockEditor';
import LinkManagerPanel from '../LinkManagerPanel';
import type { IContentBlock } from '@/types/blog';
import { LayoutList, Link } from 'lucide-react';

interface InternalLink {
  linkId: string;
  targetType: 'blog' | 'project' | 'service' | 'static';
  targetSlug: string;
  targetTitle: string;
  anchorText: string;
  blockId?: string;
  isActive: boolean;
}

interface ExternalLink {
  url: string;
  anchorText: string;
  blockId?: string;
  isNofollow: boolean;
  isWorking: boolean;
}

interface Props {
  blocks: IContentBlock[];
  onChange: (blocks: IContentBlock[]) => void;
  onBack: () => void;
  onNext: () => void;
  /** Passed for editing an existing saved blog */
  blogId?: string;
  initialInternalLinks?: InternalLink[];
  initialExternalLinks?: ExternalLink[];
  onLinksChange?: (internal: InternalLink[], external: ExternalLink[]) => void;
}

type EditorTab = 'content' | 'links';

export default function ContentEditorStep({
  blocks,
  onChange,
  onBack,
  onNext,
  blogId,
  initialInternalLinks,
  initialExternalLinks,
  onLinksChange,
}: Props) {
  const [activeTab, setActiveTab] = useState<EditorTab>('content');

  const handleNext = () => {
    if (blocks.length === 0) {
      alert('Please add at least one content block');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900">Content Editor</h2>
        <p className="text-gray-500 text-sm">Build your blog content using blocks. Drag to reorder.</p>
      </div>

      {/* Tab switcher */}
      <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'content'
              ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <LayoutList size={15} />
          Content Blocks
          {blocks.length > 0 && (
            <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
              {blocks.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('links')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'links'
              ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Link size={15} />
          Link Manager
        </button>
      </div>

      {/* Content blocks tab */}
      {activeTab === 'content' && (
        <div className="border border-gray-200 rounded-xl bg-gray-50 p-6 min-h-[500px]">
          <BlockEditor blocks={blocks} onChange={onChange} />
        </div>
      )}

      {/* Links tab */}
      {activeTab === 'links' && (
        <LinkManagerPanel
          blogId={blogId}
          initialInternalLinks={initialInternalLinks}
          initialExternalLinks={initialExternalLinks}
          onLinksChange={(internal, external) => {
            onLinksChange?.(internal, external);
          }}
        />
      )}

      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next: Review & Publish →
        </button>
      </div>
    </div>
  );
}
