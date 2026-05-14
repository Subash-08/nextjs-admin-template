import Blog from '@/models/Blog';
import type { IInternalLink } from '@/models/Blog';

/**
 * Update incoming link count for target blog
 */
export async function updateIncomingLinkCount(targetSlug: string, increment: number): Promise<void> {
  await Blog.findOneAndUpdate(
    { slug: targetSlug, 'workflow.status': { $ne: 'trash' } },
    { $inc: { incomingLinkCount: increment } }
  );
}

/**
 * Increment incoming links for all targets when blog is published
 */
export async function incrementIncomingLinks(links: IInternalLink[]): Promise<void> {
  const blogLinks = links.filter(link => link.targetType === 'blog' && link.isActive);

  for (const link of blogLinks) {
    await updateIncomingLinkCount(link.targetSlug, 1);
  }
}

/**
 * Decrement incoming links for all targets when blog is unpublished/deleted
 */
export async function decrementIncomingLinks(links: IInternalLink[]): Promise<void> {
  const blogLinks = links.filter(link => link.targetType === 'blog' && link.isActive);

  for (const link of blogLinks) {
    await updateIncomingLinkCount(link.targetSlug, -1);
  }
}

/**
 * Check for broken links across all published blogs
 */
export async function checkBrokenLinks(): Promise<void> {
  const blogs = await Blog.find({
    'workflow.status': 'published',
    'internalLinks.0': { $exists: true }, // Has at least one link
  });

  for (const blog of blogs) {
    let hasBrokenLinks = false;

    for (const link of blog.internalLinks) {
      if (link.targetType === 'blog') {
        const target = await Blog.findOne({
          slug: link.targetSlug,
          'workflow.status': 'published',
        });

        if (!target) {
          link.isActive = false;
          hasBrokenLinks = true;
        } else {
          link.isActive = true;
        }

        link.lastChecked = new Date();
      }
    }

    if (hasBrokenLinks) {
      // Add or update notification
      const existingNotif = blog.notifications.find(
        (n: any) => n.type === 'broken_link' && !n.isResolved
      );

      if (!existingNotif) {
        blog.notifications.push({
          type: 'broken_link',
          message: 'One or more internal links are broken',
          severity: 'warning',
          isResolved: false,
          createdAt: new Date(),
        });
      }
    } else {
      // Resolve existing broken link notifications
      blog.notifications.forEach((n: any) => {
        if (n.type === 'broken_link') {
          n.isResolved = true;
        }
      });
    }

    await blog.save();
  }

  console.log('✅ Broken link check complete');
}
