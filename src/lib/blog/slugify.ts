import type { Model } from 'mongoose';

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
}

export async function generateUniqueSlug(
  text: string,
  Model: Model<any>,
  excludeId?: string
): Promise<string> {
  const baseSlug = slugify(text);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query: any = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await Model.findOne(query);
    
    if (!existing) {
      return slug;
    }

    // Try with counter
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
