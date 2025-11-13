import React from 'react';

const Typography = ({ 
  children, 
  variant = 'body', 
  color = 'primary',
  className = '',
  ...props 
}) => {
  const baseClass = 'hydora-typography';
  const variantClass = `hydora-typography--${variant}`;
  const colorClass = `hydora-typography--${color}`;
  
  const classes = `${baseClass} ${variantClass} ${colorClass} ${className}`.trim();

  const getTag: React.FC = () => {
    switch (variant) {
      case 'h1': return 'h1';
      case 'h2': return 'h2';
      case 'h3': return 'h3';
      case 'h4': return 'h4';
      case 'h5': return 'h5';
      case 'h6': return 'h6';
      case 'body': return 'p';
      case 'caption': return 'span';
      case 'label': return 'label';
      default: return 'p';
    }
  };

  const Tag = getTag();

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
};

export default Typography; 
