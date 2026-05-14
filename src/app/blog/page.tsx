import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getBlogs } from '@/services/blogService';
import { getAllBlogCategories } from '@/services/blogCategoryService';
import BlogCard from '@/components/blog/BlogCard';
import { generateSEO } from '@/lib/seo';
import NewsletterSignup from '@/components/blog/NewsletterSignup';

export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { category } = await searchParams;

  if (category) {
    const name = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
    return generateSEO({
      title: `${name} Blog Posts`,
      description: `Read our latest articles about ${category.replace(/-/g, ' ')}`,
      url: `/blog?category=${category}`,
    });
  }

  return generateSEO({
    title: 'Blog',
    description: 'Read our latest articles on web development, SEO, design, and technology',
    url: '/blog',
  });
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { page: pageParam, category: categorySlug } = await searchParams;
  const page = Number(pageParam) || 1;

  const [blogsData, categories] = await Promise.all([
    getBlogs({ page, limit: 12, status: 'published', categorySlug }),
    getAllBlogCategories(),
  ]);

  const { data: blogs, pagination } = blogsData;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Insights, tutorials, and best practices for modern web development
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
            <Link
              href="/blog"
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                !categorySlug ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Posts
            </Link>
            {categories.map((category) => (
              <Link
                key={category._id?.toString()}
                href={`/blog?category=${category.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  categorySlug === category.slug
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
                {category.blogCount > 0 && (
                  <span className="ml-1.5 text-xs opacity-70">({category.blogCount})</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {blogs.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg mb-4">No blog posts found.</p>
            <Link href="/blog" className="text-blue-600 hover:underline text-sm font-medium">
              View all posts →
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog.slug} blog={blog} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12">
                {page > 1 && (
                  <Link
                    href={`/blog?page=${page - 1}${categorySlug ? `&category=${categorySlug}` : ''}`}
                    className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    ← Previous
                  </Link>
                )}
                <span className="text-sm text-gray-500">
                  Page {page} of {pagination.totalPages}
                </span>
                {pagination.hasMore && (
                  <Link
                    href={`/blog?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ''}`}
                    className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Newsletter CTA */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <NewsletterSignup variant="hero" source="blog-listing" />
      </div>
    </main>
  );
}
