'use client';

import type { IContentBlock } from '@/types/blog';

interface Props {
  block: IContentBlock;
  onUpdate: (updates: Partial<IContentBlock>) => void;
}

export default function FAQBlock({ block, onUpdate }: Props) {
  return (
    <div className="space-y-3 w-full">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">FAQ</div>
      <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
        <input
          type="text"
          value={block.question || ''}
          onChange={(e) => onUpdate({ question: e.target.value })}
          placeholder="Question"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:border-blue-500"
        />
        <textarea
          value={block.answer || ''}
          onChange={(e) => onUpdate({ answer: e.target.value })}
          placeholder="Answer"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[80px] focus:outline-none focus:border-blue-500 resize-y"
        />
      </div>
    </div>
  );
}
