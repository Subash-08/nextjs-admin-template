'use client';

import { useState, useEffect } from 'react';
import {
  CheckCircle, XCircle, AlertCircle, ExternalLink,
  BookOpen, Folder, Loader2, Lightbulb, ChevronRight,
} from 'lucide-react';
import { generateLinkSuggestionsAction } from '@/actions/blog.actions';
import { optimizeForVoiceSearch } from '@/lib/blog/voiceSearchOptimization';
import { Mic } from 'lucide-react';

interface Props {
  data: any;
  onBack: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  saving: boolean;
}

interface LinkSuggestion {
  targetSlug: string;
  targetTitle: string;
  targetType: 'blog' | 'project';
  anchorText: string;
  relevanceScore: number;
  contextSnippet: string;
}

export default function ReviewPublishStep({
  data, onBack, onSaveDraft, onPublish, saving,
}: Props) {
  const [linkSuggestions, setLinkSuggestions] = useState<LinkSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

  const voiceSuggestions = optimizeForVoiceSearch(data);

  const checks = [
    { label: 'Title',           value: !!data.title,                  required: true },
    { label: 'URL Slug',        value: !!data.slug,                   required: true },
    { label: 'Excerpt',         value: !!data.excerpt,                required: true },
    { label: 'Category',        value: !!data.categorySlug,           required: true },
    { label: 'Featured Image',  value: !!data.featuredImage?.url,     required: true },
    { label: 'Content Added',   value: (data.contentBlocks?.length || 0) > 0, required: true },
    { label: 'Meta Title',      value: !!data.seo?.metaTitle,         required: false },
    { label: 'Meta Description',value: !!data.seo?.metaDescription,   required: false },
    { label: 'Focus Keyword',   value: !!data.seo?.focusKeyword,      required: false },
    { label: 'Tags Added',      value: (data.tags?.length || 0) > 0,  required: false },
  ];

  const requiredPassed = checks.filter((c) => c.required).every((c) => c.value);
  const totalPassed    = checks.filter((c) => c.value).length;
  const score = Math.round((totalPassed / checks.length) * 100);

  // Fetch link suggestions when step mounts
  useEffect(() => {
    if (!data.contentBlocks?.length) return;
    setLoadingSuggestions(true);
    generateLinkSuggestionsAction(data._id || 'new', data.contentBlocks, data.slug)
      .then((res) => {
        if (res.success) setLinkSuggestions(res.data || []);
      })
      .finally(() => setLoadingSuggestions(false));
  }, []); // run once on mount

  const visibleSuggestions = linkSuggestions.filter(
    (s) => !dismissedSuggestions.has(s.targetSlug)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Review & Publish</h2>
        <p className="text-gray-500">Review your blog post before publishing</p>
      </div>

      {/* Score hero */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Readiness Score</p>
            <p className={`text-5xl font-extrabold ${score >= 70 ? 'text-green-600' : score >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
              {score}%
            </p>
            <p className="text-sm text-gray-500 mt-1">{totalPassed} of {checks.length} checks passed</p>
          </div>
          <div className="w-24 h-24 relative">
            <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke={score >= 70 ? '#16a34a' : score >= 50 ? '#f59e0b' : '#dc2626'}
                strokeWidth="3"
                strokeDasharray={`${score} ${100 - score}`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Checklist */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
            Pre-Publish Checklist
          </h3>
          <ul className="space-y-2.5">
            {checks.map((check) => (
              <li key={check.label} className="flex items-center gap-3">
                {check.value ? (
                  <CheckCircle size={17} className="text-green-500 shrink-0" />
                ) : check.required ? (
                  <XCircle size={17} className="text-red-500 shrink-0" />
                ) : (
                  <AlertCircle size={17} className="text-amber-400 shrink-0" />
                )}
                <span className={`text-sm ${
                  check.value ? 'text-gray-700'
                  : check.required ? 'text-red-600 font-medium'
                  : 'text-gray-500'
                }`}>
                  {check.label}
                  {!check.value && check.required && (
                    <span className="ml-1 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Required</span>
                  )}
                  {!check.value && !check.required && (
                    <span className="ml-1 text-xs text-gray-400">Recommended</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          {[
            { label: 'Content Blocks', value: data.contentBlocks?.length || 0, icon: '📄' },
            { label: 'Tags',           value: data.tags?.length || 0,           icon: '🏷️' },
            { label: 'Internal Links', value: data.internalLinks?.length || 0,  icon: '🔗' },
            { label: 'External Links', value: data.externalLinks?.length || 0,  icon: '🌐' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{stat.icon}</span>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}

          {/* SEO preview link */}
          {data.slug && (
            <a
              href={`/blog/${data.slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline px-1"
            >
              <ExternalLink size={14} />
              Preview: /blog/{data.slug}
            </a>
          )}
        </div>
      </div>

      {/* Voice Search Optimization */}
      {voiceSuggestions.length > 0 && (
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mic size={18} className="text-purple-600" />
            <h3 className="font-semibold text-gray-900">Voice Search & AI Overview Optimization</h3>
          </div>
          <ul className="space-y-2">
            {voiceSuggestions.map((suggestion, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-purple-800">
                <span className="text-purple-400 mt-0.5">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Internal Link Suggestions */}
      <div className="border border-blue-100 bg-blue-50 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-blue-100 bg-white">
          <Lightbulb size={16} className="text-blue-500" />
          <h3 className="font-semibold text-gray-900 text-sm">Internal Link Suggestions</h3>
          {loadingSuggestions && (
            <Loader2 size={14} className="text-blue-500 animate-spin ml-auto" />
          )}
          {!loadingSuggestions && linkSuggestions.length > 0 && (
            <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {visibleSuggestions.length} suggestion{visibleSuggestions.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="p-4">
          {loadingSuggestions && (
            <div className="py-4 text-center text-sm text-gray-500">
              Analyzing content for link opportunities…
            </div>
          )}

          {!loadingSuggestions && visibleSuggestions.length === 0 && (
            <p className="text-sm text-gray-500 py-3 text-center">
              {linkSuggestions.length === 0
                ? 'No link suggestions found. Add more content or publish more blog posts.'
                : 'All suggestions dismissed.'}
            </p>
          )}

          {!loadingSuggestions && visibleSuggestions.length > 0 && (
            <div className="space-y-2">
              {visibleSuggestions.map((suggestion) => (
                <div
                  key={suggestion.targetSlug}
                  className="flex items-center justify-between gap-3 bg-white border border-blue-100 rounded-lg px-4 py-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {suggestion.targetType === 'blog' ? (
                      <BookOpen size={15} className="text-blue-500 shrink-0" />
                    ) : (
                      <Folder size={15} className="text-indigo-500 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {suggestion.targetTitle}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {suggestion.contextSnippet}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">
                      {suggestion.targetType === 'blog' ? '/blog/' : '/works/'}{suggestion.targetSlug}
                    </span>
                    <a
                      href={`/${suggestion.targetType === 'blog' ? 'blog' : 'works'}/${suggestion.targetSlug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Open in new tab"
                    >
                      <ChevronRight size={14} />
                    </a>
                    <button
                      type="button"
                      onClick={() => setDismissedSuggestions((prev) => new Set([...prev, suggestion.targetSlug]))}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors"
                      title="Dismiss"
                    >
                      <XCircle size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <p className="text-xs text-blue-600 px-1 pt-1">
                💡 Go back to the Content Editor to add these links using the Link Manager.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Required fields warning */}
      {!requiredPassed && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm font-medium flex items-start gap-2">
          <XCircle size={16} className="shrink-0 mt-0.5" />
          Please complete all required fields before publishing. Go back and fill in the missing fields.
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
        >
          ← Back to Editor
        </button>

        <div className="flex gap-3">
          <button
            onClick={onSaveDraft}
            disabled={saving}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            onClick={onPublish}
            disabled={saving || !requiredPassed}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Publishing…</span>
            ) : '🚀 Publish Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
