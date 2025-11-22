import React from 'react';

interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const Spacer: React.FC<SpacerProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    xs: 'h-4',
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24',
    '2xl': 'h-32',
  };
  
  return <div className={`${sizes[size]} ${className}`} />;
};

