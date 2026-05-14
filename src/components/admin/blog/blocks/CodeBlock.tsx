'use client';

import type { IContentBlock } from '@/types/blog';

interface Props {
  block: IContentBlock;
  onUpdate: (updates: Partial<IContentBlock>) => void;
}

export default function CodeBlock({ block, onUpdate }: Props) {
  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Code Block</div>
        <input
          type="text"
          value={block.codeLanguage || ''}
          onChange={(e) => onUpdate({ codeLanguage: e.target.value })}
          placeholder="Language (e.g. js)"
          className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-28"
        />
      </div>
      <textarea
        value={block.codeContent || ''}
        onChange={(e) => onUpdate({ codeContent: e.target.value })}
        placeholder="Enter code here..."
        className="w-full px-4 py-3 bg-gray-900 text-gray-100 font-mono text-sm rounded-lg min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
      />
    </div>
  );
}
