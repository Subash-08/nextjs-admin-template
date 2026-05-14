'use client';

import type { IContentBlock } from '@/types/blog';

interface Props {
  block: IContentBlock;
  onUpdate: (updates: Partial<IContentBlock>) => void;
}

export default function QuoteBlock({ block, onUpdate }: Props) {
  return (
    <div className="space-y-2 w-full">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Quote</div>
      <div className="relative">
        <div className="absolute top-4 left-4 text-4xl text-gray-300 font-serif leading-none select-none">"</div>
        <textarea
          value={block.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Enter quote text..."
          className="w-full px-4 pt-10 pb-4 pl-12 bg-gray-50 italic text-gray-700 border border-gray-200 rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-y"
        />
      </div>
    </div>
  );
}
