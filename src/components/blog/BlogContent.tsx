'use client';

interface Props {
  html: string;
}

/**
 * Renders blog content HTML with rich, production-quality styling.
 * Uses a scoped .blog-content class so styles don't leak into other parts of the page.
 * Does NOT require @tailwindcss/typography plugin.
 */
export default function BlogContent({ html }: Props) {
  return (
    <>
      <style>{blogContentCss}</style>
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}

const blogContentCss = `
  .blog-content {
    color: #1a202c;
    font-size: 1.0625rem;
    line-height: 1.8;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    max-width: 100%;
    word-wrap: break-word;
  }

  /* ── Headings ─────────────────────────────── */
  .blog-content h1,
  .blog-content h2,
  .blog-content h3,
  .blog-content h4,
  .blog-content h5,
  .blog-content h6 {
    font-weight: 700;
    line-height: 1.3;
    color: #111827;
    margin-top: 2em;
    margin-bottom: 0.6em;
    scroll-margin-top: 6rem;
  }

  .blog-content h1 { font-size: 2rem; }
  .blog-content h2 { font-size: 1.5rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 0.4em; }
  .blog-content h3 { font-size: 1.25rem; }
  .blog-content h4 { font-size: 1.1rem; }

  /* ── Paragraphs ───────────────────────────── */
  .blog-content p {
    margin-top: 0;
    margin-bottom: 1.4em;
    color: #374151;
  }

  /* ── Links ────────────────────────────────── */
  .blog-content a {
    color: #2563eb;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.15s ease, color 0.15s ease;
  }
  .blog-content a:hover {
    color: #1d4ed8;
    border-bottom-color: #1d4ed8;
  }

  /* ── Lists ────────────────────────────────── */
  .blog-content ul,
  .blog-content ol {
    padding-left: 1.6em;
    margin-bottom: 1.4em;
    color: #374151;
  }
  .blog-content ul { list-style-type: disc; }
  .blog-content ol { list-style-type: decimal; }
  .blog-content li {
    margin-bottom: 0.4em;
    line-height: 1.7;
  }
  .blog-content li::marker {
    color: #6b7280;
  }

  /* ── Blockquote ───────────────────────────── */
  .blog-content blockquote {
    border-left: 4px solid #3b82f6;
    background: #eff6ff;
    margin: 2em 0;
    padding: 1em 1.5em;
    border-radius: 0 0.5rem 0.5rem 0;
    font-style: italic;
    color: #1e40af;
    font-size: 1.05em;
    line-height: 1.7;
  }
  .blog-content blockquote p {
    margin: 0;
    color: inherit;
  }

  /* ── Code ─────────────────────────────────── */
  .blog-content code {
    background: #f1f5f9;
    color: #be185d;
    padding: 0.15em 0.45em;
    border-radius: 0.3rem;
    font-size: 0.875em;
    font-family: 'Fira Code', 'Cascadia Code', 'JetBrains Mono', ui-monospace, monospace;
    font-weight: 500;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .blog-content pre {
    background: #0f172a;
    color: #e2e8f0;
    border-radius: 0.75rem;
    padding: 1.25rem 1.5rem;
    overflow-x: auto;
    margin: 1.75em 0;
    font-size: 0.875rem;
    line-height: 1.7;
    border: 1px solid #1e293b;
    position: relative;
  }
  .blog-content pre code {
    background: transparent;
    color: inherit;
    padding: 0;
    font-size: inherit;
    border-radius: 0;
    white-space: pre;
    word-break: normal;
    font-weight: 400;
  }

  /* ── Images & Figures ─────────────────────── */
  .blog-content img {
    max-width: 100%;
    height: auto;
    border-radius: 0.75rem;
    display: block;
    margin: 1.5em auto;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  }
  .blog-content figure {
    margin: 2em 0;
    text-align: center;
  }
  .blog-content figcaption {
    font-size: 0.85rem;
    color: #9ca3af;
    margin-top: 0.5em;
    font-style: italic;
    text-align: center;
  }

  /* ── Tables ───────────────────────────────── */
  .blog-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.75em 0;
    font-size: 0.95em;
    overflow: hidden;
    border-radius: 0.5rem;
    box-shadow: 0 0 0 1px #e5e7eb;
  }
  .blog-content th {
    background: #f9fafb;
    font-weight: 600;
    text-align: left;
    padding: 0.75em 1em;
    border-bottom: 2px solid #e5e7eb;
    color: #374151;
  }
  .blog-content td {
    padding: 0.65em 1em;
    border-bottom: 1px solid #f3f4f6;
    color: #4b5563;
    vertical-align: top;
  }
  .blog-content tr:last-child td { border-bottom: none; }
  .blog-content tr:hover td { background: #fafafa; }

  /* ── Horizontal Rule ──────────────────────── */
  .blog-content hr {
    border: none;
    border-top: 2px solid #f1f5f9;
    margin: 2.5em 0;
  }

  /* ── Strong & Em ──────────────────────────── */
  .blog-content strong { font-weight: 700; color: #111827; }
  .blog-content em { font-style: italic; }

  /* ── FAQ Accordion ────────────────────────── */
  .blog-content .faq-accordion {
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    margin: 1.25em 0;
    overflow: hidden;
    background: #fff;
  }
  .blog-content .faq-details {
    border-bottom: 1px solid #e5e7eb;
  }
  .blog-content .faq-details:last-child {
    border-bottom: none;
  }
  .blog-content .faq-summary {
    font-weight: 600;
    padding: 1.1em 1.25em;
    background: #f9fafb;
    color: #111827;
    font-size: 1rem;
    cursor: pointer;
    list-style: none;
    position: relative;
    padding-right: 2.5rem;
    transition: background 0.15s ease;
  }
  .blog-content .faq-summary:hover {
    background: #f3f4f6;
  }
  /* Custom accordion arrow */
  .blog-content .faq-summary::-webkit-details-marker {
    display: none;
  }
  .blog-content .faq-summary::after {
    content: '+';
    position: absolute;
    right: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    font-weight: 400;
    color: #6b7280;
    transition: transform 0.2s ease, color 0.2s ease;
  }
  .blog-content .faq-details[open] .faq-summary::after {
    content: '−';
    color: #2563eb;
  }
  .blog-content .faq-details[open] .faq-summary {
    border-bottom: 1px solid #e5e7eb;
    background: #fff;
    color: #2563eb;
  }
  .blog-content .faq-details:last-child[open] .faq-summary {
    border-bottom: 1px solid #e5e7eb;
  }
  .blog-content .faq-answer {
    padding: 1.25em;
    color: #4b5563;
    font-size: 0.95em;
    line-height: 1.7;
    background: #fff;
    animation: slideDown 0.2s ease-out forwards;
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ── Video embed ──────────────────────────── */
  .blog-content .video-container {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    margin: 2em 0;
    border-radius: 0.75rem;
    overflow: hidden;
    background: #000;
  }
  .blog-content .video-container iframe {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    border: none;
  }

  /* ── CTA block ────────────────────────────── */
  .blog-content .cta {
    text-align: center;
    margin: 2.5em 0;
    padding: 2em;
    background: linear-gradient(135deg, #eff6ff, #f0fdf4);
    border: 1px solid #bfdbfe;
    border-radius: 1rem;
  }
  .blog-content .cta a {
    display: inline-block;
    background: #2563eb;
    color: #fff;
    padding: 0.75em 2em;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 1rem;
    border: none;
    transition: background 0.2s ease, transform 0.15s ease;
    text-decoration: none;
  }
  .blog-content .cta a:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
    border-bottom: none;
  }

  /* ── First paragraph lead ─────────────────── */
  .blog-content > p:first-child {
    font-size: 1.1em;
    color: #4b5563;
  }

  /* ── Spacing: don't double-margin first child ─ */
  .blog-content > *:first-child { margin-top: 0; }
  .blog-content > *:last-child  { margin-bottom: 0; }
`;
