import dbConnect from '@/lib/db';
import BlogCategory from '@/models/BlogCategory';

const categories = [
  { name: 'Web Development', slug: 'web-development', description: 'Web development tutorials and guides' },
  { name: 'SEO & Marketing', slug: 'seo-marketing', description: 'SEO and digital marketing strategies' },
  { name: 'Design & UX', slug: 'design-ux', description: 'UI/UX design principles and best practices' },
  { name: 'Technology', slug: 'technology', description: 'Latest technology trends and news' },
  { name: 'Business & Strategy', slug: 'business-strategy', description: 'Business insights and strategies' },
  { name: 'Tutorials & Guides', slug: 'tutorials-guides', description: 'Step-by-step tutorials and how-to guides' },
];

async function seedCategories() {
  try {
    await dbConnect();
    
    console.log('🌱 Seeding blog categories...');
    
    for (const category of categories) {
      await BlogCategory.findOneAndUpdate(
        { slug: category.slug },
        category,
        { upsert: true, new: true }
      );
    }
    
    console.log('✅ Blog categories seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
