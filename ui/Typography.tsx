import React from 'react';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  color?: 'primary' | 'secondary' | 'tertiary';
  children: React.ReactNode;
  className?: string;
}

const Typography: React.FC<TypographyProps> = ({ 
  variant = 'body', 
  color = 'primary', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseClass = 'hydora-typography';
  const variantClass = `hydora-typography--${variant}`;
  const colorClass = `hydora-typography--${color}`;
  
  const classes = `${baseClass} ${variantClass} ${colorClass} ${className}`.trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Typography; 
