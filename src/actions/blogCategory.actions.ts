'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import * as categoryService from '@/services/blogCategoryService';

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    throw new Error('Unauthorized: Admin role required');
  }

  return session;
}

export async function createBlogCategoryAction(input: {
  name: string;
  description?: string;
}) {
  try {
    await requireAdmin();

    const category = await categoryService.createBlogCategory(input);

    revalidatePath('/admin/blogs/categories');

    // Need to serialize for client component consumption
    return { success: true, data: JSON.parse(JSON.stringify(category)) };
  } catch (error) {
    console.error('[CREATE_CATEGORY_ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create category',
    };
  }
}

export async function deleteBlogCategoryAction(id: string) {
  try {
    await requireAdmin();

    await categoryService.deleteBlogCategory(id);

    revalidatePath('/admin/blogs/categories');
    revalidatePath('/admin/blogs');

    return { success: true };
  } catch (error) {
    console.error('[DELETE_CATEGORY_ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete category',
    };
  }
}
