import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
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
      type={type}
      className={classes} 
      disabled={disabled || loading}
      onClick={onClick}
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
      {icon && !loading && iconPosition === 'left' && (
        <span className="button-icon button-icon--left">
          {icon}
        </span>
      )}
      <span className="button-text">
        {children}
      </span>
      {icon && !loading && iconPosition === 'right' && (
        <span className="button-icon button-icon--right">
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button; 
