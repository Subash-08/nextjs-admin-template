import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Clock, Calendar } from 'lucide-react';
import type { IBlog } from '@/types/blog';

interface Props {
  blogs: IBlog[];
}

export default function RelatedPosts({ blogs }: Props) {
  return (
    <section className="border-t border-gray-100 pt-12 mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link key={blog.slug} href={`/blog/${blog.slug}`} className="group flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
            {blog.featuredImage?.url && (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                <Image src={blog.featuredImage.url} alt={blog.title} fill className="object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">{blog.title}</p>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                <Clock size={11} />
                {blog.seoMetrics?.readingTime ?? 1} min read
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
