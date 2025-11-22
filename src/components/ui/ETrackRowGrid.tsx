import React from 'react';
import { CatalogueItem } from './CatalogueItem';
import { ETrackContainer } from './ETrackContainer';

interface Item {
  title: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
  href?: string;
}

interface ETrackRowGridProps {
  /**
   * Array of items to distribute across rows
   */
  items: Item[];
  /**
   * Number of columns per row (1-4 supported)
   * @default 3
   */
  columns?: 1 | 2 | 3 | 4;
  /**
   * Spacing between rows
   * @default 'none'
   */
  rowSpacing?: 'none' | 'sm' | 'md' | 'lg';
  /**
   * Additional className for the grid container
   */
  className?: string;
}

/**
 * ETrackRowGrid component - creates a row-based grid with continuous vertical e-tracks
 * 
 * **Implementation Pattern:**
 * - The entire grid is wrapped in an ETrackContainer with `right` prop to show the right edge track
 * - Each item in a row is wrapped in an ETrackContainer with `left` prop to show tracks between columns
 * - This creates continuous vertical tracks that run down the page between columns and on the right edge
 * 
 * **Best Practices:**
 * - Use `rowSpacing="none"` for continuous tracks (no gaps between rows)
 * - Items are distributed horizontally across rows (left to right, top to bottom)
 * - Tracks are only visible on desktop (md breakpoint and above)
 * 
 * @example
 * ```tsx
 * <ETrackRowGrid
 *   items={catalogueItems}
 *   columns={3}
 *   rowSpacing="none"
 * />
 * ```
 */
export function ETrackRowGrid({
  items,
  columns = 3,
  rowSpacing = 'none',
  className = '',
}: ETrackRowGridProps) {
  const gridColsClasses = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  const rowSpacingClasses = {
    none: 'gap-y-0',
    sm: 'gap-y-4',
    md: 'gap-y-6',
    lg: 'gap-y-8',
  };

  // Distribute items across rows (horizontally)
  const rowsData: Item[][] = [];
  for (let i = 0; i < items.length; i += columns) {
    rowsData.push(items.slice(i, i + columns));
  }

  return (
    <div className={className}>
      {/* Wrap entire grid in ETrackContainer with right track for right edge */}
      <ETrackContainer right>
        <div className={`grid grid-cols-1 ${gridColsClasses[columns]} gap-x-0 ${rowSpacingClasses[rowSpacing]}`}>
          {rowsData.map((rowItems, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {rowItems.map((item, colIndex) => (
                <ETrackContainer
                  key={colIndex}
                  left
                  className="hidden md:block"
                >
                  <CatalogueItem
                    title={item.title}
                    subtitle={item.subtitle}
                    image={item.image}
                    imageAlt={item.imageAlt}
                    href={item.href}
                  />
                </ETrackContainer>
              ))}
              {/* Fill remaining columns in row if needed */}
              {rowItems.length < columns && Array.from({ length: columns - rowItems.length }).map((_, i) => (
                <ETrackContainer
                  key={`empty-${i}`}
                  left
                  className="hidden md:block"
                >
                  {/* Empty cell */}
                </ETrackContainer>
              ))}
            </React.Fragment>
          ))}
        </div>
      </ETrackContainer>
    </div>
  );
}

