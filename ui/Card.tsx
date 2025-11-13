import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ 
  children,
  className = '', 
  ...props 
}) => {
  const baseClass = 'hydora-card';
  const classes = `${baseClass} ${className}`.trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card; 
