import Blog from '@/models/Blog';
import Project from '@/models/Project';
import dbConnect from '@/lib/dbConnect';
import type { IContentBlock } from '@/types/blog';

interface LinkSuggestion {
  targetSlug: string;
  targetTitle: string;
  targetType: 'blog' | 'project';
  anchorText: string;
  relevanceScore: number;
  contextSnippet: string;
}

export async function generateInternalLinkSuggestions(
  blogId: string,
  contentBlocks: IContentBlock[],
  currentSlug?: string
): Promise<LinkSuggestion[]> {
  await dbConnect();

  // Extract keywords from content
  const contentText = contentBlocks
    .filter((b) => ['paragraph', 'h2', 'h3'].includes(b.type))
    .map((b) => b.content?.replace(/<[^>]*>/g, ''))
    .join(' ');

  const keywords = extractKeywords(contentText);

  if (keywords.length === 0) {
    return [];
  }

  // Find related blogs
  const relatedBlogs = await Blog.find({
    _id: { $ne: blogId !== 'new' ? blogId : null },
    'workflow.status': 'published',
    $or: [
      { tags: { $in: keywords } },
      { 'seo.focusKeyword': { $in: keywords } },
      { title: { $regex: keywords.join('|'), $options: 'i' } },
    ],
  })
    .select('slug title tags seo.focusKeyword')
    .limit(10)
    .lean();

  // Find related projects
  const relatedProjects = await Project.find({
    status: 'published',
    $or: [
      { tags: { $in: keywords } },
      { title: { $regex: keywords.join('|'), $options: 'i' } },
    ],
  })
    .select('slug title tags')
    .limit(5)
    .lean();

  const suggestions: LinkSuggestion[] = [];

  // Generate suggestions from blogs
  relatedBlogs.forEach((blog) => {
    if (blog._id && blog._id.toString() === blogId) return; // Exclude current blog by ID
    if (currentSlug && blog.slug === currentSlug) return; // Exclude current blog by slug

    const matchingKeywords = keywords.filter(
      (k) =>
        (blog.tags && blog.tags.includes(k)) ||
        (blog.seo?.focusKeyword && blog.seo.focusKeyword.toLowerCase().includes(k.toLowerCase()))
    );

    if (matchingKeywords.length > 0) {
      suggestions.push({
        targetSlug: blog.slug,
        targetTitle: blog.title,
        targetType: 'blog',
        anchorText: matchingKeywords[0],
        relevanceScore: matchingKeywords.length / keywords.length,
        contextSnippet: `Link to "${blog.title}" when discussing ${matchingKeywords[0]}`,
      });
    }
  });

  // Generate suggestions from projects
  relatedProjects.forEach((project) => {
    const matchingKeywords = keywords.filter((k) =>
      project.tags?.includes(k)
    );

    if (matchingKeywords.length > 0) {
      suggestions.push({
        targetSlug: project.slug,
        targetTitle: project.title,
        targetType: 'project',
        anchorText: matchingKeywords[0],
        relevanceScore: matchingKeywords.length / keywords.length,
        contextSnippet: `Link to project "${project.title}" as a case study`,
      });
    }
  });

  return suggestions.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 10);
}

function extractKeywords(text: string): string[] {
  if (!text) return [];
  // Simple keyword extraction (can be enhanced with NLP)
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 4); // Filter short words

  // List of common generic words that shouldn't trigger links
  const stopWords = new Set([
    'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves',
    // Generic nouns/verbs
    'guide', 'complete', 'post', 'blog', 'article', 'read', 'learn', 'make', 'create', 'using', 'using', 'will', 'also', 'first', 'second', 'third', 'last', 'time', 'people', 'years', 'way', 'well', 'much', 'even', 'new', 'want', 'need', 'good', 'great', 'best', 'know', 'take', 'see', 'come', 'think', 'look', 'give', 'use', 'find', 'tell', 'ask', 'work', 'seem', 'feel', 'try', 'leave', 'call'
  ]);

  const filteredWords = words.filter(w => !stopWords.has(w));

  const frequency: Record<string, number> = {};
  filteredWords.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}
