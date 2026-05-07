'use client';

import LayoutBoxCard from './LayoutBoxCard';

interface LayoutBoxListProps {
    boxes: any[];
    onUpdate: (box: any) => void;
}

export default function LayoutBoxList({ boxes, onUpdate }: LayoutBoxListProps) {
    if (boxes.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">No layout boxes configured.</p>
                <p className="text-sm text-gray-400 mt-1">Click "Add Box" to start building your grid.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {boxes.map((box) => (
                <LayoutBoxCard
                    key={box.id}
                    box={box}
                    onUpdate={onUpdate}
                />
            ))}
        </div>
    );
}
