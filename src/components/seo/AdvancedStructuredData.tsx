import type { IBlog } from '@/models/Blog';
import { generateFAQSchema } from '@/lib/blog/faqGenerator';

import { siteConfig } from '@/config/site';

interface Props {
  blog: IBlog;
  authorProfileUrl?: string;
}

export default function AdvancedStructuredData({
  blog,
  authorProfileUrl,
}: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Enhanced Article Schema with more Google-friendly fields
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${blog.slug}`,
    },
    headline: blog.title,
    description: blog.seo?.metaDescription || blog.excerpt,
    image: blog.featuredImage?.url ? [
      blog.featuredImage.url,
      // Add variations for different aspect ratios if we had them, for now just the main one
    ] : [],
    datePublished: blog.workflow?.publishedAt?.toISOString() || blog.createdAt?.toISOString(),
    dateModified: blog.workflow?.lastModifiedAt?.toISOString() || blog.workflow?.publishedAt?.toISOString() || blog.updatedAt?.toISOString(),
    author: {
      '@type': 'Person',
      name: blog.author,
      url: authorProfileUrl || `${baseUrl}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.organization.name,
      logo: {
        '@type': 'ImageObject',
        url: siteConfig.organization.logo,
      },
    },
    keywords: [blog.seo?.focusKeyword, ...(blog.seo?.secondaryKeywords || []), ...(blog.tags || [])].filter(Boolean).join(', '),
    wordCount: blog.seoMetrics?.wordCount || 0,
    timeRequired: `PT${blog.seoMetrics?.readingTime || 1}M`,
    articleSection: blog.category?.name || 'Blog',
    inLanguage: 'en-US',
    isAccessibleForFree: true,
  };

  // Author Schema
  const authorSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: blog.author,
    url: authorProfileUrl || `${baseUrl}/about`,
    jobTitle: 'Content Writer', // Customize per author
  };

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.organization.name,
    url: baseUrl,
    logo: siteConfig.organization.logo,
    sameAs: [
      siteConfig.social.twitter,
      siteConfig.social.linkedin,
      siteConfig.social.github,
    ].filter(Boolean),
  };

  // HowTo Schema (if article is instructional)
  const hasSteps = (blog.contentBlocks || []).some(
    (b) => b.type === 'h2' && b.content?.toLowerCase().includes('step')
  );

  const howToSchema = hasSteps ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: blog.title,
    description: blog.seo?.metaDescription || blog.excerpt,
    image: blog.featuredImage?.url,
    totalTime: `PT${blog.seoMetrics?.readingTime || 1}M`,
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0',
    },
    step: (blog.contentBlocks || [])
      .filter((b) => b.type === 'h2' || b.type === 'h3')
      .map((block, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: block.content?.replace(/<[^>]*>/g, ''),
        text: block.content?.replace(/<[^>]*>/g, ''),
        url: `${baseUrl}/blog/${blog.slug}#${block.anchorId || ''}`,
      })),
  } : null;

  // FAQ Schema
  const faqs = generateFAQSchema(blog.contentBlocks || []);
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
