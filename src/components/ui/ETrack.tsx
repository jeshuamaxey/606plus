import React from 'react';

interface ETrackProps {
  /**
   * Position of the track
   * 'left' | 'right' | 'between' - determines alignment
   */
  position?: 'left' | 'right' | 'between';
  /**
   * Whether to show the track on mobile
   */
  showOnMobile?: boolean;
  /**
   * Additional className for styling
   */
  className?: string;
  /**
   * Inline styles for positioning
   */
  style?: React.CSSProperties;
}

/**
 * ETrack component - renders vertical e-track lines
 * Inspired by the Vitsoe 606 E-Track system
 */
export function ETrack({ 
  position = 'left', 
  showOnMobile = false,
  className = '',
  style,
}: ETrackProps) {
  const baseClasses = showOnMobile ? 'block' : 'hidden md:block';
  const positionClasses = {
    left: 'left-0',
    right: 'right-0',
    between: 'left-0',
  };

  return (
    <div 
      className={`absolute ${positionClasses[position]} top-0 bottom-0 ${baseClasses} ${className}`}
      style={style}
    >
      {/* Three vertical track lines - very close together */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300" />
      <div className="absolute left-[2px] top-0 bottom-0 w-px bg-neutral-300" />
      <div className="absolute left-[4px] top-0 bottom-0 w-px bg-neutral-300" />
    </div>
  );
}

