import type { IContentBlock } from '@/types/blog';

export interface TOCItem {
  level: 2 | 3;
  text: string;
  anchorId: string;
}

export async function generateTableOfContents(blocks: IContentBlock[]): Promise<TOCItem[]> {
  const toc: TOCItem[] = [];

  blocks.forEach((block) => {
    if ((block.type === 'h2' || block.type === 'h3') && block.content && block.anchorId) {
      toc.push({
        level: block.type === 'h2' ? 2 : 3,
        text: stripHtml(block.content),
        anchorId: block.anchorId,
      });
    }
  });

  return toc;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}
