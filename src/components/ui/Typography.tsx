import React from 'react';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({
  level = 1,
  children,
  className = '',
  ...props
}) => {
  const styles = {
    1: 'text-5xl md:text-6xl font-bold tracking-tight text-neutral-900',
    2: 'text-4xl md:text-5xl font-bold tracking-tight text-neutral-900',
    3: 'text-3xl md:text-4xl font-bold tracking-tight text-neutral-900',
    4: 'text-2xl md:text-3xl font-bold tracking-tight text-neutral-900',
    5: 'text-xl md:text-2xl font-bold tracking-tight text-neutral-900',
    6: 'text-lg md:text-xl font-bold tracking-tight text-neutral-900',
  };
  
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Tag 
      className={`${styles[level]} ${className}`}
      style={{ fontFamily: 'var(--font-stack-sans-notch), var(--font-geist-sans), sans-serif' }}
      {...props}
    >
      {children}
    </Tag>
  );
};

interface BodyTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'sm' | 'md' | 'lg';
  weight?: 'light' | 'normal' | 'medium';
  children: React.ReactNode;
}

export const BodyText: React.FC<BodyTextProps> = ({
  size = 'md',
  weight = 'normal',
  children,
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'text-sm leading-relaxed',
    md: 'text-base leading-relaxed',
    lg: 'text-lg leading-relaxed',
  };
  
  const weights = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
  };
  
  return (
    <p className={`${sizes[size]} ${weights[weight]} text-neutral-700 ${className}`} {...props}>
      {children}
    </p>
  );
};

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <label className={`text-sm font-medium text-neutral-900 uppercase tracking-wider ${className}`} {...props}>
      {children}
    </label>
  );
};

