import React from 'react';

interface GeometricButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'square' | 'rounded';
}

export const GeometricButton: React.FC<GeometricButtonProps> = ({
  children,
  variant = 'square',
  className = '',
  ...props
}) => {
  const baseStyles = 'px-8 py-4 font-medium uppercase tracking-widest text-sm transition-all duration-200 focus:outline-none';
  const variantStyles = {
    square: 'bg-neutral-900 text-white hover:bg-neutral-800',
    rounded: 'bg-neutral-900 text-white hover:bg-neutral-800 rounded-sm',
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

