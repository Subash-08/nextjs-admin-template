import dbConnect from '@/lib/db';
import Blog, { IBlog, IContentBlock } from '@/models/Blog';
import BlogCategory from '@/models/BlogCategory';
import { calculateSEOMetrics } from '@/lib/blog/seoMetrics';
import { generateUniqueSlug } from '@/lib/blog/slugify';
import type { PaginatedResponse, PaginationParams } from '@/types';

export interface CreateBlogInput {
  title: string;
  slug?: string;
  excerpt: string;
  author: string;
  contentBlocks: IContentBlock[];
  featuredImage: {
    url: string;
    publicId: string;
    alt: string;
    width?: number;
    height?: number;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
    secondaryKeywords?: string[];
    structuredDataType?: 'Article' | 'BlogPosting' | 'HowTo' | 'FAQPage';
  };
  categorySlug: string;
  tags?: string[];
  workflow: {
    status: 'draft' | 'published';
    creationType: 'manual' | 'n8n_auto_generated';
    aiMetadata?: {
      generatedBy: string;
      generationDate: Date;
      modelUsed: string;
      qualityScore?: number;
    };
  };
  flags?: {
    isFeatured?: boolean;
    isEvergreen?: boolean;
  };
  createdBy?: string;
}

export interface UpdateBlogInput extends Partial<CreateBlogInput> {
  updatedBy?: string;
}

interface BlogListParams extends Omit<PaginationParams, 'status'> {
  status?: 'draft' | 'published' | 'archived' | 'trash';
  categorySlug?: string;
  creationType?: 'manual' | 'n8n_auto_generated';
  isFeatured?: boolean;
  search?: string;
}

// ============ CREATE ============

