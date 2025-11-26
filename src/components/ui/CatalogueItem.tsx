import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CatalogueItemProps {
  title: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
  /**
   * Optional href for navigation - if provided, item becomes clickable
   */
  href?: string;
  /**
   * Aspect ratio for the image container
   */
  aspectRatio?: 'square' | 'wide' | 'tall';
  /**
   * Additional className for the item container
   */
  className?: string;
}

/**
 * CatalogueItem component - displays a single catalogue item with image and metadata
 */
export function CatalogueItem({
  title,
  subtitle,
  image,
  imageAlt,
  href,
  aspectRatio = 'square',
  className = '',
}: CatalogueItemProps) {
  const aspectClasses = {
    square: 'aspect-square',
    wide: 'aspect-[4/3]',
    tall: 'aspect-[3/4]',
  };

  const imageContainer = (
    <div className={`${aspectClasses[aspectRatio]} relative bg-neutral-100 overflow-hidden`}>
      <Image
        src={image}
        alt={imageAlt || title}
        fill
        className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
    </div>
  );

  const content = (
    <div className={`bg-white border-b border-neutral-200 relative ${className}`}>
      {imageContainer}
      {(title || subtitle) && (
        <div className="p-4 pl-4">
          {title && (
            <h4 className="text-sm font-medium text-neutral-900 mb-1 font-sans">{title}</h4>
          )}
          {subtitle && (
            <p className="text-xs text-neutral-600 uppercase tracking-wide">{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block group">
        {content}
      </Link>
    );
  }

  return (
    <div className="group">
      {content}
    </div>
  );
}

