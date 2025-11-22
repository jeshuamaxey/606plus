import React from 'react';
import Image from 'next/image';

interface ModularCardProps {
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  unitNumber?: string;
  connectionPoints?: number;
  className?: string;
}

export const ModularCard: React.FC<ModularCardProps> = ({
  image,
  title,
  subtitle,
  description,
  unitNumber,
  connectionPoints = 4,
  className = '',
}) => {
  // Generate connection point positions
  const connectionPositions = [
    { top: '0', left: '50%', transform: 'translate(-50%, -50%)' }, // top
    { top: '50%', right: '0', transform: 'translate(50%, -50%)' }, // right
    { bottom: '0', left: '50%', transform: 'translate(-50%, 50%)' }, // bottom
    { top: '50%', left: '0', transform: 'translate(-50%, -50%)' }, // left
  ].slice(0, connectionPoints);

  return (
    <div className={`card relative bg-white border border-neutral-300 ${className}`}>
      {/* Visible grid overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #171717 1px, transparent 1px),
              linear-gradient(to bottom, #171717 1px, transparent 1px)
            `,
            backgroundSize: '12px 12px',
          }}
        />
      </div>

      {/* Unit number indicator */}
      {unitNumber && (
        <div className="absolute top-2 left-2 z-10">
          <div className="bg-neutral-900 text-white text-xs font-mono px-2 py-1">
            UNIT {unitNumber}
          </div>
        </div>
      )}

      {/* Connection points */}
      <div className="absolute inset-0 pointer-events-none">
        {connectionPositions.map((pos, index) => (
          <div
            key={index}
            className="absolute w-3 h-3 border-2 border-neutral-900 bg-white"
            style={{
              top: pos.top,
              bottom: pos.bottom,
              left: pos.left,
              right: pos.right,
              transform: pos.transform,
            }}
          />
        ))}
      </div>

      {/* Image container */}
      <div className="relative mt-6 mx-3 mb-3">
        <div className="aspect-square relative bg-neutral-50 border border-neutral-200">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Grid overlay on image */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #171717 1px, transparent 1px),
                  linear-gradient(to bottom, #171717 1px, transparent 1px)
                `,
                backgroundSize: '8px 8px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Content area with grid alignment */}
      <div className="relative px-3 pb-3">
        {/* Alignment guide line */}
        <div className="h-px bg-neutral-200 mb-3" />

        <div className="grid grid-cols-12 gap-2">
          {/* Title spans 8 columns */}
          <div className="col-span-8">
            <h3 className="text-base font-medium text-neutral-900 mb-1 leading-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-neutral-600 uppercase tracking-wide">
                {subtitle}
              </p>
            )}
          </div>

          {/* Module indicator spans 4 columns */}
          <div className="col-span-4 text-right">
            <div className="inline-block border border-neutral-300 px-2 py-1">
              <div className="text-[10px] font-mono text-neutral-500 uppercase">
                MODULE
              </div>
            </div>
          </div>
        </div>

        {description && (
          <div className="mt-3 pt-3 border-t border-neutral-200">
            <p className="text-sm text-neutral-600 leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {/* Assembly indicator */}
        <div className="mt-3 pt-2 border-t border-neutral-200">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(connectionPoints)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 border border-neutral-400 bg-neutral-100"
                />
              ))}
            </div>
            <span className="text-xs text-neutral-500 font-mono">
              {connectionPoints} CONNECTION POINTS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

