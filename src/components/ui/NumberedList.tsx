import React from 'react';

interface NumberedListItem {
  number: string | number;
  title: string;
  description?: string;
}

interface NumberedListProps {
  items: NumberedListItem[];
  className?: string;
}

export const NumberedList: React.FC<NumberedListProps> = ({ items, className = '' }) => {
  return (
    <div className={`space-y-12 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex gap-8">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 flex items-center justify-center border-2 border-neutral-900 text-neutral-900 font-medium text-lg">
              {item.number}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-medium text-neutral-900 mb-2">{item.title}</h3>
            {item.description && (
              <p className="text-neutral-600 leading-relaxed">{item.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

