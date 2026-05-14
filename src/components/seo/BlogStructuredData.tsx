import type { IBlog } from '@/types/blog';

interface Props {
  blog: IBlog;
}

export default function BlogStructuredData({ blog }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': blog.seo?.structuredDataType || 'BlogPosting',
    headline: blog.title,
    alternativeHeadline: blog.seo?.metaTitle,
    image: blog.featuredImage?.url ? [blog.featuredImage.url] : [],
    datePublished: blog.workflow?.publishedAt?.toString(),
    dateModified: blog.workflow?.lastModifiedAt?.toString() || blog.workflow?.publishedAt?.toString(),
    author: { '@type': 'Person', name: blog.author },
    publisher: {
      '@type': 'Organization',
      name: 'Your Portfolio',
      logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` },
    },
    description: blog.seo?.metaDescription,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${baseUrl}/blog/${blog.slug}` },
    keywords: [blog.seo?.focusKeyword, ...(blog.seo?.secondaryKeywords || []), ...blog.tags].filter(Boolean).join(', '),
    articleSection: blog.category?.name,
    wordCount: blog.seoMetrics?.wordCount,
    timeRequired: `PT${blog.seoMetrics?.readingTime ?? 1}M`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: blog.category?.name, item: `${baseUrl}/blog?category=${blog.category?.slug}` },
      { '@type': 'ListItem', position: 4, name: blog.title, item: `${baseUrl}/blog/${blog.slug}` },
    ],
  };

  const faqBlocks = blog.contentBlocks?.filter((b) => b.type === 'faq' && b.question && b.answer) || [];
  const faqSchema = faqBlocks.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqBlocks.map((b) => ({
      '@type': 'Question',
      name: b.question,
      acceptedAnswer: { '@type': 'Answer', text: b.answer },
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
    </>
  );
}