export async function createBlog(input: CreateBlogInput): Promise<IBlog> {
  await dbConnect();

  // 1. Generate unique slug if not provided
  const slug = input.slug || await generateUniqueSlug(input.title, Blog);

  // 2. Get or create category
  const rawCategoryName = input.categorySlug.trim();
  const generatedCategorySlug = rawCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'general';
  
  let category = await BlogCategory.findOne({ slug: generatedCategorySlug });
  if (!category) {
    category = await BlogCategory.create({
      name: rawCategoryName.charAt(0).toUpperCase() + rawCategoryName.slice(1) || 'General',
      slug: generatedCategorySlug,
      description: `Articles about ${rawCategoryName}`,
      blogCount: 0,
    });
  }

  // 3. Normalize tags (lowercase, trim, unique)
  const tags = input.tags 
    ? [...new Set(input.tags.map(tag => tag.toLowerCase().trim()))]
    : [];

  // 4. Calculate SEO metrics
  const seoMetrics = calculateSEOMetrics(input.contentBlocks);

  // 5. Set canonical URL
  const canonicalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/blog/${slug}`;

  // 6. Create blog
  const blog = await Blog.create({
    title: input.title,
    slug,
    excerpt: input.excerpt,
    author: input.author,
    contentBlocks: input.contentBlocks,
    featuredImage: input.featuredImage,
    seo: {
      ...input.seo,
      canonicalUrl,
      ogTitle: input.seo.metaTitle,
      ogDescription: input.seo.metaDescription,
      ogImage: input.featuredImage.url,
      twitterTitle: input.seo.metaTitle,
      twitterDescription: input.seo.metaDescription,
      twitterImage: input.featuredImage.url,
    },
    category: {
      id: category._id,
      name: category.name,
      slug: category.slug,
    },
    tags,
    workflow: {
      ...input.workflow,
      publishedAt: input.workflow.status === 'published' ? new Date() : undefined,
      lastModifiedAt: new Date(),
    },
    seoMetrics,
    flags: {
      isFeatured: input.flags?.isFeatured || false,
      isEvergreen: input.flags?.isEvergreen || false,
      needsUpdate: false,
    },
    internalLinks: [],
    externalLinks: [],
    outgoingLinkCount: 0,
    incomingLinkCount: 0,
    notifications: [],
    createdBy: input.createdBy,
  });

  // 7. Update category blog count if published
  if (input.workflow.status === 'published') {
    await BlogCategory.findByIdAndUpdate(category._id, {
      $inc: { blogCount: 1 },
    });
  }

  return blog;
}

// ============ READ ============

export async function getBlogBySlug(slug: string): Promise<IBlog | null> {
  await dbConnect();
  
  const blog = await Blog.findOne({ 
    slug,
    'workflow.status': { $ne: 'trash' } 
  }).lean();
  
  return blog as unknown as IBlog;
}

export async function getBlogById(id: string): Promise<IBlog | null> {
  await dbConnect();
  
  const blog = await Blog.findById(id).lean();
  
  return blog as unknown as IBlog;
}

export async function getBlogs(
  params: BlogListParams = {}
): Promise<PaginatedResponse<IBlog>> {
  await dbConnect();

  const {
    page = 1,
    limit = 12,
    status = 'published',
    categorySlug,
    creationType,
    isFeatured,
    search,
  } = params;

  const skip = (page - 1) * limit;

  // Build query
  const query: any = {
    'workflow.status': status,
  };

  if (categorySlug) {
    query['category.slug'] = categorySlug;
  }

  if (creationType) {
    query['workflow.creationType'] = creationType;
  }

  if (isFeatured !== undefined) {
    query['flags.isFeatured'] = isFeatured;
  }

  if (search) {
    query.$text = { $search: search };
  }

  // Execute query
  const [data, total] = await Promise.all([
    Blog.find(query)
      .sort({ 'workflow.publishedAt': -1 })
      .skip(skip)
      .limit(limit)
      .select('-contentBlocks -internalLinks -externalLinks -notifications') // Exclude heavy fields
      .lean(),
    Blog.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data as unknown as IBlog[],
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
    },
  };
}

export async function getFeaturedBlogs(limit = 6): Promise<IBlog[]> {
  await dbConnect();

  const data = await Blog.find({
    'workflow.status': 'published',
    'flags.isFeatured': true,
  })
    .sort({ 'workflow.publishedAt': -1 })
    .limit(limit)
    .select('title slug excerpt featuredImage category author workflow.publishedAt')
    .lean();
    
  return data as unknown as IBlog[];
}

export async function getRelatedBlogs(blogId: string, categorySlug: string, limit = 3): Promise<IBlog[]> {
  await dbConnect();

  const data = await Blog.find({
    'workflow.status': 'published',
    'category.slug': categorySlug,
    _id: { $ne: blogId },
  })
    .sort({ 'workflow.publishedAt': -1 })
    .limit(limit)
    .select('title slug excerpt featuredImage category')
    .lean();
    
  return data as unknown as IBlog[];
}

// ============ UPDATE ============

export async function updateBlog(id: string, input: UpdateBlogInput): Promise<IBlog | null> {
  await dbConnect();

  const blog = await Blog.findById(id);
  if (!blog) {
    throw new Error('Blog not found');
  }

  // If slug changed, generate new unique slug
  if (input.slug && input.slug !== blog.slug) {
    input.slug = await generateUniqueSlug(input.slug, Blog, id);
  }

  // If category changed, update category reference
  if (input.categorySlug) {
    const rawCategoryName = input.categorySlug.trim();
    const generatedCategorySlug = rawCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'general';

    if (generatedCategorySlug !== blog.category.slug) {
      let category = await BlogCategory.findOne({ slug: generatedCategorySlug });
      if (!category) {
        category = await BlogCategory.create({
          name: rawCategoryName.charAt(0).toUpperCase() + rawCategoryName.slice(1) || 'General',
          slug: generatedCategorySlug,
          description: `Articles about ${rawCategoryName}`,
          blogCount: 0,
        });
      }

      // Update old category count
      await BlogCategory.findByIdAndUpdate(blog.category.id, {
        $inc: { blogCount: -1 },
      });

      // Update new category count
      await BlogCategory.findByIdAndUpdate(category._id, {
        $inc: { blogCount: 1 },
      });

      input.categorySlug = undefined; // Remove from input
      (input as any).category = {
        id: category._id,
        name: category.name,
        slug: category.slug,
      };
    } else {
      input.categorySlug = undefined; // Already matches
    }
  }

  // Normalize tags
  if (input.tags) {
    input.tags = [...new Set(input.tags.map(tag => tag.toLowerCase().trim()))];
  }

  // Recalculate SEO metrics if content changed
  if (input.contentBlocks) {
    (input as any).seoMetrics = calculateSEOMetrics(input.contentBlocks);
  }

  // Update lastModifiedAt
  if (!input.workflow) {
    (input as any).workflow = {};
  }
  (input as any).workflow.lastModifiedAt = new Date();

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: true }
  ).lean();

  return updatedBlog as unknown as IBlog;
}

// ============ DELETE (SOFT) ============

export async function moveBlogToTrash(id: string): Promise<void> {
  await dbConnect();

  const blog = await Blog.findById(id);
  if (!blog) {
    throw new Error('Blog not found');
  }

  // Update status to trash
  await Blog.findByIdAndUpdate(id, {
    $set: {
      'workflow.status': 'trash',
      'workflow.trashedAt': new Date(),
    },
  });

  // Decrement category count if was published
  if (blog.workflow.status === 'published') {
    await BlogCategory.findByIdAndUpdate(blog.category.id, {
      $inc: { blogCount: -1 },
    });
  }
}

export async function restoreBlogFromTrash(id: string): Promise<void> {
  await dbConnect();

  const blog = await Blog.findById(id);
  if (!blog || blog.workflow.status !== 'trash') {
    throw new Error('Blog not in trash');
  }

  await Blog.findByIdAndUpdate(id, {
    $set: {
      'workflow.status': 'draft',
      'workflow.trashedAt': null,
    },
  });
}

export async function deleteBlogPermanently(id: string): Promise<void> {
  await dbConnect();

  const blog = await Blog.findById(id);
  if (!blog) {
    throw new Error('Blog not found');
  }

  // Delete from database
  await Blog.findByIdAndDelete(id);

  // Update category count
  if (blog.workflow.status === 'published') {
    await BlogCategory.findByIdAndUpdate(blog.category.id, {
      $inc: { blogCount: -1 },
    });
  }
}

// ============ PUBLISH/UNPUBLISH ============

export async function publishBlog(id: string): Promise<void> {
  await dbConnect();

  const blog = await Blog.findById(id);
  if (!blog) {
    throw new Error('Blog not found');
  }

  if (blog.workflow.status === 'published') {
    return; // Already published
  }

  await Blog.findByIdAndUpdate(id, {
    $set: {
      'workflow.status': 'published',
      'workflow.publishedAt': new Date(),
      'workflow.lastModifiedAt': new Date(),
    },
  });

  // Increment category count
  await BlogCategory.findByIdAndUpdate(blog.category.id, {
    $inc: { blogCount: 1 },
  });
}

export async function unpublishBlog(id: string): Promise<void> {
  await dbConnect();

  const blog = await Blog.findById(id);
  if (!blog) {
    throw new Error('Blog not found');
  }

  if (blog.workflow.status !== 'published') {
    return; // Not published
  }

  await Blog.findByIdAndUpdate(id, {
    $set: {
      'workflow.status': 'draft',
      'workflow.lastModifiedAt': new Date(),
    },
  });

  // Decrement category count
  await BlogCategory.findByIdAndUpdate(blog.category.id, {
    $inc: { blogCount: -1 },
  });
}

// ============ UTILITY ============

export async function getAllBlogSlugs(): Promise<string[]> {
  await dbConnect();

  const blogs = await Blog.find({
    'workflow.status': 'published',
  })
    .select('slug')
    .lean();

  return blogs.map(blog => blog.slug);
}

export async function checkSlugAvailability(slug: string, excludeId?: string): Promise<boolean> {
  await dbConnect();

  const query: any = { slug };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existing = await Blog.findOne(query);
  return !existing;
}

// ============ LINK SEARCH ============

export async function searchBlogsForLink(
  query: string
): Promise<Array<{ _id: string; title: string; slug: string; category: { name: string } }>> {
  await dbConnect();

  const filter: any = { 'workflow.status': 'published' };

  if (query.trim().length >= 2) {
    filter.$or = [
      { title: { $regex: query, $options: 'i' } },
      { slug: { $regex: query, $options: 'i' } },
      { tags: { $regex: query, $options: 'i' } },
    ];
  }

  const results = await Blog.find(filter)
    .select('title slug category createdAt')
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();

  return results.map((b: any) => ({
    _id: String(b._id),
    title: b.title,
    slug: b.slug,
    category: { name: b.category?.name || 'Uncategorized' },
  }));
}
