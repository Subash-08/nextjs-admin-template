'use client';

import type { IContentBlock } from '@/types/blog';

interface Props {
  block: IContentBlock;
  onUpdate: (updates: Partial<IContentBlock>) => void;
}

export default function HeadingBlock({ block, onUpdate }: Props) {
  const level = block.type === 'h2' ? 'H2' : 'H3';

  const handleChange = (value: string) => {
    onUpdate({
      content: value,
      anchorId: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    });
  };

  return (
    <div className="space-y-2 w-full">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{level} Heading</div>
      <input
        type="text"
        value={block.content || ''}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={`Enter ${level} heading...`}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
      {block.anchorId && (
        <div className="text-xs text-gray-400 font-mono">
          Anchor ID: #{block.anchorId}
        </div>
      )}
    </div>
  );
}
