'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DeleteLastBoxButtonProps {
    disabled: boolean;
    onDeleted: (order: number) => void;
}

export default function DeleteLastBoxButton({ disabled, onDeleted }: DeleteLastBoxButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to remove the last box? This action cannot be undone.')) {
            return;
        }

        try {
            setIsDeleting(true);
            const res = await fetch('/api/portfolio-layout/delete-last', {
                method: 'DELETE',
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to delete box');
            }

            onDeleted(data.deletedOrder);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={disabled || isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
        >
            {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Trash2 className="w-4 h-4" />
            )}
            Remove Last
        </button>
    );
}
