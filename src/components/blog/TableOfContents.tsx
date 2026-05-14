'use client';

import { useEffect, useState } from 'react';
import type { TOCItem } from '@/lib/blog/tableOfContents';

interface Props {
  items: TOCItem[];
}

export default function TableOfContents({ items }: Props) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -35% 0px' }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.anchorId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 sticky top-6">
      <p className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Table of Contents</p>
      <ol className="space-y-1.5 list-none">
        {items.map((item) => (
          <li key={item.anchorId} className={item.level === 3 ? 'ml-4' : ''}>
            <a
              href={`#${item.anchorId}`}
              className={`block text-sm py-0.5 border-l-2 pl-3 transition-all ${
                activeId === item.anchorId
                  ? 'text-blue-600 font-medium border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
