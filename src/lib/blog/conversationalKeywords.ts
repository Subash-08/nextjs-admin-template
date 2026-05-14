export const conversationalPhrases = [
  // Question words
  'how to',
  'what is',
  'why is',
  'when should',
  'where can',
  'who is',
  'which is',
  
  // Voice search patterns
  'best way to',
  'easiest way to',
  'fastest way to',
  'cheapest way to',
  'how do I',
  'how can I',
  'should I',
  'can I',
  'will I',
  
  // Local
  'near me',
  'in my area',
  'close by',
  'nearby',
  
  // Comparison
  'vs',
  'versus',
  'compared to',
  'difference between',
  'better than',
];

export function analyzeConversationalOptimization(content: string): {
  score: number;
  suggestions: string[];
} {
  if (!content) return { score: 0, suggestions: [] };
  
  const contentLower = content.toLowerCase();
  let matches = 0;
  const suggestions: string[] = [];

  conversationalPhrases.forEach((phrase) => {
    if (contentLower.includes(phrase)) {
      matches++;
    }
  });

  const score = Math.min(Math.round((matches / 5) * 100), 100);

  if (score < 60) {
    suggestions.push('Add more conversational question phrases (how to, what is, etc.)');
  }

  if (!contentLower.includes('?')) {
    suggestions.push('Include questions in headings to match voice search queries');
  }

  if (!contentLower.includes('step')) {
    suggestions.push('Consider adding step-by-step instructions for better voice search visibility');
  }

  return { score, suggestions };
}
