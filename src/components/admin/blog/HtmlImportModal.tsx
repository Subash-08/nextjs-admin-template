'use client';

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Code2, Eye, Import } from 'lucide-react';
import type { IContentBlock } from '@/types/blog';

interface Props {
  onImport: (blocks: IContentBlock[]) => void;
  onClose: () => void;
}

// Tags we silently recurse into without creating a block
const WRAPPER_TAGS = new Set([
  'div', 'section', 'article', 'main', 'header', 'footer',
  'nav', 'aside', 'figure', 'figcaption', 'body',
]);

/**
 * Parse pasted HTML into IContentBlock array.
 * Maps h1-h6 → h2/h3, handles nested wrapper elements recursively.
 * Uses IContentBlock field names: listItems (not items), imageUrl, etc.
 */
function parseHtmlToBlocks(html: string): IContentBlock[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const blocks: IContentBlock[] = [];

  const processNode = (node: Element) => {
    const tag = node.tagName?.toLowerCase();
    if (!tag) return;

    // ── Headings: map everything to h2 or h3 ──────────────────────────
    if (['h1', 'h2'].includes(tag)) {
      const text = node.textContent?.trim() || '';
      if (text) {
        blocks.push({
          id: uuidv4(),
          type: 'h2',
          order: blocks.length,
          content: text,
          anchorId: text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        });
      }
      return;
    }

    if (['h3', 'h4', 'h5', 'h6'].includes(tag)) {
      const text = node.textContent?.trim() || '';
      if (text) {
        blocks.push({
          id: uuidv4(),
          type: 'h3',
          order: blocks.length,
          content: text,
          anchorId: text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        });
      }
      return;
    }

    // ── Paragraph ──────────────────────────────────────────────────────
    if (tag === 'p') {
      const text = node.textContent?.trim() || '';
      if (text) {
        blocks.push({
          id: uuidv4(),
          type: 'paragraph',
          order: blocks.length,
          content: node.innerHTML.trim(),
        });
      }
      return;
    }

    // ── Unordered list ────────────────────────────────────────────────
    if (tag === 'ul') {
      const listItems = Array.from(node.querySelectorAll(':scope > li'))
        .map((li) => li.textContent?.trim() || '')
        .filter(Boolean);
      if (listItems.length > 0) {
        blocks.push({
          id: uuidv4(),
          type: 'list',
          order: blocks.length,
          listType: 'unordered',
          listItems,
        });
      }
      return;
    }

    // ── Ordered list ──────────────────────────────────────────────────
    if (tag === 'ol') {
      const listItems = Array.from(node.querySelectorAll(':scope > li'))
        .map((li) => li.textContent?.trim() || '')
        .filter(Boolean);
      if (listItems.length > 0) {
        blocks.push({
          id: uuidv4(),
          type: 'list',
          order: blocks.length,
          listType: 'ordered',
          listItems,
        });
      }
      return;
    }

    // ── Blockquote ────────────────────────────────────────────────────
    if (tag === 'blockquote') {
      const text = node.textContent?.trim() || '';
      if (text) {
        blocks.push({
          id: uuidv4(),
          type: 'quote',
          order: blocks.length,
          content: text,
        });
      }
      return;
    }

    // ── Code block ────────────────────────────────────────────────────
    if (tag === 'pre') {
      const codeEl = node.querySelector('code');
      const text = codeEl?.textContent?.trim() || node.textContent?.trim() || '';
      if (text) {
        blocks.push({
          id: uuidv4(),
          type: 'code',
          order: blocks.length,
          codeContent: text,
          codeLanguage: 'javascript',
        });
      }
      return;
    }

    // ── Standalone img ────────────────────────────────────────────────
    if (tag === 'img') {
      const src = node.getAttribute('src');
      if (src) {
        blocks.push({
          id: uuidv4(),
          type: 'image',
          order: blocks.length,
          imageUrl: src,
          imageAlt: node.getAttribute('alt') || '',
          imageCaption: '',
        });
      }
      return;
    }

    // ── Wrapper: recurse into children ────────────────────────────────
    if (WRAPPER_TAGS.has(tag)) {
      // Extract img directly inside figure before recursing paragraphs
      if (tag === 'figure') {
        const img = node.querySelector('img');
        if (img) {
          const caption = node.querySelector('figcaption')?.textContent?.trim() || '';
          blocks.push({
            id: uuidv4(),
            type: 'image',
            order: blocks.length,
            imageUrl: img.getAttribute('src') || '',
            imageAlt: img.getAttribute('alt') || '',
            imageCaption: caption,
          });
          return; // Don't also recurse figcaption as paragraph
        }
      }
      Array.from(node.children).forEach(processNode);
    }
    // Everything else (span, time, abbr, etc.) is silently ignored
  };

  Array.from(doc.body.children).forEach(processNode);
  return blocks;
}


