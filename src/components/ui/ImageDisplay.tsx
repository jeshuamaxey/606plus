import React from 'react';
import Image from 'next/image';

interface ImageDisplayProps {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide';
  caption?: string;
  className?: string;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  src,
  alt,
  aspectRatio = 'landscape',
  caption,
  className = '',
}) => {
  const ratios = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    wide: 'aspect-[16/9]',
  };
  
  return (
    <figure className={className}>
      <div className={`${ratios[aspectRatio]} relative bg-neutral-100 overflow-hidden`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>
      {caption && (
        <figcaption className="mt-4 text-sm text-neutral-600 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

