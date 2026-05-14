'use client';

import { X } from 'lucide-react';
import type { IContentBlock } from '@/types/blog';

interface Props {
  onSelect: (type: IContentBlock['type']) => void;
  onClose: () => void;
}

export default function AddBlockMenu({ onSelect, onClose }: Props) {
  const options: { type: IContentBlock['type']; label: string }[] = [
    { type: 'h2', label: 'H2 Heading' },
    { type: 'h3', label: 'H3 Heading' },
    { type: 'paragraph', label: 'Paragraph' },
    { type: 'list', label: 'List' },
    { type: 'image', label: 'Image' },
    { type: 'code', label: 'Code Block' },
    { type: 'quote', label: 'Quote' },
    { type: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Add Block</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-2 grid grid-cols-2 gap-1">
          {options.map((opt) => (
            <button
              key={opt.type}
              onClick={() => onSelect(opt.type)}
              className="p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors border border-transparent hover:border-gray-200"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
