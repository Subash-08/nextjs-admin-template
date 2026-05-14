import type { IContentBlock } from '@/types/blog';

interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(blocks: IContentBlock[]): FAQItem[] {
  const faqs: FAQItem[] = [];

  if (!blocks || !Array.isArray(blocks)) return faqs;

  // Extract FAQ blocks
  blocks.forEach((block) => {
    if (block.type === 'faq' && block.content) {
        // Based on blocksToHtml, FAQ might be an array in content or a structured object
        try {
            const faqItems = typeof block.content === 'string' ? JSON.parse(block.content) : block.content;
            if (Array.isArray(faqItems)) {
                faqItems.forEach(item => {
                    if (item.question && item.answer) {
                        faqs.push({
                            question: stripHtml(item.question),
                            answer: stripHtml(item.answer)
                        });
                    }
                });
            }
        } catch(e) {}
    }
  });

  // Auto-detect question patterns in H2/H3
  blocks.forEach((block, index) => {
    if ((block.type === 'h2' || block.type === 'h3') && block.content) {
      const text = stripHtml(block.content);
      
      // Check if it's a question
      if (text.includes('?') || /^(what|how|why|when|where|who|can|is|are|do|does)/i.test(text)) {
        // Find the next paragraph as answer
        const nextBlock = blocks[index + 1];
        if (nextBlock && nextBlock.type === 'paragraph' && nextBlock.content) {
          faqs.push({
            question: text,
            answer: stripHtml(nextBlock.content),
          });
        }
      }
    }
  });

  return faqs;
}

function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}
