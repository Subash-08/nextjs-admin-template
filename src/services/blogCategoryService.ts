import dbConnect from '@/lib/db';
import BlogCategory, { IBlogCategory } from '@/models/BlogCategory';
import { generateUniqueSlug } from '@/lib/blog/slugify';

interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
}

export async function createBlogCategory(input: CreateCategoryInput): Promise<IBlogCategory> {
  await dbConnect();

  const slug = input.slug || await generateUniqueSlug(input.name, BlogCategory);

  const category = await BlogCategory.create({
    name: input.name,
    slug,
    description: input.description,
    blogCount: 0,
  });

  return category;
}

export async function getAllBlogCategories(): Promise<IBlogCategory[]> {
  await dbConnect();

  const data = await BlogCategory.find({})
    .sort({ name: 1 })
    .lean();
    
  return data as unknown as IBlogCategory[];
}

export async function getBlogCategoryBySlug(slug: string): Promise<IBlogCategory | null> {
  await dbConnect();

  const data = await BlogCategory.findOne({ slug }).lean();
  return data as unknown as IBlogCategory;
}

export async function updateBlogCategory(
  id: string,
  input: Partial<CreateCategoryInput>
): Promise<IBlogCategory | null> {
  await dbConnect();

  if (input.slug) {
    input.slug = await generateUniqueSlug(input.slug, BlogCategory, id);
  }

  const data = await BlogCategory.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: true }
  ).lean();
  
  return data as unknown as IBlogCategory;
}

export async function deleteBlogCategory(id: string): Promise<void> {
  await dbConnect();

  const category = await BlogCategory.findById(id);
  if (!category) {
    throw new Error('Category not found');
  }

  if (category.blogCount > 0) {
    throw new Error('Cannot delete category with existing blogs');
  }

  await BlogCategory.findByIdAndDelete(id);
}
