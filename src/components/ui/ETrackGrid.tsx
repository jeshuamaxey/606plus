import React from 'react';
import { ETrack } from './ETrack';
import { ETrackColumn } from './ETrackColumn';

interface Item {
  title: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
}

interface ETrackGridProps {
  /**
   * Array of items to distribute across columns
   */
  items: Item[];
  /**
   * Number of columns (1-4 supported)
   */
  columns?: 1 | 2 | 3 | 4;
  /**
   * Gap between columns
   */
  gap?: 'sm' | 'md' | 'lg';
  /**
   * Spacing between items within columns
   */
  itemSpacing?: 'sm' | 'md' | 'lg';
  /**
   * Whether to show tracks on the left and right edges
   */
  showEdgeTracks?: boolean;
  /**
   * Whether to show tracks between columns
   */
  showBetweenTracks?: boolean;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * ETrackGrid component - creates a multi-column grid with e-tracks
 * between columns and on the edges
 */
export function ETrackGrid({
  items,
  columns = 3,
  gap = 'md',
  itemSpacing = 'md',
  showEdgeTracks = true,
  showBetweenTracks = true,
  className = '',
}: ETrackGridProps) {
  const gridColsClasses = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  // Distribute items across columns
  const itemsPerColumn = Math.ceil(items.length / columns);
  const columnsData: Item[][] = [];
  
  for (let i = 0; i < columns; i++) {
    const start = i * itemsPerColumn;
    const end = start + itemsPerColumn;
    columnsData.push(items.slice(start, end));
  }

  // Calculate track positions - no gaps, so tracks are at exact column boundaries
  // For 3 columns: left edge, between 1-2 (at 33.33%), between 2-3 (at 66.66%), right edge
  
  return (
    <div className={`relative ${className}`}>
      {/* Left edge track */}
      {showEdgeTracks && <ETrack position="left" className="left-0" />}
      
      {/* Tracks between columns */}
      {showBetweenTracks && columns > 1 && (
        <>
          {Array.from({ length: columns - 1 }).map((_, i) => {
            // Calculate position: at the exact boundary between columns
            // Column width = 100% / columns
            // Track position = (i+1) * column_width
            const columnWidthPercent = 100 / columns;
            const leftOffset = `${(i + 1) * columnWidthPercent}%`;
            return (
              <ETrack
                key={`between-${i}`}
                position="between"
                className="hidden md:block"
                style={{ left: leftOffset }}
              />
            );
          })}
        </>
      )}
      
      {/* Right edge track */}
      {showEdgeTracks && <ETrack position="right" className="right-0" />}
      
      {/* Render columns - no gap between columns */}
      <div className={`grid grid-cols-1 ${gridColsClasses[columns]} gap-0`}>
        {columnsData.map((columnItems, index) => (
          <ETrackColumn
            key={index}
            items={columnItems}
            showLeftTrack={false} // Tracks are handled by the grid container
            itemSpacing={itemSpacing}
            contentPadding="xs" // Very small padding for slight spacing from tracks
          />
        ))}
      </div>
    </div>
  );
}

