'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import * as blogService from '@/services/blogService';
import type { CreateBlogInput, UpdateBlogInput } from '@/services/blogService';

// ============ AUTHORIZATION ============

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session || !['admin', 'editor'].includes(session.user.role)) {
    throw new Error('Unauthorized: Admin or editor role required');
  }
  
  return session;
}

// ============ CRUD ACTIONS ============

export async function createBlogAction(input: CreateBlogInput) {
  try {
    const session = await requireAdmin();
    
    const blog = await blogService.createBlog({
      ...input,
      createdBy: session.user.id,
    });
    
    revalidatePath('/admin/blogs');
    
    // Parse to avoid maximum call stack size exceeded when serializing mongoose document to client
    const serializedBlog = JSON.parse(JSON.stringify(blog));
    
    return { success: true, data: serializedBlog };
  } catch (error) {
    console.error('[CREATE_BLOG_ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create blog',
    };
  }
}

export async function updateBlogAction(id: string, input: UpdateBlogInput) {
  try {
    const session = await requireAdmin();
    
    const blog = await blogService.updateBlog(id, {
      ...input,
      updatedBy: session.user.id,
    });
    
    revalidatePath('/admin/blogs');
    revalidatePath(`/blog/${blog?.slug}`);
    
    const serializedBlog = blog ? JSON.parse(JSON.stringify(blog)) : null;
    
    return { success: true, data: serializedBlog };
  } catch (error) {
    console.error('[UPDATE_BLOG_ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update blog',
    };
  }
}

export async function publishBlogAction(id: string) {
  try {
    await requireAdmin();
    
    await blogService.publishBlog(id);
    
    revalidatePath('/admin/blogs');
    revalidatePath('/blog');
    
    return { success: true };
  } catch (error) {
    console.error('[PUBLISH_BLOG_ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to publish blog',
    };
  }
}

export async function unpublishBlogAction(id: string) {
  try {
    await requireAdmin();
    
    await blogService.unpublishBlog(id);
    
    revalidatePath('/admin/blogs');
    revalidatePath('/blog');
    
    return { success: true };
  } catch (error) {
    console.error('[UNPUBLISH_BLOG_ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to unpublish blog',
    };
  }
}

export async function moveBlogToTrashAction(id: string) {
  try {
    await requireAdmin();
    
    await blogService.moveBlogToTrash(id);
    
    revalidatePath('/admin/blogs');
    revalidatePath('/blog');
    
    return { success: true };
  } catch (error) {
    console.error('[TRASH_BLOG_ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to move blog to trash',
    };
  }
}

export async function restoreBlogFromTrashAction(id: string) {
  try {
    await requireAdmin();
    
    await blogService.restoreBlogFromTrash(id);
    
    revalidatePath('/admin/blogs');
    
    return { success: true };
  } catch (error) {
    console.error('[RESTORE_BLOG_ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to restore blog',
    };
  }
}

export async function deleteBlogPermanentlyAction(id: string) {
  try {
    const session = await requireAdmin();
    
    if (session.user.role !== 'admin') {
      throw new Error('Only admins can permanently delete blogs');
    }
    
    await blogService.deleteBlogPermanently(id);
    
    revalidatePath('/admin/blogs');
    
    return { success: true };
  } catch (error) {
    console.error('[DELETE_BLOG_ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete blog',
    };
  }
}

// ============ INTERNAL LINK SEARCH ============

export async function searchBlogsForLinkAction(query: string) {
  try {
    await requireAdmin();

    if (!query || query.trim().length < 2) {
      return { success: true, data: [] };
    }

    const results = await blogService.searchBlogsForLink(query.trim());
    return { success: true, data: JSON.parse(JSON.stringify(results)) };
  } catch (error) {
    console.error('[SEARCH_BLOGS_ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Search failed',
      data: [],
    };
  }
}

export async function getRecentPublishedBlogsAction() {
  try {
    await requireAdmin();
    const results = await blogService.searchBlogsForLink('');
    return { success: true, data: JSON.parse(JSON.stringify(results)) };
  } catch (error) {
    return { success: false, data: [] };
  }
}

// ============ LINK MANAGEMENT ============

export async function updateBlogLinksAction(
  blogId: string,
  links: {
    internalLinks?: Array<{
      linkId: string;
      targetType: 'blog' | 'project' | 'service' | 'static';
      targetSlug: string;
      targetTitle: string;
      anchorText: string;
      blockId?: string;
    }>;
    externalLinks?: Array<{
      url: string;
      anchorText: string;
      blockId?: string;
      isNofollow: boolean;
    }>;
  }
) {
  try {
    await requireAdmin();

    const updatePayload: Record<string, any> = {};

    if (links.internalLinks !== undefined) {
      updatePayload.internalLinks = links.internalLinks.map((l) => ({
        ...l,
        isActive: true,
        lastChecked: new Date(),
        createdAt: new Date(),
      }));
      updatePayload.outgoingLinkCount =
        (links.internalLinks?.length || 0) + (links.externalLinks?.length || 0);
    }

    if (links.externalLinks !== undefined) {
      updatePayload.externalLinks = links.externalLinks.map((l) => ({
        ...l,
        isWorking: true,
        lastChecked: new Date(),
      }));
    }

    const blog = await blogService.updateBlog(blogId, updatePayload);

    revalidatePath('/admin/blogs');
    revalidatePath(`/blog/${blog?.slug}`);

    return { success: true };
  } catch (error) {
    console.error('[UPDATE_LINKS_ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update links',
    };
  }
}


// ============ LINK SUGGESTIONS ============

export async function generateLinkSuggestionsAction(
  blogId: string,
  contentBlocks: any[],
  currentSlug?: string
) {
  try {
    await requireAdmin();
    const { generateInternalLinkSuggestions } = await import('@/lib/blog/internalLinkSuggestions');
    const suggestions = await generateInternalLinkSuggestions(blogId, contentBlocks, currentSlug);
    return { success: true, data: JSON.parse(JSON.stringify(suggestions)) };
  } catch (error) {
    console.error('[LINK_SUGGESTIONS_ERROR]', error);
    return { success: false, data: [] };
  }
}
