'use server';

import { getCategories, createCategory, updateCategory, deleteCategory, getCategoryById } from '@/services/category.service';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CategoryCreateSchema, CategoryUpdateSchema } from '@/validations/category.schema';

export async function fetchCategories() {
    return await getCategories();
}

export async function fetchCategoryById(id: string) {
    return await getCategoryById(id);
}

export async function addCategory(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'editor'].includes(session.user.role)) {
        return { message: 'Unauthorized: Admin or editor role required' };
    }

    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const parentId = formData.get('parentId') as string;
    const status = formData.get('status') as string;

    try {
        const validatedData = CategoryCreateSchema.parse({
            name,
            slug: slug || name.toLowerCase().replace(/ /g, '-'),
            parentId: parentId && parentId !== 'none' ? parentId : undefined,
            status: status || 'active',
        });

        await createCategory({
            ...validatedData,
            createdBy: session.user.id
        } as any);
    } catch (e: any) {
        if (e.name === 'ZodError') {
            return { message: 'Validation failed' };
        }
        if (e.code === 11000) {
            return { message: 'Category with this slug already exists' };
        }
        return { message: 'Failed to create category' };
    }

    revalidatePath('/admin/categories');
    redirect('/admin/categories');
}

export async function editCategory(id: string, prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'editor'].includes(session.user.role)) {
        return { message: 'Unauthorized: Admin or editor role required' };
    }

    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const parentId = formData.get('parentId') as string;
    const status = formData.get('status') as string;

    try {
        const validatedData = CategoryUpdateSchema.parse({
            name,
            slug: slug || name.toLowerCase().replace(/ /g, '-'),
            parentId: parentId && parentId !== 'none' ? parentId : undefined,
            status: status || 'active',
        });

        await updateCategory(id, {
            ...validatedData,
            updatedBy: session.user.id
        } as any);
    } catch (e: any) {
        if (e.name === 'ZodError') {
            return { message: 'Validation failed' };
        }
        if (e.code === 11000) {
            return { message: 'Category with this slug already exists' };
        }
        return { message: 'Failed to update category' };
    }

    revalidatePath('/admin/categories');
    redirect('/admin/categories');
}

export async function removeCategory(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
        throw new Error('Unauthorized: Admin role required for deletion');
    }

    await deleteCategory(id);
    revalidatePath('/admin/categories');
}
