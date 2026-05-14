import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Since this is a script, we need to import the models directly
// We'll define the schemas here to avoid import issues with Next.js specific code
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

const blogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  excerpt: String,
  contentBlocks: Array,
  author: String,
  tags: [String],
  categorySlug: String,
  seo: Object,
  seoMetrics: Object,
  keyTakeaways: [String],
  workflow: Object,
  featuredImage: Object,
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

const blogsToInsert = [
  {
    title: 'How to Master Voice Search Optimization in 2026',
    slug: 'how-to-master-voice-search-optimization',
    excerpt: 'Voice search is dominating user behavior. Learn how to optimize your content for Answer Engines and smart assistants like Siri, Alexa, and Google.',
    author: 'Admin User',
    tags: ['SEO', 'Voice Search', 'AEO', 'Marketing'],
    categorySlug: 'technology',
    keyTakeaways: [
      'Voice search prefers natural, conversational question phrases.',
      'Target position zero with structured data and featured snippets.',
      'Keep your primary answers between 40 to 60 words for optimal voice readouts.',
      'Always use FAQ schema to help AI engines understand your content.'
    ],
    seo: {
      metaTitle: 'How to Master Voice Search Optimization | Complete Guide',
      metaDescription: 'Discover the ultimate strategies to optimize your website for voice search and AI Overviews in 2026. Step-by-step tutorial.',
      focusKeyword: 'Voice Search Optimization',
    },
    seoMetrics: {
      wordCount: 850,
      readingTime: 4,
      score: 95
    },
    workflow: {
      status: 'published',
      publishedAt: new Date(),
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      alt: 'Voice Assistant Device'
    },
    contentBlocks: [
      {
        id: 'block-1',
        type: 'paragraph',
        order: 0,
        content: 'With the rise of AI Overviews and smart speakers, traditional SEO is no longer enough. The best way to rank today is by answering questions directly and concisely. In this guide, we will explore exactly what you need to do.'
      },
      {
        id: 'block-2',
        type: 'h2',
        order: 1,
        content: 'Why is conversational language important?'
      },
      {
        id: 'block-3',
        type: 'paragraph',
        order: 2,
        content: 'When people use voice search, they do not speak the same way they type. Instead of typing "best running shoes," they ask, "What are the best running shoes for flat feet?" Your content must match this conversational tone.'
      },
      {
        id: 'block-faq-1',
        type: 'faq',
        order: 3,
        question: 'What is Answer Engine Optimization (AEO)?',
        answer: 'Answer Engine Optimization (AEO) is the process of optimizing content specifically to be read aloud by voice assistants or displayed as direct answers in AI-generated search summaries like Google AI Overviews.'
      },
      {
        id: 'block-faq-2',
        type: 'faq',
        order: 4,
        question: 'How long should a voice search answer be?',
        answer: 'Studies show that the optimal length for a voice search answer is between 40 and 60 words. It should be concise, direct, and free of unnecessary jargon.'
      }
    ]
  },
  {
    title: 'What is Next.js App Router and Why Use It?',
    slug: 'what-is-nextjs-app-router',
    excerpt: 'The App Router in Next.js has completely revolutionized how we build React applications. Let\'s dive into Server Components and streaming.',
    author: 'Admin User',
    tags: ['React', 'Next.js', 'Web Development'],
    categorySlug: 'development',
    keyTakeaways: [
      'React Server Components are the default in App Router, shipping zero JavaScript to the client.',
      'Nested routing and layouts are incredibly intuitive.',
      'Data fetching is native to the component level.',
      'Streaming allows instant page loading states.'
    ],
    seo: {
      metaTitle: 'What is Next.js App Router? Server Components Guide',
      metaDescription: 'A complete beginner guide to the Next.js App Router, React Server Components, and why it is the future of web development.',
      focusKeyword: 'Next.js App Router',
    },
    seoMetrics: {
      wordCount: 650,
      readingTime: 3,
      score: 92
    },
    workflow: {
      status: 'published',
      publishedAt: new Date(),
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      alt: 'Coding on a laptop screen'
    },
    contentBlocks: [
      {
        id: 'block-1',
        type: 'paragraph',
        order: 0,
        content: 'The release of Next.js 13 brought the App Router, a brand new paradigm for building React applications that leverages the power of React Server Components (RSC).'
      },
      {
        id: 'block-2',
        type: 'h2',
        order: 1,
        content: 'Understanding Server Components'
      },
      {
        id: 'block-3',
        type: 'paragraph',
        order: 2,
        content: 'Server Components execute exclusively on the server. This means they can access databases directly and never ship their dependencies to the client browser, resulting in lightning-fast load times.'
      },
      {
        id: 'block-4',
        type: 'quote',
        order: 3,
        content: 'The App Router represents the biggest shift in the React ecosystem since Hooks.'
      },
      {
        id: 'block-faq-1',
        type: 'faq',
        order: 4,
        question: 'Can I still use client-side state in Next.js App Router?',
        answer: 'Yes! You can still use client-side state by adding the "use client" directive at the top of your file. This tells Next.js to render that specific component and its children on the client.'
      }
    ]
  },
  {
    title: 'The Ultimate Guide to Minimalist Web Design',
    slug: 'ultimate-guide-minimalist-web-design',
    excerpt: 'Minimalism isn\'t just about white space; it is about purpose. Learn how to remove the unnecessary to make the necessary speak.',
    author: 'Admin User',
    tags: ['Design', 'UX/UI', 'Minimalism'],
    categorySlug: 'design',
    keyTakeaways: [
      'Minimalism focuses on content and typography over decorative elements.',
      'White space (negative space) is an active element, not empty space.',
      'Use a limited color palette (usually 2-3 colors max).',
      'Accessibility often improves naturally with minimalist design.'
    ],
    seo: {
      metaTitle: 'Minimalist Web Design Guide | UI/UX Principles',
      metaDescription: 'Learn the core principles of minimalist web design. Discover how to use white space, typography, and contrast to build stunning interfaces.',
      focusKeyword: 'Minimalist Web Design',
    },
    seoMetrics: {
      wordCount: 720,
      readingTime: 3,
      score: 88
    },
    workflow: {
      status: 'published',
      publishedAt: new Date(),
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      alt: 'Minimalist workspace'
    },
    contentBlocks: [
      {
        id: 'block-1',
        type: 'paragraph',
        order: 0,
        content: 'In web design, less is truly more. Minimalist web design aims to simplify interfaces by removing unnecessary elements and focusing entirely on user functionality and content.'
      },
      {
        id: 'block-2',
        type: 'h2',
        order: 1,
        content: 'The Power of White Space'
      },
      {
        id: 'block-3',
        type: 'paragraph',
        order: 2,
        content: 'Many novice designers feel the need to fill every pixel of the screen. However, white space is what allows your content to breathe. It guides the user\'s eye and creates a visual hierarchy without needing borders or boxes.'
      },
      {
        id: 'block-faq-1',
        type: 'faq',
        order: 3,
        question: 'Does minimalist design mean I can only use black and white?',
        answer: 'Not at all. Minimalist design is about restraint. You can use bold, vibrant colors, but you should limit your palette to 1 or 2 dominant colors to maintain visual harmony.'
      },
      {
        id: 'block-faq-2',
        type: 'faq',
        order: 4,
        question: 'Is minimalist design good for SEO?',
        answer: 'Yes, minimalist design is often excellent for SEO. Because minimalist sites have fewer heavy elements (like complex scripts or decorative images), they load much faster, which is a major ranking factor for Google.'
      }
    ]
  }
];

const seedAdvancedBlogs = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB.');
    
    for (const blog of blogsToInsert) {
      // Check if it exists
      const exists = await Blog.findOne({ slug: blog.slug });
      if (exists) {
        console.log(`Blog ${blog.slug} already exists. Updating...`);
        await Blog.updateOne({ slug: blog.slug }, { $set: blog });
      } else {
        await Blog.create(blog);
        console.log(`Created new blog: ${blog.title}`);
      }
    }
    
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedAdvancedBlogs();
