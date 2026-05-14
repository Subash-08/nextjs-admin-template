'use client';

import { useState, useEffect } from 'react';
import LayoutBoxList from './components/LayoutBoxList';
import AddBoxButton from './components/AddBoxButton';
import DeleteLastBoxButton from './components/DeleteLastBoxButton';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface LayoutBox {
    id: string;
    order: number;
    project: {
        id: string;
        title: string;
        thumbnail: string | null;
    } | null;
}

export default function PortfolioLayoutPage() {
    const [boxes, setBoxes] = useState<LayoutBox[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLayout = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/portfolio-layout', { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch layout');
            const data = await res.json();
            setBoxes(data.boxes);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to load portfolio layout.');
            toast.error('Failed to load layout');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLayout();
    }, []);

    const handleBoxAdded = (newBox: LayoutBox) => {
        setBoxes((prev) => [...prev, newBox]);
        toast.success('Box added successfully');
    };

    const handleBoxDeleted = (deletedOrder: number) => {
        setBoxes((prev) => prev.filter((b) => b.order !== deletedOrder));
        toast.success('Last box removed');
    };

    const handleBoxUpdated = (updatedBox: LayoutBox) => {
        setBoxes((prev) => prev.map((b) => (b.id === updatedBox.id ? updatedBox : b)));
        toast.success('Box updated');
    };

    if (loading && boxes.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[360px] bg-white border border-gray-200 rounded-xl">
                <div className="text-center">
                    <Loader2 className="w-7 h-7 animate-spin text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Loading layout...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[360px] bg-white border border-red-100 rounded-xl text-center px-6">
                <p className="text-sm font-medium text-red-600 mb-3">{error}</p>
                <button
                    onClick={fetchLayout}
                    className="px-4 py-2 text-sm font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Portfolio Layout</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Configure the grid layout for the &ldquo;All&rdquo; works tab. {boxes.length > 0 && `${boxes.length} box${boxes.length !== 1 ? 'es' : ''} configured.`}
                    </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                    <DeleteLastBoxButton
                        disabled={boxes.length === 0}
                        onDeleted={handleBoxDeleted}
                    />
                    <AddBoxButton
                        currentCount={boxes.length}
                        onAdded={handleBoxAdded}
                    />
                </div>
            </div>

            <LayoutBoxList
                boxes={boxes}
                onUpdate={handleBoxUpdated}
            />
        </div>
    );
}
