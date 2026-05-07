'use client';

import { useState } from 'react';
import { Plus, X, Replace, Loader2, Image as ImageIcon } from 'lucide-react';
import ProjectSelectionModal from './ProjectSelectionModal';
import { toast } from 'react-hot-toast';

interface LayoutBoxCardProps {
    box: any;
    onUpdate: (box: any) => void;
}

export default function LayoutBoxCard({ box, onUpdate }: LayoutBoxCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    const handleClear = async () => {
        if (!confirm('Remove project from this box?')) return;

        try {
            setIsClearing(true);
            const res = await fetch('/api/portfolio-layout/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ boxId: box.id, projectId: null }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            onUpdate(data.box);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsClearing(false);
        }
    };

    const handleSelectProject = async (projectId: string) => {
        try {
            const res = await fetch('/api/portfolio-layout/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ boxId: box.id, projectId }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            onUpdate(data.box);
            setIsModalOpen(false);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full group hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Rank {box.order}
                    </span>
                    {box.project && (
                        <button
                            onClick={handleClear}
                            disabled={isClearing}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                            title="Remove project"
                        >
                            {isClearing ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col items-center justify-center min-h-[160px]">
                    {box.project ? (
                        <div className="w-full text-center space-y-3">
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                                {box.project.thumbnail ? (
                                    <img
                                        src={box.project.thumbnail}
                                        alt={box.project.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <ImageIcon className="w-8 h-8" />
                                    </div>
                                )}
                            </div>
                            <h3 className="font-semibold text-gray-900 line-clamp-1" title={box.project.title}>
                                {box.project.title}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1.5 w-full py-2 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Replace className="w-3 h-3" />
                                Change Project
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-3">
                                <Plus className="w-6 h-6" />
                            </div>
                            <p className="text-sm text-gray-500 font-medium mb-4">Empty Slot</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                Select Project
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <ProjectSelectionModal
                    onClose={() => setIsModalOpen(false)}
                    onSelect={handleSelectProject}
                />
            )}
        </>
    );
}
