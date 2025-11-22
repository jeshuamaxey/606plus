import React from 'react';
import Image from 'next/image';

interface MinimalCardProps {
  image: string;
  title: string;
  meta?: string;
  className?: string;
}

export const MinimalCard: React.FC<MinimalCardProps> = ({
  image,
  title,
  meta,
  className = '',
}) => {
  return (
    <div className={`card group cursor-pointer ${className}`}>
      <div className="aspect-square relative bg-neutral-50 mb-4 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <h3 className="text-lg font-light text-neutral-900 mb-1">{title}</h3>
      {meta && (
        <p className="text-xs text-neutral-500 uppercase tracking-widest">{meta}</p>
      )}
    </div>
  );
};

