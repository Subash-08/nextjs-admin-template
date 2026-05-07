'use client';

interface CategoryTabsProps {
    categories: any[]; // Or specific ICategory type
    activeCategory: string;
    onSelect: (categoryId: string) => void;
}

export default function CategoryTabs({ categories, activeCategory, onSelect }: CategoryTabsProps) {
    return (
        <div className="flex flex-wrap gap-3 mb-12">
            <button
                onClick={() => onSelect('all')}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeCategory === 'all'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
            >
                All Works
            </button>
            {categories.map((category) => (
                <button
                    key={category._id}
                    onClick={() => onSelect(category._id)}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeCategory === category._id
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}
