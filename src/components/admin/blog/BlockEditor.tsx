'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, Code2 } from 'lucide-react';
import type { IContentBlock } from '@/types/blog';
import BlockItem from './BlockItem';
import AddBlockMenu from './AddBlockMenu';
import HtmlImportModal from './HtmlImportModal';

interface BlockEditorProps {
  blocks: IContentBlock[];
  onChange: (blocks: IContentBlock[]) => void;
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showHtmlImport, setShowHtmlImport] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);

      const reordered = arrayMove(blocks, oldIndex, newIndex).map((block, index) => ({
        ...block,
        order: index,
      }));

      onChange(reordered);
    }
  };

  const handleAddBlock = (type: IContentBlock['type']) => {
    const newBlock: IContentBlock = {
      id: uuidv4(),
      type,
      order: blocks.length,
    };

    onChange([...blocks, newBlock]);
    setShowAddMenu(false);
  };

  const handleUpdateBlock = (id: string, updates: Partial<IContentBlock>) => {
    onChange(blocks.map((block) => (block.id === id ? { ...block, ...updates } : block)));
  };

  const handleDeleteBlock = (id: string) => {
    onChange(blocks.filter((block) => block.id !== id).map((block, index) => ({
      ...block,
      order: index,
    })));
  };

  const handleImportBlocks = (newBlocks: IContentBlock[]) => {
    // Append imported blocks after existing ones, re-index orders
    const merged = [...blocks, ...newBlocks].map((block, index) => ({
      ...block,
      order: index,
    }));
    onChange(merged);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Content Blocks</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHtmlImport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-700 border border-violet-200 rounded-lg hover:bg-violet-100 transition-colors text-sm font-medium"
          >
            <Code2 size={16} />
            Import HTML
          </button>
          <button
            onClick={() => setShowAddMenu(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Add Block
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {blocks.map((block) => (
              <BlockItem
                key={block.id}
                block={block}
                onUpdate={handleUpdateBlock}
                onDelete={handleDeleteBlock}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {blocks.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 mb-4">No content blocks yet</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setShowHtmlImport(true)}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 inline-flex items-center gap-2 text-sm font-medium"
            >
              <Code2 size={16} />
              Import from HTML
            </button>
            <button
              onClick={() => setShowAddMenu(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Add Your First Block
            </button>
          </div>
        </div>
      )}

      {showAddMenu && (
        <AddBlockMenu onSelect={handleAddBlock} onClose={() => setShowAddMenu(false)} />
      )}

      {showHtmlImport && (
        <HtmlImportModal
          onImport={handleImportBlocks}
          onClose={() => setShowHtmlImport(false)}
        />
      )}
    </div>
  );
}


