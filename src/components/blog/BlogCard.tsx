import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Clock, Calendar } from 'lucide-react';
import type { IBlog } from '@/types/blog';

interface BlogCardProps {
  blog: IBlog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col">
      {/* Featured Image */}
      {blog.featuredImage?.url && (
        <Link href={`/blog/${blog.slug}`} className="block overflow-hidden aspect-[16/9] relative bg-gray-100">
          <Image
            src={blog.featuredImage.url}
            alt={blog.featuredImage.alt || blog.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      )}

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Category Badge */}
        <Link
          href={`/blog?category=${blog.category?.slug}`}
          className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full mb-3 w-fit transition-colors"
        >
          {blog.category?.name}
        </Link>

        {/* Title */}
        <Link href={`/blog/${blog.slug}`} className="group/title flex-1">
          <h2 className="text-lg font-bold text-gray-900 group-hover/title:text-blue-600 transition-colors line-clamp-2 mb-3">
            {blog.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
          {blog.excerpt?.replace(/<[^>]*>/g, '')}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-gray-400 pt-4 border-t border-gray-100">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            {blog.workflow?.publishedAt
              ? format(new Date(blog.workflow.publishedAt), 'MMM d, yyyy')
              : 'Unpublished'}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {blog.seoMetrics?.readingTime ?? 1} min read
          </span>
          <span className="ml-auto font-medium text-gray-500 truncate">
            {blog.author}
          </span>
        </div>
      </div>
    </article>
  );
}
