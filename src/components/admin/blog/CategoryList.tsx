'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import type { IBlogCategory } from '@/types/blog';
import { deleteBlogCategoryAction } from '@/actions/blogCategory.actions';

interface Props {
  categories: IBlogCategory[];
}

export default function CategoryList({ categories }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string, blogCount: number) => {
    if (blogCount > 0) {
      alert(`Cannot delete "${name}" - it has ${blogCount} blog(s)`);
      return;
    }

    if (!confirm(`Delete category "${name}"?`)) return;

    setDeleting(id);
    const result = await deleteBlogCategoryAction(id);
    setDeleting(null);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  if (categories.length === 0) {
    return <div className="p-8 text-center text-gray-500">No categories found</div>;
  }

  return (
    <ul className="divide-y divide-gray-200">
      {categories.map((category) => (
        <li key={String(category._id)} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
          <div>
            <h3 className="font-medium text-gray-900">{category.name}</h3>
            <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <span>Slug: {category.slug}</span>
              <span>•</span>
              <span className={category.blogCount > 0 ? 'text-blue-600 font-medium' : ''}>
                {category.blogCount} blog(s)
              </span>
            </div>
          </div>

          <button
            onClick={() => handleDelete(String(category._id), category.name, category.blogCount)}
            disabled={deleting === String(category._id) || category.blogCount > 0}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title={category.blogCount > 0 ? 'Cannot delete category with blogs' : 'Delete category'}
          >
            <Trash2 size={18} />
          </button>
        </li>
      ))}
    </ul>
  );
}
