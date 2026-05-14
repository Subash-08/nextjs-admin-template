import { Metadata } from 'next';

const defaultUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';

interface SEOProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  keywords?: string[];
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateSEO({
  title,
  description,
  url = defaultUrl,
  image = '/og-default.png',
  keywords = [],
  type = 'website',
  publishedTime,
  modifiedTime,
}: SEOProps): Metadata {
  const siteName = 'Your Portfolio Name';
  const fullTitle = `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      images: [
        {
          url: image.startsWith('http') ? image : `${defaultUrl}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
      ...(type === 'article' && modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      creator: '@yourtwitterhandle',
      images: [image.startsWith('http') ? image : `${defaultUrl}${image}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
