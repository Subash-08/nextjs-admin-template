import mongoose, { Schema, Document, Model } from 'mongoose';

// ============ INTERFACES ============

export interface IContentBlock {
  id: string;                    // uuid for block identity
  type: 'h2' | 'h3' | 'paragraph' | 'list' | 'image' | 'code' | 'quote' | 'video' | 'faq' | 'spacer' | 'cta';
  order: number;                 // For sorting
  
  // Text content (h2, h3, paragraph, quote)
  content?: string;              // Rich HTML with inline formatting
  
  // List blocks
  listType?: 'ordered' | 'unordered';
  listItems?: string[];
  
  // Image blocks
  imageUrl?: string;
  imagePublicId?: string;        // Cloudinary public_id
  imageAlt?: string;
  imageCaption?: string;
  imageWidth?: number;
  imageHeight?: number;
  
  // Code blocks
  codeLanguage?: string;
  codeContent?: string;
  
  // FAQ blocks
  question?: string;
  answer?: string;
  
  // CTA blocks
  ctaText?: string;
  ctaLink?: string;
  ctaStyle?: 'primary' | 'secondary';
  
  // Video blocks
  videoUrl?: string;
  videoThumbnail?: string;
  videoDuration?: number;
  
  // Block metadata
  anchorId?: string;             // For TOC linking (auto-generated from headings)
}

export interface IInternalLink {
  linkId: string;                // uuid
  targetType: 'blog' | 'project' | 'service' | 'static';
  targetSlug: string;
  targetTitle: string;
  anchorText: string;
  blockId?: string;              // Which block contains this link
  isActive: boolean;             // false if target deleted
  lastChecked: Date;
  createdAt: Date;
}

export interface IExternalLink {
  url: string;
  anchorText: string;
  blockId?: string;
  isNofollow: boolean;
  lastChecked: Date;
  isWorking: boolean;
}

export interface IBlog extends Document {
  // Basic Info
  title: string;
  slug: string;
  excerpt: string;               // Rich text, 150-200 chars
  author: string;
  
  // Content (ALL blogs use blocks)
  contentBlocks: IContentBlock[];
  
  // Featured Image
  featuredImage: {
    url: string;
    publicId: string;
    alt: string;
    width?: number;
    height?: number;
  };
  
  // SEO Metadata
  seo: {
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
    secondaryKeywords?: string[];
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    robots?: string;              // "index, follow" (default)
    structuredDataType?: 'Article' | 'BlogPosting' | 'HowTo' | 'FAQPage';
  };
  
  // Categorization
  category: {
    id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
  };
  tags: string[];
  
  // AI Summary
  keyTakeaways?: string[];
  
  // Internal Linking
  internalLinks: IInternalLink[];
  outgoingLinkCount: number;
  incomingLinkCount: number;
  
  // External Links
  externalLinks: IExternalLink[];
  
  // Workflow
  workflow: {
    status: 'draft' | 'published' | 'archived' | 'trash';
    creationType: 'manual' | 'n8n_auto_generated';
    
    // For AI-generated
    aiMetadata?: {
      generatedBy: string;
      generationDate: Date;
      modelUsed: string;
      qualityScore?: number;
    };
    
    publishedAt?: Date;
    lastModifiedAt?: Date;
    trashedAt?: Date;              // When moved to trash
  };
  
  // SEO Metrics (auto-calculated)
  seoMetrics: {
    wordCount: number;
    readingTime: number;           // Minutes
    headingStructure: {
      h1Count: number;
      h2Count: number;
      h3Count: number;
    };
    internalLinkDensity: number;
    externalLinkDensity: number;
    imagesCount: number;
    imagesWithAlt: number;
    lastCalculated: Date;
  };
  
  // Flags
  flags: {
    isFeatured: boolean;
    isEvergreen: boolean;
    needsUpdate: boolean;
  };
  
  // Notifications
  notifications: Array<any>;
  
  // Audit Trail
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============ SCHEMAS ============

const ContentBlockSchema = new Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['h2', 'h3', 'paragraph', 'list', 'image', 'code', 'quote', 'video', 'faq', 'spacer', 'cta'],
    required: true 
  },
  order: { type: Number, required: true },
  
  // Text
  content: { type: String },
  
  // List
  listType: { type: String, enum: ['ordered', 'unordered'] },
  listItems: [{ type: String }],
  
  // Image
  imageUrl: { type: String },
  imagePublicId: { type: String },
  imageAlt: { type: String },
  imageCaption: { type: String },
  imageWidth: { type: Number },
  imageHeight: { type: Number },
  
  // Code
  codeLanguage: { type: String },
  codeContent: { type: String },
  
  // FAQ
  question: { type: String },
  answer: { type: String },
  
  // CTA
  ctaText: { type: String },
  ctaLink: { type: String },
  ctaStyle: { type: String, enum: ['primary', 'secondary'] },
  
  // Video
  videoUrl: { type: String },
  videoThumbnail: { type: String },
  videoDuration: { type: Number },
  
  // Metadata
  anchorId: { type: String },
}, { _id: false });

