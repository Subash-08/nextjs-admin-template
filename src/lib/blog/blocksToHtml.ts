import type { IContentBlock } from '@/models/Blog';

export function renderBlocksToHtml(blocks: IContentBlock[]): string {
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);
  
  let html = '';
  for (let i = 0; i < sortedBlocks.length; i++) {
    const block = sortedBlocks[i];
    
    // Group adjacent FAQ blocks into an accordion
    if (block.type === 'faq') {
      const faqGroup = [block];
      // Look ahead for consecutive faq blocks
      while (i + 1 < sortedBlocks.length && sortedBlocks[i + 1].type === 'faq') {
        faqGroup.push(sortedBlocks[i + 1]);
        i++;
      }
      
      html += `<div class="faq-accordion">\n`;
      faqGroup.forEach((faqBlock) => {
        html += `  <details class="faq-details">\n    <summary class="faq-summary">${faqBlock.question || ''}</summary>\n    <div class="faq-answer">${faqBlock.answer || ''}</div>\n  </details>\n`;
      });
      html += `</div>\n`;
      continue;
    }

    html += renderBlock(block) + '\n';
  }
  
  return html.trim();
}

function renderBlock(block: IContentBlock): string {
  switch (block.type) {
    case 'h2':
      return `<h2 id="${block.anchorId || slugify(block.content || '')}">${block.content || ''}</h2>`;

    case 'h3':
      return `<h3 id="${block.anchorId || slugify(block.content || '')}">${block.content || ''}</h3>`;

    case 'paragraph':
      return `<p>${block.content || ''}</p>`;

    case 'list': {
      const tag = block.listType === 'ordered' ? 'ol' : 'ul';
      const items = (block.listItems || [])
        .map((item) => `  <li>${item}</li>`)
        .join('\n');
      return `<${tag}>\n${items}\n</${tag}>`;
    }

    case 'image': {
      const caption = block.imageCaption
        ? `<figcaption>${escapeHtml(block.imageCaption)}</figcaption>`
        : '';
      return `<figure>\n  <img src="${block.imageUrl || ''}" alt="${escapeHtml(block.imageAlt || '')}" loading="lazy" />\n  ${caption}\n</figure>`;
    }

    case 'code':
      return `<pre><code class="language-${block.codeLanguage || 'plaintext'}">${escapeHtml(block.codeContent || '')}</code></pre>`;

    case 'quote':
      return `<blockquote><p>${block.content || ''}</p></blockquote>`;

    case 'video':
      return `<div class="video-container">\n  <iframe src="${block.videoUrl || ''}" frameborder="0" allowfullscreen loading="lazy"></iframe>\n</div>`;

    case 'faq':
      // This case is handled in the main loop above to allow grouping, 
      // but keeping it here as a fallback just in case renderBlock is called individually.
      return `<div class="faq-accordion"><details class="faq-details"><summary class="faq-summary">${block.question || ''}</summary><div class="faq-answer">${block.answer || ''}</div></details></div>`;

    case 'cta':
      return `<div class="cta">\n  <a href="${block.ctaLink || '#'}" rel="noopener noreferrer">${block.ctaText || 'Learn More'}</a>\n</div>`;

    case 'spacer':
      return '<hr />';

    default:
      return '';
  }
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
