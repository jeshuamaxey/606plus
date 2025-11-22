import React from 'react';

interface QuoteProps {
  text: string;
  author?: string;
  className?: string;
}

export const Quote: React.FC<QuoteProps> = ({ text, author, className = '' }) => {
  return (
    <blockquote className={`border-l-4 border-neutral-900 pl-8 py-4 ${className}`}>
      <p className="text-xl md:text-2xl font-light text-neutral-900 italic leading-relaxed mb-4">
        {text}
      </p>
      {author && (
        <cite className="text-sm text-neutral-600 uppercase tracking-wide not-italic">
          — {author}
        </cite>
      )}
    </blockquote>
  );
};

