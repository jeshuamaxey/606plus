import React from 'react';

interface ETrackContainerProps {
  /**
   * Whether to show e-track on the left side
   * When true, renders three vertical gray lines on the left edge
   * @default false
   */
  left?: boolean;
  /**
   * Whether to show e-track on the right side
   * When true, renders three vertical gray lines on the right edge
   * @default false
   */
  right?: boolean;
  /**
   * Content to render inside the track container
   */
  children?: React.ReactNode;
  /**
   * Additional className to apply to the outermost container
   */
  className?: string;
}

/**
 * ETrackContainer component - wraps content with e-track lines on left and/or right
 * 
 * **How it works:**
 * Uses three nested divs with borders to create three thin gray lines separated by small gaps.
 * Each div has a border-left/right (creating a line) and padding (creating a gap).
 * The innermost div contains the children content.
 * 
 * **Structure:**
 * ```
 * <div border-left>           <!-- First line -->
 *   <div padding-left>         <!-- Gap -->
 *     <div border-left>        <!-- Second line -->
 *       <div padding-left>     <!-- Gap -->
 *         <div border-left>    <!-- Third line -->
 *           {children}
 *         </div>
 *       </div>
 *     </div>
 *   </div>
 * </div>
 * ```
 * 
 * **Best Practices:**
 * - Use `left` prop for tracks between columns (on grid items)
 * - Use `right` prop for tracks on the right edge (on grid container)
 * - Can use both `left` and `right` together if needed
 * - Tracks are typically hidden on mobile using `hidden md:block` className
 * 
 * **Visual Result:**
 * Creates three evenly-spaced vertical gray lines (rgb(212, 212, 212)) with 2px gaps between them.
 * 
 * @example
 * ```tsx
 * // Left track only (between columns)
 * <ETrackContainer left className="hidden md:block">
 *   <CatalogueItem {...item} />
 * </ETrackContainer>
 * 
 * // Right track only (right edge)
 * <ETrackContainer right>
 *   <Grid>{items}</Grid>
 * </ETrackContainer>
 * 
 * // Both tracks
 * <ETrackContainer left right>
 *   <Content />
 * </ETrackContainer>
 * ```
 */
export function ETrackContainer({
  left = false,
  right = false,
  children,
  className = '',
}: ETrackContainerProps) {
  // Build classes for the three nested divs
  // Each div has a border (creating a line) and padding (creating a gap)
  const borderClasses = [
    left && 'border-l border-l-neutral-300',
    right && 'border-r border-r-neutral-300',
  ].filter(Boolean).join(' ');

  const paddingClasses = [
    left && 'pl-[2px]',
    right && 'pr-[2px]',
  ].filter(Boolean).join(' ');

  // Combine border and padding for outer and middle divs
  const outerAndMiddleClasses = ` ${borderClasses} ${paddingClasses}`.trim();
  
  // Inner div only has border (no padding needed)
  const innerClasses = borderClasses;

  return (
    <div className={`${className} ${outerAndMiddleClasses}`}>
      <div className={outerAndMiddleClasses}>
        <div className={innerClasses}>
          {children}
        </div>
      </div>
    </div>
  );
}

