import React from 'react';

const SkeletonLoader = ({ type = 'default', className = '' }) => {
  const getSkeletonClass: React.FC = () => {
    switch (type) {
      case 'report-card':
        return 'skeleton-report-card';
      case 'text':
        return 'skeleton-text';
      case 'button':
        return 'skeleton-button';
      case 'avatar':
        return 'skeleton-avatar';
      default:
        return 'skeleton-default';
    }
  };

  return (
    <div className={`skeleton-loader ${getSkeletonClass()} ${className}`}>
      <div className="skeleton-animation"></div>
    </div>
  );
};

export default SkeletonLoader; 
