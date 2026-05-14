import { load } from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import type { IContentBlock } from '@/models/Blog';
import { slugify } from './slugify';

export function parseHtmlToBlocks(html: string): IContentBlock[] {
  const $ = load(html);
  const blocks: IContentBlock[] = [];
  let order = 0;

  // Parse each element
  $('body > *').each((i, elem) => {
    const $elem = $(elem);
    const tagName = elem.tagName.toLowerCase();

    // H2 Heading
    if (tagName === 'h2') {
      const content = $elem.html() || '';
      const anchorId = $elem.attr('id') || slugify($elem.text());
      
      blocks.push({
        id: uuidv4(),
        type: 'h2',
        order: order++,
        content,
        anchorId,
      });
    }

    // H3 Heading
    else if (tagName === 'h3') {
      const content = $elem.html() || '';
      const anchorId = $elem.attr('id') || slugify($elem.text());
      
      blocks.push({
        id: uuidv4(),
        type: 'h3',
        order: order++,
        content,
        anchorId,
      });
    }

    // Paragraph
    else if (tagName === 'p') {
      const content = $elem.html() || '';
      
      // Skip empty paragraphs
      if (content.trim().length > 0) {
        blocks.push({
          id: uuidv4(),
          type: 'paragraph',
          order: order++,
          content,
        });
      }
    }

    // Unordered List
    else if (tagName === 'ul') {
      const listItems: string[] = [];
      $elem.find('li').each((j, li) => {
        listItems.push($(li).html() || '');
      });
      
      blocks.push({
        id: uuidv4(),
        type: 'list',
        order: order++,
        listType: 'unordered',
        listItems,
      });
    }

    // Ordered List
    else if (tagName === 'ol') {
      const listItems: string[] = [];
      $elem.find('li').each((j, li) => {
        listItems.push($(li).html() || '');
      });
      
      blocks.push({
        id: uuidv4(),
        type: 'list',
        order: order++,
        listType: 'ordered',
        listItems,
      });
    }

    // Image
    else if (tagName === 'img') {
      blocks.push({
        id: uuidv4(),
        type: 'image',
        order: order++,
        imageUrl: $elem.attr('src') || '',
        imageAlt: $elem.attr('alt') || '',
        imageWidth: parseInt($elem.attr('width') || '0') || undefined,
        imageHeight: parseInt($elem.attr('height') || '0') || undefined,
      });
    }

    // Blockquote
    else if (tagName === 'blockquote') {
      const content = $elem.html() || '';
      
      blocks.push({
        id: uuidv4(),
        type: 'quote',
        order: order++,
        content,
      });
    }

    // Code block
    else if (tagName === 'pre') {
      const $code = $elem.find('code');
      const codeContent = $code.text() || $elem.text();
      const codeLanguage = $code.attr('class')?.replace('language-', '') || 'plaintext';
      
      blocks.push({
        id: uuidv4(),
        type: 'code',
        order: order++,
        codeLanguage,
        codeContent,
      });
    }

    // FAQ (custom handling - if n8n wraps in specific structure)
    else if ($elem.hasClass('faq') || $elem.attr('data-type') === 'faq') {
      const question = $elem.find('.faq-question').text() || '';
      const answer = $elem.find('.faq-answer').html() || '';
      
      blocks.push({
        id: uuidv4(),
        type: 'faq',
        order: order++,
        question,
        answer,
      });
    }
  });

  return blocks;
}
