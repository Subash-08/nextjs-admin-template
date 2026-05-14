'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import type { IContentBlock } from '@/types/blog';
import ParagraphBlock from './blocks/ParagraphBlock';
import HeadingBlock from './blocks/HeadingBlock';
import ListBlock from './blocks/ListBlock';
import ImageBlock from './blocks/ImageBlock';
import CodeBlock from './blocks/CodeBlock';
import QuoteBlock from './blocks/QuoteBlock';
import FAQBlock from './blocks/FAQBlock';

interface BlockItemProps {
  block: IContentBlock;
  onUpdate: (id: string, updates: Partial<IContentBlock>) => void;
  onDelete: (id: string) => void;
}

export default function BlockItem({ block, onUpdate, onDelete }: BlockItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderBlock = () => {
    const commonProps = {
      block,
      onUpdate: (updates: Partial<IContentBlock>) => onUpdate(block.id, updates),
    };

    switch (block.type) {
      case 'h2':
      case 'h3':
        return <HeadingBlock {...commonProps} />;
      case 'paragraph':
        return <ParagraphBlock {...commonProps} />;
      case 'list':
        return <ListBlock {...commonProps} />;
      case 'image':
        return <ImageBlock {...commonProps} />;
      case 'code':
        return <CodeBlock {...commonProps} />;
      case 'quote':
        return <QuoteBlock {...commonProps} />;
      case 'faq':
        return <FAQBlock {...commonProps} />;
      case 'video':
        return <div className="p-4 bg-gray-50 border rounded text-gray-500 text-sm">Video block not implemented yet</div>;
      case 'spacer':
        return <div className="p-4 bg-gray-50 border rounded text-gray-500 text-sm">Spacer block not implemented yet</div>;
      case 'cta':
        return <div className="p-4 bg-gray-50 border rounded text-gray-500 text-sm">CTA block not implemented yet</div>;
      default:
        return <div className="text-red-500 text-sm">Unknown block type: {block.type}</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative flex items-start gap-2 p-2 bg-white rounded-xl border border-gray-200 shadow-sm"
    >
      {/* Drag Handle */}
      <button
        type="button"
        className="p-2 mt-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing rounded hover:bg-gray-100"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      {/* Block Content */}
      <div className="flex-1 min-w-0 py-1">
        {renderBlock()}
      </div>

      {/* Delete Button */}
      <button
        type="button"
        onClick={() => onDelete(block.id)}
        className="p-2 mt-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-red-50"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
