import { NextResponse } from 'next/server';
import { getBlogs } from '@/services/blogService';

export async function GET() {
  const { data: blogs } = await getBlogs({ page: 1, limit: 50, status: 'published' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Your Portfolio Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Latest articles on web development, SEO, and technology</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom"/>
    ${blogs
      .map(
        (blog) => `<item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${baseUrl}/blog/${blog.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${blog.slug}</guid>
      <description><![CDATA[${blog.excerpt?.replace(/<[^>]*>/g, '') || ''}]]></description>
      <pubDate>${blog.workflow?.publishedAt ? new Date(blog.workflow.publishedAt).toUTCString() : new Date().toUTCString()}</pubDate>
      <category>${blog.category?.name || ''}</category>
      <author>${blog.author}</author>
      ${blog.featuredImage?.url ? `<media:content url="${blog.featuredImage.url}" medium="image"/>` : ''}
    </item>`
      )
      .join('\n    ')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  });
}
