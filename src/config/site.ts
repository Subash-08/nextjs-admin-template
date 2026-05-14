/**
 * SITE CONFIGURATION
 * 
 * UPDATE THIS FILE for each new project!
 * All site-wide settings are centralized here.
 */

export const siteConfig = {
  // ==================== BASIC INFO ====================
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Your Company Name',
  tagline: process.env.NEXT_PUBLIC_APP_TAGLINE || 'Building Digital Excellence',
  description: 'Professional web development, design, and digital solutions',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // ==================== CONTACT ====================
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@example.com',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+1 (555) 123-4567',
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || '123 Main St, City, Country',
  
  // ==================== SOCIAL MEDIA ====================
  social: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@yourhandle',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/company/yourcompany',
    github: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/yourorg',
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  },
  
  // ==================== SEO ====================
  seo: {
    defaultTitle: 'Your Company | Web Development & Design',
    titleTemplate: '%s | Your Company',
    defaultDescription: 'Professional web development, design, and digital solutions. Let\'s build something amazing together.',
    defaultImage: '/og-image.jpg', // 1200x630px
    twitterHandle: '@yourhandle',
  },
  
  // ==================== ORGANIZATION (for Schema.org) ====================
  organization: {
    name: 'Your Company Name',
    legalName: 'Your Company Legal Name, Inc.',
    foundingDate: '2020',
    logo: '/logo.png',
    description: 'Professional web development and design agency',
    type: 'Organization' as const,
    address: {
      streetAddress: '123 Main St',
      addressLocality: 'City',
      addressRegion: 'State',
      postalCode: '12345',
      addressCountry: 'US',
    },
  },
  
  // ==================== BLOG SETTINGS ====================
  blog: {
    postsPerPage: Number(process.env.NEXT_PUBLIC_BLOG_PER_PAGE) || 12,
    excerptLength: Number(process.env.NEXT_PUBLIC_BLOG_EXCERPT_LENGTH) || 200,
    enableComments: false, // Set to true when ready
    enableNewsletter: false, // Set to true when ready
  },
  
  // ==================== FEATURES (Toggle on/off) ====================
  features: {
    blog: true,
    projects: true,
    caseStudies: true,
    services: true,
    testimonials: true,
    newsletter: false, // Enable when Convertkit is set up
    analytics: false, // Enable when GA4 is set up
    contactForm: true,
  },
};

export type SiteConfig = typeof siteConfig;
