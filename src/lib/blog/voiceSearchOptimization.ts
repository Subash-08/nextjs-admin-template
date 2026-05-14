import type { IBlog } from '@/types/blog';

export function optimizeForVoiceSearch(blog: Partial<IBlog>): string[] {
  const voiceOptimizations: string[] = [];

  if (!blog.title) return voiceOptimizations;

  // 1. Conversational title
  if (!blog.title.toLowerCase().includes('how') && !blog.title.includes('?')) {
    voiceOptimizations.push(
      'Consider adding conversational language to title (e.g., "How to...", "What is...")'
    );
  }

  // 2. Answer length (voice search prefers 40-60 words)
  const firstParagraph = blog.contentBlocks?.find((b) => b.type === 'paragraph');
  if (firstParagraph && firstParagraph.content) {
    const wordCount = firstParagraph.content.split(/\s+/).length;
    if (wordCount > 60) {
      voiceOptimizations.push(
        'First paragraph too long for voice search (aim for 40-60 words)'
      );
    }
  }

  // 3. Location keywords (important for local voice search)
  const hasLocation = blog.contentBlocks?.some(
    (b) =>
      b.content?.match(
        /\b(near me|in \w+|city|location|local|nearby)\b/i
      )
  );
  if (!hasLocation && blog.tags?.includes('local')) {
    voiceOptimizations.push('Add location keywords for local voice search');
  }

  // 4. Direct answers
  const hasDirectAnswer = blog.contentBlocks?.some(
    (b) => b.type === 'faq' || (b.type === 'h2' && b.content?.includes('?'))
  );
  if (!hasDirectAnswer) {
    voiceOptimizations.push(
      'Add FAQ section with direct answers to common questions'
    );
  }

  return voiceOptimizations;
}
