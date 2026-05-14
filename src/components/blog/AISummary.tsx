import React from 'react';

interface Props {
  blog: {
    title: string;
    excerpt: string;
    keyTakeaways?: string[];
  };
}

export default function AISummary({ blog }: Props) {
  return (
    <div
      className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 my-8 border border-purple-200"
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-purple-600 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-purple-900">AI Summary</h3>
          <p className="text-sm text-purple-700">Quick Overview</p>
        </div>
      </div>

      <p className="text-gray-800 mb-4" itemProp="abstract">
        {blog.excerpt}
      </p>

      {blog.keyTakeaways && blog.keyTakeaways.length > 0 && (
        <div>
          <p className="font-semibold text-gray-900 mb-2">Key Takeaways:</p>
          <ul className="space-y-2">
            {blog.keyTakeaways.map((takeaway, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span className="text-gray-700">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
