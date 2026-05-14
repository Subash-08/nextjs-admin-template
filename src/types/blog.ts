export type { IBlog, IContentBlock, IInternalLink, IExternalLink } from '@/models/Blog';
export type { IBlogCategory } from '@/models/BlogCategory';

export type BlogStatus = 'draft' | 'published' | 'archived' | 'trash';
export type BlockType = 'h2' | 'h3' | 'paragraph' | 'list' | 'image' | 'code' | 'quote' | 'video' | 'faq' | 'spacer' | 'cta';
export type CreationType = 'manual' | 'n8n_auto_generated';
