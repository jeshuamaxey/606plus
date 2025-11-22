import React from 'react';
import Image from 'next/image';

interface TechnicalCardProps {
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  dimensions?: string;
  annotations?: string[];
  className?: string;
}

export const TechnicalCard: React.FC<TechnicalCardProps> = ({
  image,
  title,
  subtitle,
  description,
  dimensions,
  annotations = [],
  className = '',
}) => {
  return (
    <div className={`card relative bg-white border-2 border-blue-600 ${className}`}>
      {/* Grid overlay background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #2563eb 1px, transparent 1px),
              linear-gradient(to bottom, #2563eb 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* Measurement lines - top */}
      <div className="absolute top-0 left-0 right-0 h-8 border-b-2 border-blue-600">
        <div className="absolute top-0 left-0 w-4 h-4 border-r-2 border-b-2 border-blue-600" />
        <div className="absolute top-0 right-0 w-4 h-4 border-l-2 border-b-2 border-blue-600" />
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-[10px] font-mono text-blue-600">
          {dimensions || '600×600'}
        </div>
      </div>

      {/* Image container with ruled border */}
      <div className="relative mt-8 mx-4 mb-4 border-2 border-blue-300">
        <div className="aspect-square relative bg-neutral-50">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        {/* Corner indicators */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-2 border-blue-600 bg-white" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-2 border-blue-600 bg-white" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-2 border-blue-600 bg-white" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-2 border-blue-600 bg-white" />
      </div>

      {/* Content area */}
      <div className="relative px-4 pb-4">
        {/* Technical annotation line */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-px bg-blue-600" />
          <div className="w-2 h-2 border-2 border-blue-600 rotate-45" />
        </div>

        {/* Title with technical styling */}
        <h3 className="text-lg font-mono font-semibold text-blue-900 mb-1 tracking-tight">
          {title}
        </h3>
        
        {subtitle && (
          <p className="text-xs font-mono text-blue-600 uppercase tracking-widest mb-2">
            {subtitle}
          </p>
        )}

        {description && (
          <p className="text-sm text-neutral-700 leading-relaxed mb-3">
            {description}
          </p>
        )}

        {/* Annotations */}
        {annotations.length > 0 && (
          <div className="mt-4 pt-3 border-t border-blue-200">
            <div className="space-y-1">
              {annotations.map((annotation, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-[10px] font-mono text-blue-600 mt-0.5">
                    [{index + 1}]
                  </span>
                  <span className="text-xs text-neutral-600">{annotation}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom measurement line */}
        <div className="mt-4 pt-2 border-t border-blue-200">
          <div className="flex items-center justify-between text-[10px] font-mono text-blue-500">
            <span>REF: {title.substring(0, 6).toUpperCase()}</span>
            <span>SCALE: 1:1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

