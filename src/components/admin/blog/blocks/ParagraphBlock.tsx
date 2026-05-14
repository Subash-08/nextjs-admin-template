'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, Link as LinkIcon, Unlink, ExternalLink,
  Search, BookOpen, Globe, Loader2, ChevronRight, X,
} from 'lucide-react';
import type { IContentBlock } from '@/types/blog';
import {
  searchBlogsForLinkAction,
  getRecentPublishedBlogsAction,
} from '@/actions/blog.actions';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  block: IContentBlock;
  onUpdate: (updates: Partial<IContentBlock>) => void;
}

interface BlogResult {
  _id: string;
  title: string;
  slug: string;
  category: { name: string };
}

type LinkTab = 'blogs' | 'custom';

// ── Component ─────────────────────────────────────────────────────────────────

export default function ParagraphBlock({ block, onUpdate }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [activeTab, setActiveTab] = useState<LinkTab>('blogs');

  // Blog browser state
  const [blogSearch, setBlogSearch] = useState('');
  const [blogResults, setBlogResults] = useState<BlogResult[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  // Custom URL state
  const [customUrl, setCustomUrl] = useState('');
  const [customAnchor, setCustomAnchor] = useState('');
  const [customNofollow, setCustomNofollow] = useState(false);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const customUrlRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // ── Editor setup ───────────────────────────────────────────────────────────

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: { HTMLAttributes: { class: 'list-disc pl-6' } },
        orderedList: { HTMLAttributes: { class: 'list-decimal pl-6' } },
        code: { HTMLAttributes: { class: 'bg-gray-100 px-1 py-0.5 rounded text-sm font-mono' } },
        blockquote: { HTMLAttributes: { class: 'border-l-4 border-gray-300 pl-4 italic my-2' } },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800 cursor-pointer',
        },
      }),
      Placeholder.configure({ placeholder: 'Write paragraph content...' }),
    ],
    content: block.content || '',
    onUpdate: ({ editor }) => {
      onUpdate({ content: editor.getHTML() });
    },
    editorProps: {
      attributes: { class: 'prose prose-sm focus:outline-none min-h-[80px] px-4 py-3' },
    },
  });

  const isLinkActive = editor?.isActive('link') || false;

  // ── Open picker ────────────────────────────────────────────────────────────

  const openPicker = useCallback(() => {
    if (!editor) return;
    const existingHref = editor.getAttributes('link').href;
    const existingRel = editor.getAttributes('link').rel || '';
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, '');

    setIsEditingExisting(!!existingHref);
    setCustomUrl(existingHref || '');
    setCustomAnchor(selectedText);
    setCustomNofollow(existingRel.includes('nofollow'));

    // Decide starting tab: if editing existing non-blog link, show custom tab
    if (existingHref && !existingHref.startsWith('/blog/')) {
      setActiveTab('custom');
    } else {
      setActiveTab('blogs');
    }

    setPickerOpen(true);
    setBlogSearch('');
  }, [editor]);

  // Load recent blogs when picker opens on "blogs" tab
  useEffect(() => {
    if (!pickerOpen) return;
    if (initialLoaded) return;
    setLoadingBlogs(true);
    getRecentPublishedBlogsAction().then((res) => {
      setBlogResults(res.data || []);
      setLoadingBlogs(false);
      setInitialLoaded(true);
    });
  }, [pickerOpen, initialLoaded]);

  // Focus correct input when tab changes
  useEffect(() => {
    if (!pickerOpen) return;
    if (activeTab === 'blogs') {
      setTimeout(() => searchRef.current?.focus(), 80);
    } else {
      setTimeout(() => customUrlRef.current?.focus(), 80);
    }
  }, [activeTab, pickerOpen]);

  // ── Blog search ────────────────────────────────────────────────────────────

  const handleBlogSearch = (value: string) => {
    setBlogSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (value.trim().length === 0) {
      // Reset to recent blogs
      setLoadingBlogs(true);
      getRecentPublishedBlogsAction().then((res) => {
        setBlogResults(res.data || []);
        setLoadingBlogs(false);
      });
      return;
    }
    setLoadingBlogs(true);
    searchTimer.current = setTimeout(async () => {
      const res = await searchBlogsForLinkAction(value);
      setBlogResults(res.data || []);
      setLoadingBlogs(false);
    }, 320);
  };

  // ── Apply link from blog picker ────────────────────────────────────────────

  const applyBlogLink = (blog: BlogResult) => {
    if (!editor) return;
    const href = `/blog/${blog.slug}`;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, '');

    editor.chain().focus().setLink({ href, rel: 'noopener noreferrer' }).run();

    // If nothing was selected, insert the title as link text
    if (from === to) {
      editor.chain().focus().insertContent(`<a href="${href}">${blog.title}</a>`).run();
    }

    setPickerOpen(false);
    resetPickerState();
  };

  // ── Apply custom URL ───────────────────────────────────────────────────────

  const applyCustomLink = () => {
    if (!editor) return;
    const raw = customUrl.trim();
    if (!raw) return;

    const href = raw.startsWith('http') || raw.startsWith('/') || raw.startsWith('#')
      ? raw : `https://${raw}`;

    const rel = customNofollow ? 'noopener noreferrer nofollow' : 'noopener noreferrer';
    editor.chain().focus().setLink({ href, rel }).run();

    // Insert text if selection was empty and anchor provided
    const { from, to } = editor.state.selection;
    if (from === to && customAnchor.trim()) {
      editor.chain().focus().insertContent(`<a href="${href}">${customAnchor.trim()}</a>`).run();
    }

    setPickerOpen(false);
    resetPickerState();
  };

  const removeLink = () => {
    editor?.chain().focus().unsetLink().run();
    setPickerOpen(false);
    resetPickerState();
  };

  const resetPickerState = () => {
    setCustomUrl('');
    setCustomAnchor('');
    setCustomNofollow(false);
    setBlogSearch('');
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-1 w-full">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Paragraph</div>

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-gray-50">
          <ToolbarBtn
            onClick={() => editor?.chain().focus().toggleBold().run()}
            active={editor?.isActive('bold')}
            title="Bold"
          >
            <Bold size={13} />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            active={editor?.isActive('italic')}
            title="Italic"
          >
            <Italic size={13} />
          </ToolbarBtn>

          <div className="w-px h-4 bg-gray-200 mx-1" />

          {/* Link button */}
          <ToolbarBtn
            onClick={openPicker}
            active={isLinkActive || pickerOpen}
            title={isLinkActive ? 'Edit link' : 'Insert link'}
            className={isLinkActive ? 'text-blue-600 bg-blue-50' : ''}
          >
            <LinkIcon size={13} />
          </ToolbarBtn>

          {isLinkActive && (
            <>
              <ToolbarBtn onClick={removeLink} title="Remove link" className="text-red-500 hover:bg-red-50">
                <Unlink size={13} />
              </ToolbarBtn>
              <a
                href={editor?.getAttributes('link').href}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink size={11} />
              </a>
            </>
          )}
        </div>

        <EditorContent editor={editor} />
      </div>

      {/* ── Link Picker ──────────────────────────────────────────────────── */}
      {pickerOpen && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden animate-in slide-in-from-top-2 duration-150">
          {/* Picker header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-sm font-semibold text-gray-800">
              {isEditingExisting ? 'Edit Link' : 'Insert Link'}
            </p>
            <button
              type="button"
              onClick={() => { setPickerOpen(false); resetPickerState(); }}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Tab switcher */}
          <div className="flex border-b border-gray-100">
            <TabBtn active={activeTab === 'blogs'} onClick={() => setActiveTab('blogs')}>
              <BookOpen size={13} /> My Blog Posts
            </TabBtn>
            <TabBtn active={activeTab === 'custom'} onClick={() => setActiveTab('custom')}>
              <Globe size={13} /> Custom URL
            </TabBtn>
          </div>

          {/* ── BLOGS TAB ─────────────────────────────────────────────────── */}
          {activeTab === 'blogs' && (
            <div className="p-3 space-y-2">
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  ref={searchRef}
                  type="text"
                  value={blogSearch}
                  onChange={(e) => handleBlogSearch(e.target.value)}
                  placeholder="Search blog posts by title or topic..."
                  className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
                {loadingBlogs && (
                  <Loader2 size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
                )}
              </div>

              {/* Blog list */}
              <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-100 divide-y divide-gray-100">
                {blogResults.length === 0 && !loadingBlogs ? (
                  <div className="py-8 text-center text-sm text-gray-400">
                    {blogSearch ? 'No posts match your search' : 'No published blog posts yet'}
                  </div>
                ) : (
                  blogResults.map((blog) => (
                    <button
                      key={blog._id}
                      type="button"
                      onClick={() => applyBlogLink(blog)}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-blue-50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-700">
                          {blog.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                            {blog.category.name}
                          </span>
                          <span className="text-xs text-gray-400 font-mono truncate">
                            /blog/{blog.slug}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500 shrink-0 transition-colors" />
                    </button>
                  ))
                )}
              </div>

              <p className="text-xs text-gray-400 px-1">
                Click any post to insert an internal link. Only published posts are shown.
              </p>
            </div>
          )}

          {/* ── CUSTOM URL TAB ─────────────────────────────────────────────── */}
          {activeTab === 'custom' && (
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">URL *</label>
                <input
                  ref={customUrlRef}
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') applyCustomLink(); }}
                  placeholder="https://example.com  or  /blog/my-post  or  #section"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Anchor Text <span className="text-gray-400 font-normal">(optional — uses selection if empty)</span>
                </label>
                <input
                  type="text"
                  value={customAnchor}
                  onChange={(e) => setCustomAnchor(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') applyCustomLink(); }}
                  placeholder="Descriptive link text..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={customNofollow}
                  onChange={(e) => setCustomNofollow(e.target.checked)}
                  className="rounded"
                />
                <span className="text-xs text-gray-600">
                  Add <code className="bg-gray-100 px-1 rounded font-mono">rel="nofollow"</code>
                  <span className="text-gray-400"> — for sponsored / affiliate links</span>
                </span>
              </label>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={applyCustomLink}
                  disabled={!customUrl.trim()}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors"
                >
                  {isEditingExisting ? 'Update Link' : 'Insert Link'}
                </button>
                {isEditingExisting && (
                  <button
                    type="button"
                    onClick={removeLink}
                    className="px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => { setPickerOpen(false); resetPickerState(); }}
                  className="px-4 py-2 text-gray-500 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function ToolbarBtn({
  children, onClick, active, title, className = '',
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  title?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded text-sm transition-colors ${
        active ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      } ${className}`}
    >
      {children}
    </button>
  );
}

function TabBtn({
  children, active, onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
        active
          ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );
}
