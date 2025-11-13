import React from 'react';

// Componente para mejorar el contraste de texto
export const HighContrastText = ({ children, className = '', ...props }) => {
  return (
    <span 
      className={`text-gray-900 dark:text-white font-medium ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// Componente para etiquetas accesibles
export const AccessibleLabel = ({ htmlFor, children, required = false, className = '' }) => {
  return (
    <label 
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1" aria-label="requerido">*</span>}
    </label>
  );
};

// Componente para campos de entrada accesibles
export const AccessibleInput = ({ 
  id, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error,
  className = '',
  ...props 
}) => {
  const inputId = id || name;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div>
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-describedby={errorId}
        aria-invalid={error ? 'true' : 'false'}
        className={`mt-1 block w-full border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Componente para botones accesibles
export const AccessibleButton = ({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600',
    secondary: 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-indigo-500',
    danger: 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full border-b-2 border-white w-4 h-4 mr-2"></div>
      )}
      {children}
    </button>
  );
};

// Componente para skip links (navegaciÃ³n por teclado)
export const SkipLink = ({ href, children }) => {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-600 text-white px-4 py-2 rounded-md z-50"
    >
      {children}
    </a>
  );
};

// Componente para anuncios de estado
export const StatusAnnouncer = ({ message, type = 'info' }) => {
  const typeClasses = {
    info: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    error: 'text-red-600 dark:text-red-400',
  };

  return (
    <div
      className={`text-sm ${typeClasses[type]}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {message}
    </div>
  );
};

// Hook para manejo de teclado
export const useKeyboardNavigation = (onEscape, onEnter) => {
  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'Escape':
        if (onEscape) onEscape();
        break;
      case 'Enter':
        if (onEnter) onEnter();
        break;
      default:
        break;
    }
  };

  return handleKeyDown;
};

// Componente para focus trap
export const FocusTrap = ({ children, onEscape }) => {
  const handleKeyDown = useKeyboardNavigation(onEscape);

  return (
    <div
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
};

// Componente para mejor contraste de imÃ¡genes
export const AccessibleImage = ({ src, alt, className = '', ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`${className}`}
      loading="lazy"
      {...props}
    />
  );
};

// Componente para iconos accesibles
export const AccessibleIcon = ({ 
  icon: Icon, 
  label, 
  className = '', 
  ...props 
}) => {
  return (
    <Icon
      className={className}
      aria-label={label}
      role="img"
      {...props}
    />
  );
}; 
