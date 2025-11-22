import React from 'react';
import Image from 'next/image';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`card bg-white border border-neutral-200 transition-all duration-200 hover:border-neutral-300 ${className}`}>
      {children}
    </div>
  );
};

interface CardImageProps {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  className?: string;
}

export const CardImage: React.FC<CardImageProps> = ({
  src,
  alt,
  aspectRatio = 'square',
  className = '',
}) => {
  const ratios = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
  };
  
  return (
    <div className={`${ratios[aspectRatio]} relative bg-neutral-100 overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, className = '' }) => {
  return (
    <div className={className}>
      <h3 className="text-xl font-medium text-neutral-900 mb-1">{title}</h3>
      {subtitle && (
        <p className="text-sm text-neutral-600 uppercase tracking-wide">{subtitle}</p>
      )}
    </div>
  );
};

