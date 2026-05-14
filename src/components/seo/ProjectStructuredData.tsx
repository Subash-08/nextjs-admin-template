import React from 'react';

// Using a loose type for project to match the various fields it might have
interface ProjectProps {
  title: string;
  description?: string;
  shortSummary?: string;
  slug: string;
  coverImage?: { url: string };
  createdAt?: Date | string;
  publishedAt?: Date | string;
  updatedAt?: Date | string;
  tags?: string[];
  services?: string[];
  clientTestimonial?: string;
  clientName?: string;
}

import { siteConfig } from '@/config/site';

interface Props {
  project: ProjectProps;
}

export default function ProjectStructuredData({
  project,
}: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // CreativeWork Schema for Projects
  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description || project.shortSummary,
    url: `${baseUrl}/works/${project.slug}`,
    image: project.coverImage?.url,
    dateCreated: project.createdAt ? new Date(project.createdAt).toISOString() : undefined,
    datePublished: project.publishedAt ? new Date(project.publishedAt).toISOString() : undefined,
    author: {
      '@type': 'Organization',
      name: siteConfig.organization.name,
      logo: siteConfig.organization.logo,
    },
    keywords: project.tags?.join(', '),
    inLanguage: 'en-US',
    isAccessibleForFree: true,
  };

  // Service Schema (if project showcases a service)
  const serviceSchema = project.services && project.services.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: project.services[0],
    provider: {
      '@type': 'Organization',
      name: siteConfig.organization.name,
    },
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: project.services[0],
      itemListElement: project.services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service,
        },
      })),
    },
  } : null;

  // Portfolio Collection Schema
  const portfolioSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${siteConfig.organization.name} Portfolio`,
    description: 'Featured projects and case studies',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'CreativeWork',
          name: project.title,
          url: `${baseUrl}/works/${project.slug}`,
          image: project.coverImage?.url,
        },
      },
    ],
  };

  // Review/Rating Schema (if project has testimonials)
  const reviewSchema = project.clientTestimonial ? {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'CreativeWork',
      name: project.title,
    },
    author: {
      '@type': 'Person',
      name: project.clientName || 'Anonymous Client',
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: 5,
      bestRating: 5,
    },
    reviewBody: project.clientTestimonial,
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      {serviceSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />
      {reviewSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
      )}
    </>
  );
}
