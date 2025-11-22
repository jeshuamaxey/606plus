import React from 'react';
import Image from 'next/image';

interface CraftCardProps {
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  material?: string;
  maker?: string;
  className?: string;
}

export const CraftCard: React.FC<CraftCardProps> = ({
  image,
  title,
  subtitle,
  description,
  material,
  maker,
  className = '',
}) => {
  // Material-specific color palettes
  const materialPalettes: Record<string, { bg: string; border: string; text: string; accent: string }> = {
    ceramic: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-900',
      accent: 'bg-amber-200',
    },
    wood: {
      bg: 'bg-orange-50',
      border: 'border-orange-300',
      text: 'text-orange-900',
      accent: 'bg-orange-200',
    },
    metal: {
      bg: 'bg-slate-50',
      border: 'border-slate-300',
      text: 'text-slate-900',
      accent: 'bg-slate-200',
    },
    paper: {
      bg: 'bg-stone-50',
      border: 'border-stone-300',
      text: 'text-stone-900',
      accent: 'bg-stone-200',
    },
  };

  const palette = materialPalettes[material?.toLowerCase() || 'ceramic'] || materialPalettes.ceramic;

  return (
    <div className={`card relative ${palette.bg} border-2 ${palette.border} ${className}`}>
      {/* Hand-drawn style border decoration */}
      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-neutral-400 opacity-60" 
           style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-neutral-400 opacity-60"
           style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />
      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-neutral-400 opacity-60"
           style={{ clipPath: 'polygon(0 100%, 0 0, 100% 100%)' }} />
      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-neutral-400 opacity-60"
           style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />

      {/* Textured background overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
           }} />

      {/* Image container with organic border */}
      <div className={`relative mt-4 mx-4 mb-3 ${palette.border} border-2`}
           style={{ borderRadius: '2px 8px 2px 8px' }}>
        <div className="aspect-square relative bg-neutral-100 overflow-hidden"
             style={{ borderRadius: '1px 7px 1px 7px' }}>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-10"
               style={{
                 backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)`,
                 backgroundSize: '8px 8px',
               }} />
        </div>
      </div>

      {/* Content area */}
      <div className="relative px-4 pb-4">
        {/* Hand-drawn underline */}
        <div className="relative mb-3">
          <h3 className={`text-xl font-normal ${palette.text} mb-1`}>
            {title}
          </h3>
          <div className={`h-0.5 ${palette.accent} w-3/4`}
               style={{ transform: 'skewX(-5deg)' }} />
        </div>

        {subtitle && (
          <p className={`text-sm ${palette.text} opacity-70 italic mb-2`}>
            {subtitle}
          </p>
        )}

        {description && (
          <p className={`text-sm ${palette.text} opacity-80 leading-relaxed mb-3`}>
            {description}
          </p>
        )}

        {/* Material and maker info */}
        <div className="mt-4 pt-3 border-t border-neutral-300 border-dashed">
          <div className="flex flex-wrap gap-3 text-xs">
            {material && (
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${palette.accent}`} />
                <span className={`${palette.text} opacity-70`}>
                  {material.charAt(0).toUpperCase() + material.slice(1)}
                </span>
              </div>
            )}
            {maker && (
              <div className="flex items-center gap-1.5">
                <span className={`${palette.text} opacity-70`}>
                  by {maker}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Hand-drawn decorative element */}
        <div className="absolute bottom-2 right-4 opacity-20">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 12h8M12 8v8" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};

