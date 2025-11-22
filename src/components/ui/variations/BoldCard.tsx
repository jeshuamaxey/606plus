import React from 'react';
import Image from 'next/image';

interface BoldCardProps {
  image: string;
  title: string;
  description?: string;
  number?: string;
  className?: string;
}

export const BoldCard: React.FC<BoldCardProps> = ({
  image,
  title,
  description,
  number,
  className = '',
}) => {
  return (
    <div className={`card relative bg-white border-2 border-neutral-900 ${className}`}>
      {number && (
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-neutral-900 text-white flex items-center justify-center font-bold text-lg z-10">
          {number}
        </div>
      )}
      <div className="aspect-[4/3] relative bg-neutral-100">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-medium text-neutral-900 mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-neutral-600 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
};

