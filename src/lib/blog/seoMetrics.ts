import type { IContentBlock } from '@/models/Blog';

export function calculateSEOMetrics(blocks: IContentBlock[]) {
  let wordCount = 0;
  let h1Count = 0;
  let h2Count = 0;
  let h3Count = 0;
  let imagesCount = 0;
  let imagesWithAlt = 0;

  blocks.forEach(block => {
    // Count headings
    if (block.type === 'h2') h2Count++;
    if (block.type === 'h3') h3Count++;

    // Count words (in text blocks)
    if (['h2', 'h3', 'paragraph', 'quote'].includes(block.type) && block.content) {
      const text = stripHtml(block.content);
      wordCount += text.split(/\s+/).filter(word => word.length > 0).length;
    }

    // Count list items
    if (block.type === 'list' && block.listItems) {
      block.listItems.forEach(item => {
        const text = stripHtml(item);
        wordCount += text.split(/\s+/).filter(word => word.length > 0).length;
      });
    }

    // Count FAQ
    if (block.type === 'faq') {
      if (block.question) {
        wordCount += block.question.split(/\s+/).length;
      }
      if (block.answer) {
        wordCount += block.answer.split(/\s+/).length;
      }
    }

    // Count images
    if (block.type === 'image') {
      imagesCount++;
      if (block.imageAlt && block.imageAlt.trim().length > 0) {
        imagesWithAlt++;
      }
    }
  });

  // Calculate reading time (average 200 words per minute)
  const readingTime = Math.ceil(wordCount / 200);

  // Calculate link density (will be updated when links are added)
  const internalLinkDensity = 0; // Placeholder
  const externalLinkDensity = 0; // Placeholder

  return {
    wordCount,
    readingTime,
    headingStructure: {
      h1Count, // Title counts as H1
      h2Count,
      h3Count,
    },
    internalLinkDensity,
    externalLinkDensity,
    imagesCount,
    imagesWithAlt,
    lastCalculated: new Date(),
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}
