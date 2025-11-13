import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  className = '',
  ...props 
}) => {
  const baseClass = 'hydora-button';
  const variantClass = `hydora-button--${variant}`;
  const sizeClass = `hydora-button--${size}`;
  const disabledClass = disabled ? 'hydora-button--disabled' : '';
  const loadingClass = loading ? 'hydora-button--loading' : '';
  
  const classes = `${baseClass} ${variantClass} ${sizeClass} ${disabledClass} ${loadingClass} ${className}`.trim();

  return (
    <button 
      className={classes} 
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="button-spinner">
          <div className="spinner-icon">
            <div className="spinner-track"></div>
            <div className="spinner-indicator"></div>
          </div>
        </div>
      )}
      {icon && !loading && (
        <span className="button-icon">
          {icon}
        </span>
      )}
      <span className="button-text">
        {children}
      </span>
    </button>
  );
};

export default Button; 
