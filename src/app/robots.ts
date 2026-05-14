import { MetadataRoute } from 'next';
import { env } from '@/config/env';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/_next/'],
    },
    sitemap: `${env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}/sitemap.xml`,
  };
}
