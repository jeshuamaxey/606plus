import React from 'react';
import { ETrack } from './ETrack';
import { CatalogueItem } from './CatalogueItem';

interface Item {
  title: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
}

interface ETrackColumnProps {
  /**
   * Items to display in this column
   */
  items: Item[];
  /**
   * Whether to show the track on the left side of the column
   */
  showLeftTrack?: boolean;
  /**
   * Spacing between items
   */
  itemSpacing?: 'sm' | 'md' | 'lg';
  /**
   * Padding left for content (to account for track)
   */
  contentPadding?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  /**
   * Additional className
   */
  className?: string;
}

/**
 * ETrackColumn component - a column with an optional e-track and items
 */
export function ETrackColumn({
  items,
  showLeftTrack = true,
  itemSpacing = 'md',
  contentPadding = 'md',
  className = '',
}: ETrackColumnProps) {
  const spacingClasses = {
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
  };

  const paddingClasses = {
    none: '',
    xs: 'px-0 md:px-1',      // Very small: 0px mobile, 4px desktop
    sm: 'pl-0 md:pl-4',
    md: 'pl-0 md:pl-8',
    lg: 'pl-0 md:pl-12',
  };

  return (
    <div className={`relative ${className}`}>
      {showLeftTrack && <ETrack position="left" />}
      
      <div className={`${spacingClasses[itemSpacing]} ${paddingClasses[contentPadding]}`}>
        {items.map((item, index) => (
          <CatalogueItem
            key={index}
            title={item.title}
            subtitle={item.subtitle}
            image={item.image}
            imageAlt={item.imageAlt}
          />
        ))}
      </div>
    </div>
  );
}

