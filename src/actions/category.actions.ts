'use server';

import { getCategories, createCategory, updateCategory, deleteCategory, getCategoryById } from '@/services/category.service';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function fetchCategories() {
    return await getCategories();
}

export async function fetchCategoryById(id: string) {
    return await getCategoryById(id);
}

export async function addCategory(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string; // Ideally generate from name if empty
    const parentId = formData.get('parentId') as string;
    const status = formData.get('status') as string;

    try {
        await createCategory({
            name,
            slug: slug || name.toLowerCase().replace(/ /g, '-'),
            parentId: parentId && parentId !== 'none' ? parentId : undefined, // Handle 'none' or empty
            status: status as 'active' | 'inactive',
        } as any);
    } catch (e: any) {
        if (e.code === 11000) {
            return { message: 'Category with this slug already exists' };
        }
        return { message: 'Failed to create category' };
    }

    revalidatePath('/admin/categories');
    redirect('/admin/categories');
}

export async function editCategory(id: string, prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const parentId = formData.get('parentId') as string;
    const status = formData.get('status') as string;

    try {
        await updateCategory(id, {
            name,
            slug: slug || name.toLowerCase().replace(/ /g, '-'),
            parentId: parentId && parentId !== 'none' ? parentId : undefined,
            status: status as 'active' | 'inactive',
        } as any);
    } catch (e: any) {
        if (e.code === 11000) {
            return { message: 'Category with this slug already exists' };
        }
        return { message: 'Failed to update category' };
    }

    revalidatePath('/admin/categories');
    redirect('/admin/categories');
}

export async function removeCategory(id: string) {
    await deleteCategory(id);
    revalidatePath('/admin/categories');
}
