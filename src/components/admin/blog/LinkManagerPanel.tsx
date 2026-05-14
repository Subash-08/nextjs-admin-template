'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Link as LinkIcon, ExternalLink, Search, Plus, Trash2,
  Globe, BookOpen, CheckCircle, XCircle, AlertCircle, Loader2,
} from 'lucide-react';
import { searchBlogsForLinkAction, updateBlogLinksAction } from '@/actions/blog.actions';

// ── Types ─────────────────────────────────────────────────────────────────────

interface InternalLink {
  linkId: string;
  targetType: 'blog' | 'project' | 'service' | 'static';
  targetSlug: string;
  targetTitle: string;
  anchorText: string;
  blockId?: string;
  isActive: boolean;
}

interface ExternalLink {
  url: string;
  anchorText: string;
  blockId?: string;
  isNofollow: boolean;
  isWorking: boolean;
}

interface BlogSearchResult {
  _id: string;
  title: string;
  slug: string;
  category: { name: string };
}

interface Props {
  /** The saved blog's MongoDB ID — undefined for unsaved new blogs */
  blogId?: string;
  /** Existing tracked links from initialData */
  initialInternalLinks?: InternalLink[];
  initialExternalLinks?: ExternalLink[];
  /** Called whenever links change so the parent can save them on publish */
  onLinksChange: (internal: InternalLink[], external: ExternalLink[]) => void;
}

type Tab = 'internal' | 'external';

// ── Component ─────────────────────────────────────────────────────────────────

