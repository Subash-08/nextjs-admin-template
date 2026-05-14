'use client';

import { useState } from 'react';
import { Mail, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  source?: string;
  variant?: 'default' | 'compact' | 'hero';
  className?: string;
}

type State = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterSignup({
  source = 'blog-footer',
  variant = 'default',
  className = '',
}: Props) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setState('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setState('success');
        setMessage("You're subscribed! We'll send you great content.");
        setEmail('');
      } else if (res.status === 409) {
        setState('error');
        setMessage('This email is already subscribed.');
      } else {
        setState('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setState('error');
      setMessage('Network error. Please check your connection.');
    }
  };

  // ── Hero variant ────────────────────────────────────────────────────────────
  if (variant === 'hero') {
    return (
      <section className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-8 py-12 text-white ${className}`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-white" />
          <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-white" />
        </div>

        <div className="relative z-10 max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Mail size={14} />
            Newsletter
          </div>
          <h2 className="text-3xl font-bold mb-3">Stay ahead of the curve</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Get the latest insights on AI, web development, and design — delivered weekly.
            No spam, ever.
          </p>

          {state === 'success' ? (
            <div className="flex items-center justify-center gap-3 bg-white/10 border border-white/20 rounded-xl px-6 py-4">
              <CheckCircle2 size={20} className="text-green-300 shrink-0" />
              <p className="font-medium">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setState('idle'); }}
                placeholder="Enter your email address"
                required
                className="flex-1 px-5 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
              />
              <button
                type="submit"
                disabled={state === 'loading'}
                className="px-6 py-3.5 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all disabled:opacity-70 shrink-0 flex items-center gap-2"
              >
                {state === 'loading' ? (
                  <><Loader2 size={16} className="animate-spin" /> Subscribing...</>
                ) : (
                  'Subscribe →'
                )}
              </button>
            </form>
          )}

          {state === 'error' && (
            <div className="flex items-center justify-center gap-2 mt-3 text-red-300 text-sm">
              <AlertCircle size={14} />
              {message}
            </div>
          )}
          <p className="text-blue-300 text-xs mt-4">Join 1,000+ readers. Unsubscribe anytime.</p>
        </div>
      </section>
    );
  }

  // ── Compact variant ─────────────────────────────────────────────────────────
  if (variant === 'compact') {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-xl p-5 ${className}`}>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <Mail size={16} className="text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Subscribe to our newsletter</p>
            <p className="text-gray-500 text-xs mt-0.5">Weekly articles, no spam.</p>
          </div>
        </div>

        {state === 'success' ? (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
            <CheckCircle2 size={15} className="shrink-0" />
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setState('idle'); }}
              placeholder="you@example.com"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button
              type="submit"
              disabled={state === 'loading'}
              className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {state === 'loading' ? <><Loader2 size={14} className="animate-spin" /> Subscribing...</> : 'Subscribe'}
            </button>
            {state === 'error' && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle size={12} />{message}
              </p>
            )}
          </form>
        )}
      </div>
    );
  }

  // ── Default variant ─────────────────────────────────────────────────────────
  return (
    <div className={`border border-gray-200 rounded-2xl p-8 bg-white ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
          <Mail size={18} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Get notified about new posts</h3>
          <p className="text-sm text-gray-500">Join our newsletter — no spam, ever.</p>
        </div>
      </div>

      {state === 'success' ? (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-4">
          <CheckCircle2 size={20} className="shrink-0" />
          <p className="font-medium text-sm">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setState('idle'); }}
            placeholder="your@email.com"
            required
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={state === 'loading'}
            className="px-5 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2 shrink-0"
          >
            {state === 'loading' ? <><Loader2 size={14} className="animate-spin" /></> : 'Subscribe'}
          </button>
        </form>
      )}
      {state === 'error' && (
        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
          <AlertCircle size={14} />{message}
        </p>
      )}
    </div>
  );
}
