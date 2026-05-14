import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Clock, Calendar, ArrowLeft } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { getBlogBySlug, getRelatedBlogs, getAllBlogSlugs } from '@/services/blogService';
import { renderBlocksToHtml } from '@/lib/blog/blocksToHtml';
import { generateTableOfContents } from '@/lib/blog/tableOfContents';
import { generateSEO } from '@/lib/seo';
import AdvancedStructuredData from '@/components/seo/AdvancedStructuredData';
import SpeakableSchema from '@/components/seo/SpeakableSchema';
import TableOfContents from '@/components/blog/TableOfContents';
import BlogContent from '@/components/blog/BlogContent';
import AISummary from '@/components/blog/AISummary';
import FeaturedSnippet from '@/components/blog/FeaturedSnippet';
import RelatedPosts from '@/components/blog/RelatedPosts';
import ShareButtons from '@/components/blog/ShareButtons';
import NewsletterSignup from '@/components/blog/NewsletterSignup';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) return { title: 'Blog Not Found' };

  return generateSEO({
    title: blog.seo?.metaTitle || blog.title,
    description: blog.seo?.metaDescription || blog.excerpt?.replace(/<[^>]*>/g, ''),
    image: blog.seo?.ogImage || blog.featuredImage?.url,
    url: `/blog/${blog.slug}`,
    keywords: [blog.seo?.focusKeyword, ...(blog.seo?.secondaryKeywords || []), ...blog.tags].filter(Boolean) as string[],
    type: 'article',
    publishedTime: blog.workflow?.publishedAt?.toString(),
    modifiedTime: blog.workflow?.lastModifiedAt?.toString(),
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog || blog.workflow?.status !== 'published') {
    notFound();
  }

  const [relatedBlogs, toc] = await Promise.all([
    getRelatedBlogs(blog._id.toString(), blog.category?.slug, 3),
    generateTableOfContents(blog.contentBlocks || []),
  ]);

  const contentHtml = renderBlocksToHtml(blog.contentBlocks || []);
  
  // Extract first FAQ for Featured Snippet optimization
  const firstFaqBlock = blog.contentBlocks?.find((b) => b.type === 'faq' && b.question && b.answer);

  return (
    <>
      <AdvancedStructuredData
        blog={blog}
      />
      <SpeakableSchema 
        blog={{
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt?.replace(/<[^>]*>/g, '') || ''
        }} 
      />

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <div className="bg-gray-50 border-b border-gray-100 py-12">
          <div className="max-w-5xl mx-auto px-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>

            <Link
              href={`/blog?category=${blog.category?.slug}`}
              className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full mb-4 transition-colors"
            >
              {blog.category?.name}
            </Link>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6 blog-title">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar size={15} />
                {blog.workflow?.publishedAt
                  ? format(new Date(blog.workflow.publishedAt), 'MMMM d, yyyy')
                  : 'Unknown date'}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={15} />
                {blog.seoMetrics?.readingTime ?? 1} min read
              </span>
              <span className="font-medium text-gray-700">By {blog.author}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {blog.featuredImage?.url && (
          <div className="max-w-5xl mx-auto px-4 -mt-0 pt-8">
            <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={blog.featuredImage.url}
                alt={blog.featuredImage.alt || blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex gap-10">
            {/* TOC Sidebar */}
            {toc.length > 0 && (
              <aside className="hidden lg:block w-64 shrink-0">
                <TableOfContents items={toc} />
              </aside>
            )}

            {/* Article */}
            <article className="flex-1 min-w-0">
              {/* Excerpt */}
              {blog.excerpt && (
                <p className="text-xl text-gray-500 leading-relaxed mb-8 pb-8 border-b border-gray-100 font-light blog-excerpt">
                  {blog.excerpt.replace(/<[^>]*>/g, '')}
                </p>
              )}

              {/* AI Summary */}
              <div className="blog-summary">
                <AISummary 
                  blog={{
                    title: blog.title,
                    excerpt: blog.excerpt?.replace(/<[^>]*>/g, '') || '',
                    keyTakeaways: blog.keyTakeaways || []
                  }} 
                />
              </div>

              {/* Featured Snippet (AEO) */}
              {firstFaqBlock && (
                <FeaturedSnippet
                  question={firstFaqBlock.question || ''}
                  answer={firstFaqBlock.answer || ''}
                />
              )}

              <BlogContent html={contentHtml} />

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-500 mr-1">Tags:</span>
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <ShareButtons url={`/blog/${blog.slug}`} title={blog.title} />
              </div>
            </article>
          </div>

          {/* Related Posts */}
          {relatedBlogs.length > 0 && (
            <RelatedPosts blogs={relatedBlogs} />
          )}

          {/* Newsletter CTA */}
          <div className="mt-16">
            <NewsletterSignup
              variant="hero"
              source={`blog-post-${blog.slug}`}
            />
          </div>
        </div>
      </main>
    </>
  );
}
