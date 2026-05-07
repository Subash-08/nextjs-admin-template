'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AddBoxButtonProps {
    currentCount: number;
    onAdded: (box: any) => void;
}

export default function AddBoxButton({ currentCount, onAdded }: AddBoxButtonProps) {
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = async () => {
        if (isAdding) return;

        try {
            setIsAdding(true);
            const res = await fetch('/api/portfolio-layout/add', {
                method: 'POST',
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to add box');
            }

            onAdded(data.box);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <button
            onClick={handleAdd}
            disabled={isAdding || currentCount >= 50}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
        >
            {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Plus className="w-4 h-4" />
            )}
            Add Box
        </button>
    );
}
