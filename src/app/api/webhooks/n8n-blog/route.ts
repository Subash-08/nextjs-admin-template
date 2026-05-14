import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { N8nBlogWebhookSchema } from '@/validations/blog.schema';
import { createBlog } from '@/services/blogService';
import { parseHtmlToBlocks } from '@/lib/blog/htmlToBlocks';
import { extractLinksFromBlocks, validateInternalLinks } from '@/lib/blog/linkExtractor';
import { env } from '@/config/env';

export async function POST(req: NextRequest) {
  try {
    // 1. Parse and validate payload
    const body = await req.json();
    const validated = N8nBlogWebhookSchema.parse(body);

    // 2. Verify webhook secret
    if (validated.webhookSecret !== env.N8N_WEBHOOK_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 3. Parse HTML to blocks
    const contentBlocks = parseHtmlToBlocks(validated.contentHtml);

    // 4. Extract and validate internal links
    const { internalLinks: rawLinks, externalLinks } = await extractLinksFromBlocks(contentBlocks);
    const internalLinks = await validateInternalLinks(rawLinks);

    // 5. Count links
    const outgoingLinkCount = internalLinks.length;

    // 6. Create notification for broken links
    const brokenLinks = internalLinks.filter(link => !link.isActive);
    const notifications: Array<{
      type: 'broken_link' | 'missing_image' | 'seo_warning' | 'trash_expiring';
      message: string;
      severity: 'info' | 'warning' | 'critical';
      isResolved: boolean;
      createdAt: Date;
    }> = brokenLinks.length > 0 ? [{
      type: 'broken_link',
      message: `${brokenLinks.length} internal link(s) point to non-existent pages`,
      severity: 'warning',
      isResolved: false,
      createdAt: new Date(),
    }] : [];

    // 7. Create notification for missing featured image
    notifications.push({
      type: 'missing_image',
      message: 'Featured image required before publishing',
      severity: 'critical',
      isResolved: false,
      createdAt: new Date(),
    });

    // 8. Create blog as draft
    const blog = await createBlog({
      title: validated.title,
      slug: validated.slug,
      excerpt: validated.excerpt,
      author: validated.author,
      contentBlocks,
      featuredImage: {
        url: 'https://placeholder.com/placeholder.jpg', // Admin must replace
        publicId: 'placeholder',
        alt: validated.title,
      },
      seo: validated.seo,
      categorySlug: validated.category.slug,
      tags: validated.tags,
      workflow: {
        status: 'draft',
        creationType: 'n8n_auto_generated',
        aiMetadata: {
          generatedBy: validated.aiMetadata.generatedBy,
          generationDate: new Date(validated.aiMetadata.generationDate),
          modelUsed: validated.aiMetadata.modelUsed,
          qualityScore: validated.aiMetadata.qualityScore,
        },
      },
    });

    // 9. Update links and notifications on the saved blog
    await blog.updateOne({
      $set: {
        internalLinks,
        externalLinks,
        outgoingLinkCount,
        notifications,
      },
    });

    // 10. Return success
    return NextResponse.json({
      success: true,
      data: {
        blogId: blog._id,
        slug: blog.slug,
        status: 'draft',
        blocksGenerated: contentBlocks.length,
        internalLinksFound: internalLinks.length,
        externalLinksFound: externalLinks.length,
        message: 'Blog saved as draft. Admin review required.',
        warnings: notifications.map(n => n.message),
      },
    }, { status: 201 });

  } catch (error) {
    console.error('[N8N_WEBHOOK_ERROR]', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
