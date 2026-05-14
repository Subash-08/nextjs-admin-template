import React from 'react';

interface Props {
  question: string;
  answer: string;
}

export default function FeaturedSnippet({ question, answer }: Props) {
  return (
    <div
      className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8 rounded-r-lg"
      itemScope
      itemType="https://schema.org/Question"
    >
      <h3
        className="text-xl font-bold mb-3 text-gray-900"
        itemProp="name"
      >
        {question}
      </h3>
      <div
        itemScope
        itemProp="acceptedAnswer"
        itemType="https://schema.org/Answer"
      >
        <div
          className="text-gray-700 leading-relaxed"
          itemProp="text"
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      </div>
    </div>
  );
}
