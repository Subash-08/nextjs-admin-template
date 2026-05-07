'use client';

import { useState, useEffect } from 'react';
import CategoryTabs from './CategoryTabs';
import WorkGrid from './WorkGrid';
import { IProject } from '@/models/Project';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getProjectsByCategory } from '@/actions/portfolio-public.actions';

interface PortfolioContainerProps {
    categories: any[];
}

export default function PortfolioContainer({ categories }: PortfolioContainerProps) {
    const [activeCategory, setActiveCategory] = useState<string>('all');

    // State for "All" tab (Layout Mode)
    const [layoutProjects, setLayoutProjects] = useState<any[]>([]);
    const [loadingLayout, setLoadingLayout] = useState(false);

    // State for "Category" tab (Paginated Mode)
    const [categoryProjects, setCategoryProjects] = useState<IProject[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(false);

    // Data Isolation: We fetch layout once, and fetch categories on demand?
    // Let's implement active fetching based on tab.

    useEffect(() => {
        if (activeCategory === 'all') {
            fetchLayout();
        } else {
            fetchCategoryProjects(activeCategory);
        }
    }, [activeCategory]);

    const fetchLayout = async () => {
        try {
            setLoadingLayout(true);
            const res = await fetch('/api/portfolio-layout');
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            // Filter and transform to match IProject structure roughly
            // The API returns { boxes: [ { project: { id, title, thumbnail } } ] }
            // We need to map this to something WorkGrid accepts.
            // WorkGrid expects IProject. We need to ensure the sanitized data is sufficient.
            // Or we might need to populate MORE fields in the API if WorkGrid uses tags/descriptions?
            // Checking WorkGrid... it passes `project` to `WorkCard`. 
            // `WorkCard` typically uses: title, coverImage, tags?, slug?
            // Wait, we only populated `title` and `thumbnail` in the API. 
            // We probably need `slug` and `tags` (category) for the card to look good.
            // Let's assume we might need to update the API to return slug/tags.
            // For now, let's map what we have and see.

            const validProjects = data.boxes
                .filter((b: any) => b.project !== null)
                .map((b: any) => ({
                    _id: b.project.id,
                    title: b.project.title,
                    thumbnail: { url: b.project.thumbnail },
                    // Mocking missing fields for now to prevent crash if WorkCard is strictly typed
                    // Ideally we fix the API to return these.
                    slug: b.project.slug || '#', // API needs to return slug
                    category: b.project.category || { name: 'Work' }
                }));

            setLayoutProjects(validProjects);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load portfolio layout');
        } finally {
            setLoadingLayout(false);
        }
    };

    const fetchCategoryProjects = async (categoryId: string) => {
        try {
            setLoadingProjects(true);
            // Dynamic import of the server action to avoid build issues if mixed? 
            // Better: passing the action as a prop or just importing it if "use client" allows.
            // In Next.js App Router, we can import server actions in Client Components.
            // I'll need to update the imports at the top.
            const data = await getProjectsByCategory(categoryId);
            setCategoryProjects(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load category projects");
        } finally {
            setLoadingProjects(false);
        }
    };

    const isLoading = activeCategory === 'all' ? loadingLayout : loadingProjects;
    const projects = activeCategory === 'all' ? layoutProjects : categoryProjects;

    return (
        <div>
            <CategoryTabs
                categories={categories}
                activeCategory={activeCategory}
                onSelect={setActiveCategory}
            />

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                </div>
            ) : projects.length > 0 ? (
                <WorkGrid projects={projects} />
            ) : (
                <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500 text-lg">
                        {activeCategory === 'all'
                            ? 'No projects configured in the portfolio layout.'
                            : 'No projects found in this category.'}
                    </p>
                </div>
            )}
        </div>
    );
}
