import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'subtle';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const variants = {
    default: 'bg-neutral-900 text-white',
    outline: 'border border-neutral-900 text-neutral-900',
    subtle: 'bg-neutral-100 text-neutral-900',
  };
  
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

