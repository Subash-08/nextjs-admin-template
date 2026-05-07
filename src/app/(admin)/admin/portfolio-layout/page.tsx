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
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-500">
                <p>{error}</p>
                <button
                    onClick={fetchLayout}
                    className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Portfolio Layout</h1>
                    <p className="text-gray-500 mt-1">
                        Configure the grid layout for the "All" works tab.
                    </p>
                </div>
                <div className="flex gap-3">
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