const InternalLinkSchema = new Schema({
  linkId: { type: String, required: true },
  targetType: { type: String, enum: ['blog', 'project', 'service', 'static'], required: true },
  targetSlug: { type: String, required: true },
  targetTitle: { type: String, required: true },
  anchorText: { type: String, required: true },
  blockId: { type: String },
  isActive: { type: Boolean, default: true },
  lastChecked: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const ExternalLinkSchema = new Schema({
  url: { type: String, required: true },
  anchorText: { type: String, required: true },
  blockId: { type: String },
  isNofollow: { type: Boolean, default: false },
  lastChecked: { type: Date, default: Date.now },
  isWorking: { type: Boolean, default: true },
}, { _id: false });

const BlogSchema: Schema = new Schema({
  // Basic
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  author: { type: String, required: true },
  
  // Content
  contentBlocks: [ContentBlockSchema],
  
  // Featured Image
  featuredImage: {
    url: { type: String, required: true },
    publicId: { type: String },
    alt: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
  },
  
  // SEO
  seo: {
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    focusKeyword: { type: String, required: true },
    secondaryKeywords: [{ type: String }],
    canonicalUrl: { type: String },
    ogTitle: { type: String },
    ogDescription: { type: String },
    ogImage: { type: String },
    twitterCard: { type: String, default: 'summary_large_image' },
    twitterTitle: { type: String },
    twitterDescription: { type: String },
    twitterImage: { type: String },
    robots: { type: String, default: 'index, follow' },
    structuredDataType: { type: String, enum: ['Article', 'BlogPosting', 'HowTo', 'FAQPage'], default: 'BlogPosting' },
  },
  
  // Category
  category: {
    id: { type: Schema.Types.ObjectId, ref: 'BlogCategory', required: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
  },
  tags: [{ type: String }],
  
  // AI Summary
  keyTakeaways: [{ type: String }],
  
  // Links
  internalLinks: [InternalLinkSchema],
  outgoingLinkCount: { type: Number, default: 0 },
  incomingLinkCount: { type: Number, default: 0 },
  externalLinks: [ExternalLinkSchema],
  
  // Workflow
  workflow: {
    status: { type: String, enum: ['draft', 'published', 'archived', 'trash'], default: 'draft', index: true },
    creationType: { type: String, enum: ['manual', 'n8n_auto_generated'], required: true },
    aiMetadata: {
      generatedBy: { type: String },
      generationDate: { type: Date },
      modelUsed: { type: String },
      qualityScore: { type: Number },
    },
    publishedAt: { type: Date },
    lastModifiedAt: { type: Date },
    trashedAt: { type: Date },
  },
  
  // SEO Metrics
  seoMetrics: {
    wordCount: { type: Number, default: 0 },
    readingTime: { type: Number, default: 0 },
    headingStructure: {
      h1Count: { type: Number, default: 0 },
      h2Count: { type: Number, default: 0 },
      h3Count: { type: Number, default: 0 },
    },
    internalLinkDensity: { type: Number, default: 0 },
    externalLinkDensity: { type: Number, default: 0 },
    imagesCount: { type: Number, default: 0 },
    imagesWithAlt: { type: Number, default: 0 },
    lastCalculated: { type: Date, default: Date.now },
  },
  
  // Flags
  flags: {
    isFeatured: { type: Boolean, default: false },
    isEvergreen: { type: Boolean, default: false },
    needsUpdate: { type: Boolean, default: false },
  },
  
  // Notifications
  notifications: [{
    type: { type: String, enum: ['broken_link', 'missing_image', 'seo_warning', 'trash_expiring'] },
    message: { type: String },
    severity: { type: String, enum: ['info', 'warning', 'critical'] },
    isResolved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  }],
  
  // Audit
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// ============ INDEXES ============

// NOTE: slug unique index is already created by `unique: true` on the schema field.
// Do NOT add BlogSchema.index({ slug: 1 }) here — it creates a duplicate warning.

// Compound query indexes
BlogSchema.index({ 'workflow.status': 1, 'workflow.publishedAt': -1 });
BlogSchema.index({ 'category.slug': 1, 'workflow.status': 1 });
BlogSchema.index({ 'workflow.status': 1, 'flags.isFeatured': 1 });

// Full-text search
BlogSchema.index({ 
  title: 'text', 
  excerpt: 'text', 
  'seo.metaTitle': 'text',
  tags: 'text'
});

// Admin filters
BlogSchema.index({ 'workflow.creationType': 1, 'workflow.status': 1 });
BlogSchema.index({ 'workflow.trashedAt': 1 }); // For auto-cleanup

// Prevent mongoose model caching in development (hot-reload issue)
if (process.env.NODE_ENV !== 'production') {
  delete mongoose.models.Blog;
}

const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;
