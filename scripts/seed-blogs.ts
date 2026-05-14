/**
 * Blog Sample Data Seed Script
 * Run: npx ts-node -P tsconfig.json --skip-project scripts/seed-blogs.ts
 * Or:  npx tsx scripts/seed-blogs.ts
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextjs-admin';

// ── Minimal schemas (avoid importing full Next.js app) ─────────────────────

const BlogCategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  blogCount: { type: Number, default: 0 },
}, { timestamps: true });

const ContentBlockSchema = new mongoose.Schema({
  id: String,
  type: String,
  order: Number,
  content: String,
  listType: String,
  listItems: [String],
  imageUrl: String,
  imageAlt: String,
  imageCaption: String,
  codeContent: String,
  codeLanguage: String,
  anchorId: String,
}, { _id: false });

const BlogSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  excerpt: String,
  author: String,
  contentBlocks: [ContentBlockSchema],
  featuredImage: { url: String, publicId: String, alt: String, width: Number, height: Number },
  seo: { metaTitle: String, metaDescription: String, focusKeyword: String, robots: String },
  category: { id: mongoose.Schema.Types.ObjectId, name: String, slug: String },
  tags: [String],
  workflow: {
    status: { type: String, default: 'published' },
    creationType: String,
    publishedAt: Date,
    lastModifiedAt: Date,
  },
  seoMetrics: { wordCount: Number, readingTime: Number },
  flags: { isFeatured: Boolean, isEvergreen: Boolean, needsUpdate: Boolean },
  notifications: [],
  internalLinks: [],
  externalLinks: [],
  outgoingLinkCount: { type: Number, default: 0 },
  incomingLinkCount: { type: Number, default: 0 },
}, { timestamps: true });

const BlogCategory = mongoose.models.BlogCategory || mongoose.model('BlogCategory', BlogCategorySchema);
const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

// ── Seed data ──────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB:', MONGODB_URI);

  // 1. Create categories
  const categoryDefs = [
    { name: 'Artificial Intelligence', slug: 'artificial-intelligence', description: 'AI, ML, and LLM trends' },
    { name: 'Web Development', slug: 'web-development', description: 'Modern web dev guides' },
    { name: 'Logo Design', slug: 'logo-design', description: 'Branding and visual identity' },
  ];

  const cats: Record<string, any> = {};
  for (const def of categoryDefs) {
    const existing = await BlogCategory.findOne({ slug: def.slug });
    if (existing) {
      cats[def.slug] = existing;
      console.log(`  ⏭ Category exists: ${def.name}`);
    } else {
      cats[def.slug] = await BlogCategory.create(def);
      console.log(`  ✅ Created category: ${def.name}`);
    }
  }

  // 2. Blog posts
  const blogs = [
    {
      title: 'Trending AI Technologies Transforming the Digital World in 2026',
      slug: 'trending-ai-news',
      excerpt: 'Artificial Intelligence is no longer a futuristic concept. In 2026, AI has become a core part of modern businesses, digital products, and healthcare systems.',
      author: 'Admin',
      tags: ['artificial-intelligence', 'ai-2026', 'machine-learning', 'generative-ai', 'technology'],
      categorySlug: 'artificial-intelligence',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop',
        publicId: 'ai-hero',
        alt: 'AI futuristic technology illustration',
        width: 1200,
        height: 630,
      },
      seo: {
        metaTitle: 'Trending AI Technologies in 2026 | Digital Transformation Guide',
        metaDescription: 'Discover the top AI technologies reshaping industries in 2026 — from AI agents to generative AI, video generation, and autonomous systems.',
        focusKeyword: 'AI technologies 2026',
        robots: 'index, follow',
      },
      contentBlocks: [
        { id: 'b1', type: 'paragraph', order: 0, content: 'Artificial Intelligence is no longer a futuristic concept. In 2026, AI has become a core part of modern businesses, digital products, healthcare systems, education platforms, and software development. Companies that fail to adapt to AI-driven workflows are already falling behind competitors who automate operations, improve customer experience, and accelerate innovation using intelligent systems.' },
        { id: 'b2', type: 'h2', order: 1, content: 'Why AI is Dominating Every Industry', anchorId: 'why-ai-is-dominating-every-industry' },
        { id: 'b3', type: 'paragraph', order: 2, content: 'The biggest reason AI is trending is simple: <strong>productivity</strong>. Businesses can now automate repetitive tasks, analyze huge datasets within seconds, generate content instantly, and provide 24/7 customer support through advanced AI agents. Startups are building products faster than ever before using AI-powered coding assistants, automation tools, and intelligent analytics platforms.' },
        { id: 'b4', type: 'quote', order: 3, content: '"AI will not replace humans completely, but humans using AI will replace humans who don\'t."' },
        { id: 'b5', type: 'h2', order: 4, content: 'Top Trending AI Technologies in 2026', anchorId: 'top-trending-ai-technologies-in-2026' },
        { id: 'b6', type: 'h3', order: 5, content: '1. AI Agents', anchorId: '1-ai-agents' },
        { id: 'b7', type: 'paragraph', order: 6, content: 'AI agents can perform complex multi-step tasks like research, scheduling, coding, and workflow automation without constant human input. Businesses are heavily investing in autonomous AI systems that can independently execute goals, handle exceptions, and report results.' },
        { id: 'b8', type: 'h3', order: 7, content: '2. Generative AI', anchorId: '2-generative-ai' },
        { id: 'b9', type: 'paragraph', order: 8, content: 'Generative AI tools create text, images, videos, music, and even software applications. Content creation industries are being completely transformed by these technologies — from marketing copy to full video productions.' },
        { id: 'b10', type: 'h3', order: 9, content: '3. AI in Software Development', anchorId: '3-ai-in-software-development' },
        { id: 'b11', type: 'paragraph', order: 10, content: 'Developers are using AI coding assistants to generate boilerplate code, debug applications, write documentation, and improve development speed significantly. Tools like GitHub Copilot, Cursor, and Gemini Code Assist are becoming essential in every developer\'s workflow.' },
        { id: 'b12', type: 'h2', order: 11, content: 'Will AI Replace Jobs?', anchorId: 'will-ai-replace-jobs' },
        { id: 'b13', type: 'paragraph', order: 12, content: 'AI will automate many repetitive jobs, especially in customer support, data entry, and content generation. However, it will also create new opportunities for developers, AI engineers, automation specialists, prompt designers, and product builders who understand how to work with intelligent systems.' },
        { id: 'b14', type: 'list', order: 13, listType: 'unordered', listItems: ['AI-powered businesses will grow faster than traditional companies.', 'Automation skills will become highly valuable in the job market.', 'Personal branding with AI tools will dominate social platforms.', 'Developers who adapt to AI workflows will increase productivity by 10x.', 'Companies will prioritize AI-first product strategies.'] },
        { id: 'b15', type: 'h2', order: 14, content: 'Final Thoughts', anchorId: 'final-thoughts' },
        { id: 'b16', type: 'paragraph', order: 15, content: 'The AI revolution is moving faster than most people realize. Businesses, developers, creators, and entrepreneurs who learn AI tools early will gain a massive advantage over the next few years. The technology is not slowing down — it is accelerating rapidly.' },
        { id: 'b17', type: 'paragraph', order: 16, content: 'Instead of fearing AI, the smarter move is learning how to use it effectively. The future belongs to people who combine <strong>creativity</strong>, <strong>technical skills</strong>, and AI-driven execution.' },
      ],
    },
    {
      title: 'Next.js 15 Complete Guide: App Router, Server Actions & Performance',
      slug: 'nextjs-15-complete-guide',
      excerpt: 'Next.js 15 brings major performance improvements, a stable App Router, and powerful Server Actions. This complete guide covers everything you need to build production-ready apps.',
      author: 'Admin',
      tags: ['nextjs', 'react', 'web-development', 'server-actions', 'app-router'],
      categorySlug: 'web-development',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=1200&auto=format&fit=crop',
        publicId: 'nextjs-hero',
        alt: 'Next.js development workspace',
        width: 1200,
        height: 630,
      },
      seo: {
        metaTitle: 'Next.js 15 Complete Guide | App Router & Server Actions',
        metaDescription: 'Learn everything about Next.js 15: App Router, Server Actions, Partial Pre-rendering, and performance optimizations to build faster applications.',
        focusKeyword: 'Next.js 15 guide',
        robots: 'index, follow',
      },
      contentBlocks: [
        { id: 'c1', type: 'paragraph', order: 0, content: 'Next.js 15 represents a major leap forward for React-based web development. With a fully stable App Router, powerful Server Actions, and new Partial Pre-rendering capabilities, it\'s the most capable version of Next.js ever released.' },
        { id: 'c2', type: 'h2', order: 1, content: 'What\'s New in Next.js 15', anchorId: 'whats-new-in-nextjs-15' },
        { id: 'c3', type: 'list', order: 2, listType: 'unordered', listItems: ['Stable App Router with improved caching semantics', 'Server Actions now stable and production-ready', 'Partial Pre-rendering (PPR) for hybrid static/dynamic pages', 'React 19 support with new hooks', 'Turbopack now the default bundler in dev mode', 'Improved error overlays and debugging'] },
        { id: 'c4', type: 'h2', order: 3, content: 'Understanding Server Actions', anchorId: 'understanding-server-actions' },
        { id: 'c5', type: 'paragraph', order: 4, content: 'Server Actions allow you to run server-side code directly from your React components — no API routes needed. They are perfect for form submissions, database mutations, and any logic that should stay on the server.' },
        { id: 'c6', type: 'code', order: 5, codeLanguage: 'typescript', codeContent: `// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  
  await db.post.create({ data: { title } });
  revalidatePath('/posts');
  
  return { success: true };
}` },
        { id: 'c7', type: 'h2', order: 6, content: 'App Router vs Pages Router', anchorId: 'app-router-vs-pages-router' },
        { id: 'c8', type: 'paragraph', order: 7, content: 'The App Router uses React Server Components by default, meaning your components run on the server and send minimal JavaScript to the client. This dramatically improves performance, especially for content-heavy pages like blogs, marketing sites, and dashboards.' },
        { id: 'c9', type: 'quote', order: 8, content: '"The App Router is the future of Next.js. If you\'re starting a new project, use it from day one."' },
        { id: 'c10', type: 'h2', order: 9, content: 'Performance Best Practices', anchorId: 'performance-best-practices' },
        { id: 'c11', type: 'list', order: 10, listType: 'ordered', listItems: ['Use React Server Components for data-fetching components', 'Mark client boundaries with "use client" only when needed', 'Leverage Partial Pre-rendering for dynamic content', 'Use next/image for automatic image optimization', 'Enable Turbopack for faster dev builds'] },
      ],
    },
    {
      title: 'How to Design a Timeless Logo: Principles and Best Practices',
      slug: 'how-to-design-timeless-logo',
      excerpt: 'A great logo is the foundation of any strong brand. Learn the core principles of logo design — simplicity, scalability, and memorability — with practical examples.',
      author: 'Admin',
      tags: ['logo-design', 'branding', 'graphic-design', 'visual-identity', 'design-principles'],
      categorySlug: 'logo-design',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200&auto=format&fit=crop',
        publicId: 'logo-design-hero',
        alt: 'Logo design process on paper',
        width: 1200,
        height: 630,
      },
      seo: {
        metaTitle: 'How to Design a Timeless Logo | Complete Branding Guide',
        metaDescription: 'Master the art of logo design with proven principles: simplicity, versatility, memorability, and the psychology of color and typography in brand identity.',
        focusKeyword: 'logo design principles',
        robots: 'index, follow',
      },
      contentBlocks: [
        { id: 'd1', type: 'paragraph', order: 0, content: 'A great logo is more than just a pretty image — it\'s the visual cornerstone of your entire brand identity. The best logos are instantly recognizable, work in any size, and remain relevant for decades. Think Nike, Apple, or Mercedes-Benz.' },
        { id: 'd2', type: 'h2', order: 1, content: 'The 5 Core Principles of Logo Design', anchorId: 'the-5-core-principles-of-logo-design' },
        { id: 'd3', type: 'list', order: 2, listType: 'ordered', listItems: ['Simple — Easy to recognize and remember at a glance', 'Memorable — Distinct enough to stand out from competitors', 'Timeless — Avoids trendy styles that date quickly', 'Versatile — Works in all sizes from favicon to billboard', 'Appropriate — Fits the industry and target audience'] },
        { id: 'd4', type: 'h2', order: 3, content: 'Choosing the Right Color Psychology', anchorId: 'choosing-the-right-color-psychology' },
        { id: 'd5', type: 'paragraph', order: 4, content: 'Color is one of the most powerful tools in logo design. Each color communicates a different emotion and brand personality. <strong>Blue</strong> conveys trust and professionalism (used by banks and tech companies). <strong>Red</strong> signals energy and passion (used in food and entertainment). <strong>Green</strong> suggests health and nature (used in wellness and eco brands).' },
        { id: 'd6', type: 'h2', order: 5, content: 'Typography in Logo Design', anchorId: 'typography-in-logo-design' },
        { id: 'd7', type: 'paragraph', order: 6, content: 'The typeface you choose communicates your brand\'s personality before the reader processes a single word. Serif fonts feel traditional and trustworthy. Sans-serif fonts feel modern and clean. Script fonts feel personal and creative. Custom lettering can make your logo completely unique.' },
        { id: 'd8', type: 'quote', order: 7, content: '"Design is not just what it looks like and feels like. Design is how it works." — Steve Jobs' },
        { id: 'd9', type: 'h2', order: 8, content: 'Common Logo Design Mistakes to Avoid', anchorId: 'common-logo-design-mistakes-to-avoid' },
        { id: 'd10', type: 'list', order: 9, listType: 'unordered', listItems: ['Using raster images instead of vectors (SVG/AI)', 'Too many colors — stick to 2-3 maximum', 'Overly complex details that disappear at small sizes', 'Copying competitor logos instead of differentiating', 'Relying on gradients that don\'t reproduce well in print', 'Using clip-art or stock icons as your primary logo mark'] },
        { id: 'd11', type: 'h2', order: 10, content: 'The Logo Design Process', anchorId: 'the-logo-design-process' },
        { id: 'd12', type: 'list', order: 11, listType: 'ordered', listItems: ['Research — Understand the brand, audience, and competitors', 'Sketch — Generate 20-30 rough concepts on paper first', 'Digitize — Convert the top 3-5 sketches into vector format', 'Refine — Iterate on typography, color, and spacing', 'Present — Show concepts on real mockups (business cards, websites)', 'Deliver — Provide all formats: SVG, PNG, PDF in multiple colors'] },
      ],
    },
  ];

  // Insert blogs
  for (const blogDef of blogs) {
    const existing = await Blog.findOne({ slug: blogDef.slug });
    if (existing) {
      console.log(`  ⏭ Blog exists: "${blogDef.title}"`);
      continue;
    }

    const cat = cats[blogDef.categorySlug];
    if (!cat) {
      console.log(`  ❌ Category not found for: ${blogDef.slug}`);
      continue;
    }

    await Blog.create({
      title: blogDef.title,
      slug: blogDef.slug,
      excerpt: blogDef.excerpt,
      author: blogDef.author,
      contentBlocks: blogDef.contentBlocks,
      featuredImage: blogDef.featuredImage,
      seo: blogDef.seo,
      category: { id: cat._id, name: cat.name, slug: cat.slug },
      tags: blogDef.tags,
      workflow: {
        status: 'published',
        creationType: 'manual',
        publishedAt: new Date(),
        lastModifiedAt: new Date(),
      },
      seoMetrics: { wordCount: 400, readingTime: 4 },
      flags: { isFeatured: blogDef.categorySlug === 'artificial-intelligence', isEvergreen: false, needsUpdate: false },
      notifications: [],
      internalLinks: [],
      externalLinks: [],
    });

    // Bump category blogCount
    await BlogCategory.findByIdAndUpdate(cat._id, { $inc: { blogCount: 1 } });
    console.log(`  ✅ Created blog: "${blogDef.title}"`);
  }

  console.log('\n🎉 Seed complete!');
  console.log('📖 Visit: http://localhost:3000/blog');
  console.log('📝 Visit: http://localhost:3000/blog/trending-ai-news');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
