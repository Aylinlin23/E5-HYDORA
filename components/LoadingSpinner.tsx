import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'indigo', 
  text = 'Cargando...',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    indigo: 'text-indigo-600 dark:text-indigo-400',
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400',
    gray: 'text-gray-600 dark:text-gray-400'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full border-b-2 ${colorClasses[color]} ${sizeClasses[size]}`}></div>
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      {spinner}
    </div>
  );
};

// Componente de loading para botones
export const ButtonSpinner = ({ size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-white ${sizeClasses[size]}`}></div>
  );
};

// Componente de loading para cards
export const CardSpinner = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  </div>
);

// Componente de loading para listas
export const ListSpinner = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default LoadingSpinner; 
