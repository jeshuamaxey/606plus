import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  spacing = 'lg',
  className = '',
}) => {
  const spacings = {
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-24',
    xl: 'py-32',
  };
  
  return (
    <section className={`${spacings[spacing]} ${className}`}>
      {children}
    </section>
  );
};

