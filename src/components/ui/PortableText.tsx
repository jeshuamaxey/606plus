import { PortableText as PortableTextRenderer } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';

interface PortableTextProps {
  value: PortableTextBlock[] | null | undefined;
  className?: string;
}

export function PortableText({ value, className = '' }: PortableTextProps) {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <PortableTextRenderer
        value={value}
        components={{
          block: {
            normal: ({ children }) => (
              <p className="text-base leading-relaxed font-light text-neutral-700 mb-4 last:mb-0">
                {children}
              </p>
            ),
            // Handle other block styles if needed in the future
            h1: ({ children }) => (
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 mb-4 last:mb-0">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-4 last:mb-0">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-4 last:mb-0">
                {children}
              </h3>
            ),
          },
          marks: {
            // Handle text marks (bold, italic, etc.) if needed
            strong: ({ children }) => <strong className="font-medium">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            link: ({ children, value }) => {
              const target = value?.href?.startsWith('http') ? '_blank' : undefined;
              const rel = target === '_blank' ? 'noopener noreferrer' : undefined;
              return (
                <a
                  href={value?.href}
                  target={target}
                  rel={rel}
                  className="text-neutral-900 underline hover:text-neutral-600 transition-colors"
                >
                  {children}
                </a>
              );
            },
          },
        }}
      />
    </div>
  );
}

