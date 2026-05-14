'use client';

import { Plus, X } from 'lucide-react';
import type { IContentBlock } from '@/types/blog';

interface Props {
  block: IContentBlock;
  onUpdate: (updates: Partial<IContentBlock>) => void;
}

export default function ListBlock({ block, onUpdate }: Props) {
  const items = block.listItems?.length ? block.listItems : [''];

  const handleUpdateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onUpdate({ listItems: newItems });
  };

  const handleAddItem = () => {
    onUpdate({ listItems: [...items, ''] });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdate({ listItems: newItems.length ? newItems : [''] });
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">List</div>
        <select
          value={block.listType || 'unordered'}
          onChange={(e) => onUpdate({ listType: e.target.value as 'ordered' | 'unordered' })}
          className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 outline-none"
        >
          <option value="unordered">Bullet List</option>
          <option value="ordered">Numbered List</option>
        </select>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="mt-2 text-gray-400 font-medium text-sm w-5 text-right shrink-0">
              {block.listType === 'ordered' ? `${index + 1}.` : '•'}
            </span>
            <input
              type="text"
              value={item}
              onChange={(e) => handleUpdateItem(index, e.target.value)}
              placeholder="List item..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              onClick={() => handleRemoveItem(index)}
              className="p-2 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddItem}
        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium ml-7"
      >
        <Plus size={16} />
        Add Item
      </button>
    </div>
  );
}
