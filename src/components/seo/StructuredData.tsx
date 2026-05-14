import React from 'react';
import { IProject } from '@/models/Project';

const defaultUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';

export function OrganizationStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Your Portfolio Name',
    url: defaultUrl,
    logo: `${defaultUrl}/logo.png`,
    sameAs: [
      'https://twitter.com/yourtwitterhandle',
      'https://linkedin.com/in/yourlinkedin',
      'https://github.com/yourgithub'
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ProjectStructuredData({ project }: { project: IProject }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.seoTitle || project.title,
    description: project.seoDescription || project.shortSummary,
    image: project.thumbnail?.url || `${defaultUrl}/og-default.png`,
    author: {
      '@type': 'Organization',
      name: project.clientCompany || project.clientName || 'Your Portfolio Name'
    },
    datePublished: project.publishDate || project.createdAt,
    dateModified: project.updatedAt,
    keywords: project.seoKeywords?.join(', ') || project.tags?.join(', '),
    inLanguage: 'en-US'
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbStructuredData({ items }: { items: { name: string, item: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item.startsWith('http') ? item.item : `${defaultUrl}${item.item}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