export default function LinkManagerPanel({
  blogId,
  initialInternalLinks = [],
  initialExternalLinks = [],
  onLinksChange,
}: Props) {
  const [tab, setTab] = useState<Tab>('internal');
  const [internalLinks, setInternalLinks] = useState<InternalLink[]>(initialInternalLinks);
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>(initialExternalLinks);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Internal link add form
  const [intSearch, setIntSearch] = useState('');
  const [intResults, setIntResults] = useState<BlogSearchResult[]>([]);
  const [intSearching, setIntSearching] = useState(false);
  const [intAnchor, setIntAnchor] = useState('');
  const [intType, setIntType] = useState<'blog' | 'project' | 'service' | 'static'>('blog');
  const [intSelected, setIntSelected] = useState<BlogSearchResult | null>(null);
  const [intManualSlug, setIntManualSlug] = useState('');

  // External link add form
  const [extUrl, setExtUrl] = useState('');
  const [extAnchor, setExtAnchor] = useState('');
  const [extNofollow, setExtNofollow] = useState(false);
  const [extError, setExtError] = useState('');

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Propagate changes up
  useEffect(() => {
    onLinksChange(internalLinks, externalLinks);
  }, [internalLinks, externalLinks, onLinksChange]);

  // ── Internal link search ────────────────────────────────────────────────────

  const handleIntSearch = (value: string) => {
    setIntSearch(value);
    setIntSelected(null);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (value.trim().length < 2) { setIntResults([]); return; }
    setIntSearching(true);
    searchTimer.current = setTimeout(async () => {
      const res = await searchBlogsForLinkAction(value);
      setIntResults(res.data || []);
      setIntSearching(false);
    }, 350);
  };

  const selectBlogResult = (result: BlogSearchResult) => {
    setIntSelected(result);
    setIntSearch(result.title);
    setIntResults([]);
    if (!intAnchor) setIntAnchor(result.title);
  };

  const addInternalLink = () => {
    const slug = intSelected?.slug || intManualSlug.trim();
    const title = intSelected?.title || slug;
    const anchor = intAnchor.trim();

    if (!slug) return setIntSearch(''); // nothing to add
    if (!anchor) { alert('Please enter anchor text'); return; }

    const isDuplicate = internalLinks.some(
      (l) => l.targetSlug === slug && l.targetType === intType
    );
    if (isDuplicate) { alert(`Link to "${slug}" already exists`); return; }

    const newLink: InternalLink = {
      linkId: uuidv4(),
      targetType: intType,
      targetSlug: slug,
      targetTitle: title,
      anchorText: anchor,
      isActive: true,
    };

    setInternalLinks((prev) => [...prev, newLink]);
    // Reset form
    setIntSearch(''); setIntAnchor(''); setIntSelected(null); setIntManualSlug('');
  };

  const removeInternalLink = (linkId: string) =>
    setInternalLinks((prev) => prev.filter((l) => l.linkId !== linkId));

  // ── External link ────────────────────────────────────────────────────────────

  const validateUrl = (url: string) => {
    try {
      const u = url.startsWith('http') ? url : `https://${url}`;
      new URL(u);
      return u;
    } catch {
      return null;
    }
  };

  const addExternalLink = () => {
    setExtError('');
    const normalized = validateUrl(extUrl.trim());
    if (!normalized) { setExtError('Please enter a valid URL'); return; }
    if (!extAnchor.trim()) { setExtError('Anchor text is required'); return; }

    const isDuplicate = externalLinks.some((l) => l.url === normalized);
    if (isDuplicate) { setExtError('This URL is already tracked'); return; }

    setExternalLinks((prev) => [
      ...prev,
      { url: normalized, anchorText: extAnchor.trim(), isNofollow: extNofollow, isWorking: true },
    ]);
    setExtUrl(''); setExtAnchor(''); setExtNofollow(false);
  };

  const removeExternalLink = (url: string) =>
    setExternalLinks((prev) => prev.filter((l) => l.url !== url));

  const toggleNofollow = (url: string) =>
    setExternalLinks((prev) =>
      prev.map((l) => (l.url === url ? { ...l, isNofollow: !l.isNofollow } : l))
    );

  // ── Save to DB (only available when editing a saved blog) ──────────────────

  const handleSave = async () => {
    if (!blogId) return;
    setSaving(true);
    setSaveMsg('');
    const res = await updateBlogLinksAction(blogId, {
      internalLinks,
      externalLinks,
    });
    setSaving(false);
    setSaveMsg(res.success ? '✅ Links saved!' : `❌ ${res.error}`);
    setTimeout(() => setSaveMsg(''), 3000);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <LinkIcon size={16} className="text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-800">Link Manager</h3>
          <span className="text-xs text-gray-400">
            {internalLinks.length} internal · {externalLinks.length} external
          </span>
        </div>
        {blogId && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : null}
            Save Links
          </button>
        )}
        {saveMsg && <span className="text-xs font-medium">{saveMsg}</span>}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        {(['internal', 'external'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors capitalize ${
              tab === t
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {t === 'internal' ? (
              <span className="flex items-center justify-center gap-1.5">
                <BookOpen size={14} /> Internal Links ({internalLinks.length})
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <Globe size={14} /> External Links ({externalLinks.length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="p-5 space-y-5">
        {/* ── INTERNAL LINKS TAB ─────────────────────────────────────────────── */}
        {tab === 'internal' && (
          <>
            {/* Add internal link form */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Add Internal Link</p>

              {/* Type selector */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 shrink-0">Link Type:</label>
                <select
                  value={intType}
                  onChange={(e) => setIntType(e.target.value as any)}
                  className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="blog">Blog Post</option>
                  <option value="project">Project</option>
                  <option value="service">Service</option>
                  <option value="static">Static Page</option>
                </select>
              </div>

              {/* Blog search (only for blog type) */}
              {intType === 'blog' ? (
                <div className="relative">
                  <label className="block text-xs text-gray-500 mb-1">Search Blog Post</label>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={intSearch}
                      onChange={(e) => handleIntSearch(e.target.value)}
                      placeholder="Search by title, slug, or tag..."
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {intSearching && (
                      <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
                    )}
                  </div>

                  {/* Search results dropdown */}
                  {intResults.length > 0 && (
                    <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      {intResults.map((result) => (
                        <button
                          key={result._id}
                          type="button"
                          onClick={() => selectBlogResult(result)}
                          className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
                        >
                          <p className="text-sm font-medium text-gray-800 truncate">{result.title}</p>
                          <p className="text-xs text-gray-400">/blog/{result.slug} · {result.category.name}</p>
                        </button>
                      ))}
                    </div>
                  )}

                  {intSelected && (
                    <div className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
                      <CheckCircle size={12} />
                      Selected: <code className="bg-gray-100 px-1 rounded">/blog/{intSelected.slug}</code>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Slug / Path *</label>
                  <input
                    type="text"
                    value={intManualSlug}
                    onChange={(e) => setIntManualSlug(e.target.value)}
                    placeholder={
                      intType === 'project' ? 'my-project-slug' :
                      intType === 'service' ? 'my-service' : 'about-us'
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Anchor text */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Anchor Text *</label>
                <input
                  type="text"
                  value={intAnchor}
                  onChange={(e) => setIntAnchor(e.target.value)}
                  placeholder="Descriptive link text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addInternalLink(); } }}
                />
              </div>

              <button
                type="button"
                onClick={addInternalLink}
                disabled={!intAnchor.trim() || (!intSelected && !intManualSlug.trim())}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Plus size={14} />
                Add Internal Link
              </button>
            </div>

            {/* Internal link list */}
            {internalLinks.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No internal links yet. Use the form above to add links to other pages on your site.</p>
            ) : (
              <div className="space-y-2">
                {internalLinks.map((link) => (
                  <div key={link.linkId} className="flex items-start justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase">
                          {link.targetType}
                        </span>
                        <span className="text-sm font-medium text-gray-800 truncate">{link.anchorText}</span>
                      </div>
                      <p className="text-xs text-gray-400 font-mono truncate">
                        /{link.targetType === 'blog' ? 'blog' : link.targetType}/{link.targetSlug}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeInternalLink(link.linkId)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0 ml-2"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── EXTERNAL LINKS TAB ─────────────────────────────────────────────── */}
        {tab === 'external' && (
          <>
            {/* Add external link form */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Add External Link</p>

              <div>
                <label className="block text-xs text-gray-500 mb-1">URL *</label>
                <input
                  type="url"
                  value={extUrl}
                  onChange={(e) => { setExtUrl(e.target.value); setExtError(''); }}
                  placeholder="https://example.com/page"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Anchor Text *</label>
                <input
                  type="text"
                  value={extAnchor}
                  onChange={(e) => { setExtAnchor(e.target.value); setExtError(''); }}
                  placeholder="Descriptive link text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addExternalLink(); } }}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={extNofollow}
                  onChange={(e) => setExtNofollow(e.target.checked)}
                  className="rounded"
                />
                <span className="text-xs text-gray-600">
                  Add <code className="bg-gray-100 px-1 rounded">rel="nofollow"</code>
                  <span className="text-gray-400"> — use for sponsored/affiliate links</span>
                </span>
              </label>

              {extError && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {extError}
                </p>
              )}

              <button
                type="button"
                onClick={addExternalLink}
                disabled={!extUrl.trim() || !extAnchor.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Plus size={14} />
                Add External Link
              </button>
            </div>

            {/* External link list */}
            {externalLinks.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No external links tracked. Add links above to monitor them.</p>
            ) : (
              <div className="space-y-2">
                {externalLinks.map((link) => (
                  <div key={link.url} className="flex items-start justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-sm font-medium text-gray-800 truncate">{link.anchorText}</span>
                        {link.isNofollow && (
                          <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">nofollow</span>
                        )}
                        <span className={`text-xs px-1.5 py-0.5 rounded flex items-center gap-1 ${link.isWorking ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                          {link.isWorking ? <CheckCircle size={10} /> : <XCircle size={10} />}
                          {link.isWorking ? 'Active' : 'Broken'}
                        </span>
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-500 hover:underline font-mono truncate block max-w-xs"
                      >
                        {link.url}
                      </a>

                      <button
                        type="button"
                        onClick={() => toggleNofollow(link.url)}
                        className="mt-1 text-xs text-gray-400 hover:text-gray-700 underline"
                      >
                        {link.isNofollow ? 'Remove nofollow' : 'Add nofollow'}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExternalLink(link.url)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0 ml-2"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {!blogId && externalLinks.length > 0 && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                ⚠️ Links will be saved when you publish or save the draft.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
