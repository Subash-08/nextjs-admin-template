import React from 'react';

interface CaseStudyProps {
  project: {
    title: string;
    description?: string;
    shortSummary?: string;
    coverImage?: { url: string };
    duration?: string;
  };
  challenge?: string;
  solution?: string;
  results?: Array<{ metric: string; value: string; improvement: string }>;
}

export default function CaseStudyStructuredData({
  project,
  challenge,
  solution,
  results,
}: CaseStudyProps) {
  // Case Study as a HowTo
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How We ${project.title}`,
    description: challenge || project.description || project.shortSummary,
    image: project.coverImage?.url,
    totalTime: project.duration || 'P3M', // default to 3 months if not provided
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: 'Contact for quote',
    },
    step: [
      {
        '@type': 'HowToStep',
        name: 'Challenge Identification',
        text: challenge || 'Identified key challenges and pain points.',
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: 'Solution Implementation',
        text: solution || 'Developed and deployed the solution.',
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'Results & Impact',
        text: results && results.length > 0 
            ? results.map((r) => `${r.metric}: ${r.value} (${r.improvement})`).join(', ')
            : 'Achieved significant positive outcomes.',
        position: 3,
      },
    ],
  };

  // Performance metrics as a Dataset
  const datasetSchema = results && results.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${project.title} - Performance Metrics`,
    description: 'Key performance indicators after implementation',
    variableMeasured: results.map((r) => r.metric).join(', '),
    measurementTechnique: 'Performance Monitoring',
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      {datasetSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
        />
      )}
    </>
  );
}
