'use client';

import { useState, useEffect } from 'react';
import { X, Search, Loader2 } from 'lucide-react';

interface ProjectSelectionModalProps {
    onClose: () => void;
    onSelect: (projectId: string) => void;
}

export default function ProjectSelectionModal({ onClose, onSelect }: ProjectSelectionModalProps) {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/portfolio-layout/available-projects');
                const data = await res.json();
                if (data.projects) {
                    setProjects(data.projects);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const filteredProjects = projects.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Select Project</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search projects by title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-gray-400"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 text-sm">
                            {search ? 'No projects match your search.' : 'No available projects found.'}
                        </div>
                    ) : (
                        filteredProjects.map((project) => (
                            <button
                                key={project.id}
                                onClick={() => onSelect(project.id)}
                                className="w-full text-left p-3 hover:bg-blue-50 rounded-xl flex items-center gap-4 group transition-colors border border-transparent hover:border-blue-100"
                            >
                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                                    {project.thumbnail && (
                                        <img src={project.thumbnail} alt="" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-blue-700">
                                    {project.title}
                                </span>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
