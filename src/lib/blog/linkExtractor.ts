import { load } from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import type { IInternalLink, IExternalLink } from '@/models/Blog';
import Blog from '@/models/Blog';
import Project from '@/models/Project';

interface ExtractedLinks {
  internalLinks: IInternalLink[];
  externalLinks: IExternalLink[];
}

export async function extractLinksFromHtml(html: string): Promise<ExtractedLinks> {
  const $ = load(html);
  const internalLinks: IInternalLink[] = [];
  const externalLinks: IExternalLink[] = [];

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const baseDomain = new URL(baseUrl).hostname;

  // Find all links
  $('a').each((i, elem) => {
    const $link = $(elem);
    const href = $link.attr('href');
    const anchorText = $link.text().trim();

    if (!href || !anchorText) return;

    try {
      // Check if internal or external
      if (href.startsWith('/') || href.includes(baseDomain)) {
        // Internal link
        const url = new URL(href, baseUrl);
        const pathname = url.pathname;

        // Extract slug and determine type
        const { targetType, targetSlug } = parseInternalUrl(pathname);

        if (targetType && targetSlug) {
          internalLinks.push({
            linkId: uuidv4(),
            targetType: targetType as IInternalLink['targetType'],
            targetSlug,
            targetTitle: '', // Will be filled by validation
            anchorText,
            isActive: false, // Will be validated
            lastChecked: new Date(),
            createdAt: new Date(),
          });
        }
      } else {
        // External link
        externalLinks.push({
          url: href,
          anchorText,
          isNofollow: $link.attr('rel')?.includes('nofollow') ?? false,
          lastChecked: new Date(),
          isWorking: true, // Assume working initially
        });
      }
    } catch (error) {
      console.error('[LINK_EXTRACTION_ERROR]', error);
    }
  });

  return { internalLinks, externalLinks };
}

export async function extractLinksFromBlocks(blocks: any[]): Promise<ExtractedLinks> {
  let allHtml = '';

  // Combine all block content that might have links
  blocks.forEach(block => {
    if (block.content) {
      allHtml += block.content + '\n';
    }
    if (block.listItems) {
      allHtml += block.listItems.join('\n') + '\n';
    }
    if (block.answer) {
      allHtml += block.answer + '\n';
    }
  });

  return extractLinksFromHtml(allHtml);
}

function parseInternalUrl(pathname: string): { targetType: string | null; targetSlug: string | null } {
  // /blog/slug-here
  if (pathname.startsWith('/blog/')) {
    return {
      targetType: 'blog',
      targetSlug: pathname.replace('/blog/', '').split('?')[0],
    };
  }

  // /works/slug-here or /projects/slug-here
  if (pathname.startsWith('/works/') || pathname.startsWith('/projects/')) {
    return {
      targetType: 'project',
      targetSlug: pathname.replace(/^\/(works|projects)\//, '').split('?')[0],
    };
  }

  // /services/slug-here
  if (pathname.startsWith('/services/')) {
    return {
      targetType: 'service',
      targetSlug: pathname.replace('/services/', '').split('?')[0],
    };
  }

  // Other pages
  return {
    targetType: 'static',
    targetSlug: pathname,
  };
}

export async function validateInternalLinks(links: IInternalLink[]): Promise<IInternalLink[]> {
  const validatedLinks: IInternalLink[] = [];

  for (const link of links) {
    let isActive = false;
    let targetTitle = link.anchorText; // Fallback

    try {
      switch (link.targetType) {
        case 'blog': {
          const blog = await Blog.findOne({
            slug: link.targetSlug,
            'workflow.status': { $in: ['published', 'draft'] },
          }).select('title').lean() as { title: string } | null;

          if (blog) {
            isActive = true;
            targetTitle = blog.title;
          }
          break;
        }

        case 'project': {
          const project = await Project.findOne({
            slug: link.targetSlug,
            status: { $in: ['published', 'draft'] },
          }).select('title').lean() as { title: string } | null;

          if (project) {
            isActive = true;
            targetTitle = project.title;
          }
          break;
        }

        case 'service':
        case 'static':
          // Assume static pages exist
          // You can add validation against a static pages registry if needed
          isActive = true;
          break;
      }

      validatedLinks.push({
        ...link,
        targetTitle,
        isActive,
      });
    } catch (error) {
      console.error('[LINK_VALIDATION_ERROR]', link, error);
      validatedLinks.push({
        ...link,
        isActive: false,
      });
    }
  }

  return validatedLinks;
}
