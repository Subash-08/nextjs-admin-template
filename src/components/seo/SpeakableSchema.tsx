import React from 'react';

interface Props {
  blog: {
    title: string;
    slug: string;
    excerpt?: string;
  };
}

export default function SpeakableSchema({ blog }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: blog.title,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.blog-title', '.blog-excerpt', '.blog-summary'],
    },
    url: `${baseUrl}/blog/${blog.slug}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
