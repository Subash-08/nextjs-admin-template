import { NextResponse } from 'next/server';
import Blog from '@/models/Blog';
import dbConnect from '@/lib/db';

export async function GET() {
  await dbConnect();

  const blogs = await Blog.find({ 'workflow.status': 'published' })
    .select('slug workflow.publishedAt workflow.lastModifiedAt')
    .lean();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  ${blogs
    .map(
      (blog: any) => `<url>
    <loc>${baseUrl}/blog/${blog.slug}</loc>
    <lastmod>${(blog.workflow?.lastModifiedAt || blog.workflow?.publishedAt || new Date()).toString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('\n  ')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  });
}
