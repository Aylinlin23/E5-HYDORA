import React from 'react';

const Card = ({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}) => {
  const baseClass = 'hydora-card';
  const variantClass = `hydora-card--${variant}`;
  
  const classes = `${baseClass} ${variantClass} ${className}`.trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card; 