export default function HtmlImportModal({ onImport, onClose }: Props) {
  const [html, setHtml] = useState('');
  const [preview, setPreview] = useState(false);
  const [parsedBlocks, setParsedBlocks] = useState<IContentBlock[]>([]);
  const [error, setError] = useState('');

  const handleParse = useCallback(() => {
    setError('');
    if (!html.trim()) {
      setError('Please paste some HTML first');
      return;
    }
    try {
      const blocks = parseHtmlToBlocks(html);
      if (blocks.length === 0) {
        setError('No supported elements found in the HTML. Try pasting structured content with <p>, <h2>, <ul>, <blockquote>, etc.');
        return;
      }
      setParsedBlocks(blocks);
      setPreview(true);
    } catch (e) {
      setError('Failed to parse HTML. Please check the input.');
    }
  }, [html]);

  const handleImport = () => {
    if (parsedBlocks.length === 0) return;
    onImport(parsedBlocks);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              <Code2 size={20} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Import HTML</h2>
              <p className="text-sm text-gray-500">Paste HTML and convert it to editable blocks</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!preview ? (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste your HTML here
              </label>
              <textarea
                className="w-full h-72 px-4 py-3 font-mono text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none bg-gray-50"
                placeholder={`<h2>My Blog Heading</h2>\n<p>A paragraph of content...</p>\n<ul>\n  <li>Item one</li>\n  <li>Item two</li>\n</ul>\n<blockquote>A great quote</blockquote>`}
                value={html}
                onChange={(e) => setHtml(e.target.value)}
              />

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
                <strong>Supported elements:</strong> h1–h6, p, ul/ol, blockquote, pre/code, img
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">
                  Preview — <span className="text-violet-600 font-bold">{parsedBlocks.length} blocks</span> detected
                </p>
                <button
                  onClick={() => { setPreview(false); setParsedBlocks([]); }}
                  className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"
                >
                  ← Edit HTML
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {parsedBlocks.map((block) => {
                  const typeColor = 
                    block.type === 'h2' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                    block.type === 'h3' ? 'text-indigo-600 bg-indigo-50 border-indigo-200' :
                    block.type === 'quote' ? 'text-amber-600 bg-amber-50 border-amber-200' :
                    block.type === 'image' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                    block.type === 'list' ? 'text-violet-600 bg-violet-50 border-violet-200' :
                    block.type === 'code' ? 'text-rose-600 bg-rose-50 border-rose-200' :
                    'text-gray-600 bg-gray-50 border-gray-200';
                  return (
                    <div key={block.id} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-200">
                      <span className={`text-xs font-bold mt-0.5 px-2 py-0.5 rounded border shrink-0 uppercase ${typeColor}`}>
                        {block.type}
                      </span>
                      <div className="flex-1 text-sm text-gray-700 overflow-hidden">
                        {block.type === 'image' ? (
                          <span className="text-blue-600 truncate block text-xs font-mono">{block.imageUrl}</span>
                        ) : block.type === 'list' ? (
                          <ul className="list-disc pl-4 space-y-0.5">
                            {(block.listItems || []).map((item, j) => <li key={j} className="line-clamp-1">{item}</li>)}
                          </ul>
                        ) : block.type === 'code' ? (
                          <pre className="text-xs bg-gray-100 px-2 py-1 rounded overflow-hidden line-clamp-2">{block.codeContent}</pre>
                        ) : (
                          <p className="line-clamp-2" dangerouslySetInnerHTML={{ __html: block.content || '' }} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>

          {!preview ? (
            <button
              onClick={handleParse}
              disabled={!html.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50"
            >
              <Eye size={16} />
              Preview Blocks
            </button>
          ) : (
            <button
              onClick={handleImport}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Import size={16} />
              Import {parsedBlocks.length} Blocks
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
