import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'Loading...',
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-gray-500">
      <div
        className={`${sizeClasses[size]} border-brand-500 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label={label}
      />
      {label && <p className="mt-3 text-sm font-medium text-gray-600">{label}</p>}
    </div>
  );
};
