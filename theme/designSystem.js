// Sistema de Diseño Unificado - Hydora
// Paleta de colores, tipografía, espaciado y componentes base

export const theme = {
  // Paleta de colores
  colors: {
    // Colores primarios
    primary: '#1F6FEB',
    primaryHover: '#1D5FD8',
    primaryLight: '#E8F2FF',
    
    // Colores secundarios
    secondary: '#22C55E',
    secondaryHover: '#1EA34D',
    secondaryLight: '#F0FDF4',
    
    // Colores de estado
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Colores de fondo
    background: '#F5F7FA',
    surface: '#FFFFFF',
    surfaceHover: '#F9FAFB',
    
    // Colores de texto
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
      tertiary: '#6B7280',
      disabled: '#9CA3AF',
      inverse: '#FFFFFF'
    },
    
    // Colores de borde
    border: {
      light: '#E5E7EB',
      medium: '#D1D5DB',
      dark: '#9CA3AF'
    },
    
    // Estados de reportes
    status: {
      pending: '#F59E0B',
      inProgress: '#3B82F6',
      resolved: '#22C55E',
      rejected: '#EF4444'
    },
    
    // Prioridades
    priority: {
      low: '#22C55E',
      medium: '#F59E0B',
      high: '#F97316',
      urgent: '#EF4444'
    }
  },

  // Tipografía
  typography: {
    fontFamily: {
      primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'SF Mono, Monaco, Inconsolata, "Roboto Mono", monospace'
    },
    
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px'
    },
    
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },

  // Espaciado (múltiplos de 8)
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    9: '36px',
    10: '40px',
    12: '48px',
    14: '56px',
    16: '64px',
    20: '80px',
    24: '96px',
    32: '128px'
  },

  // Bordes y radios
  borderRadius: {
    none: '0px',
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px'
  },

  // Sombras
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 4px 10px rgba(31, 41, 55, 0.08)',
    md: '0 8px 25px rgba(31, 41, 55, 0.12)',
    lg: '0 15px 40px rgba(31, 41, 55, 0.12)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },

  // Breakpoints
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // Z-index
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
  },

  // Transiciones
  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out'
  }
};

// Componentes base
export const components = {
  // Botones
  button: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing[2],
      border: 'none',
      borderRadius: theme.borderRadius.md,
      fontFamily: theme.typography.fontFamily.primary,
      fontWeight: theme.typography.fontWeight.medium,
      cursor: 'pointer',
      transition: `all ${theme.transitions.base}`,
      textDecoration: 'none',
      outline: 'none'
    },
    
    sizes: {
      sm: {
        height: '32px',
        padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
        fontSize: theme.typography.fontSize.sm
      },
      md: {
        height: '40px',
        padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
        fontSize: theme.typography.fontSize.base
      },
      lg: {
        height: '48px',
        padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
        fontSize: theme.typography.fontSize.lg
      }
    },
    
    variants: {
      primary: {
        backgroundColor: theme.colors.primary,
        color: theme.colors.text.inverse,
        '&:hover': {
          backgroundColor: theme.colors.primaryHover,
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows.md
        },
        '&:active': {
          transform: 'translateY(0)'
        }
      },
      
      secondary: {
        backgroundColor: theme.colors.secondary,
        color: theme.colors.text.inverse,
        '&:hover': {
          backgroundColor: theme.colors.secondaryHover,
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows.md
        }
      },
      
      outline: {
        backgroundColor: 'transparent',
        color: theme.colors.primary,
        border: `1px solid ${theme.colors.primary}`,
        '&:hover': {
          backgroundColor: theme.colors.primaryLight,
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows.md
        }
      },
      
      ghost: {
        backgroundColor: 'transparent',
        color: theme.colors.text.primary,
        '&:hover': {
          backgroundColor: theme.colors.surfaceHover
        }
      }
    }
  },

  // Cards
  card: {
    base: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      boxShadow: theme.shadows.base,
      border: `1px solid ${theme.colors.border.light}`,
      overflow: 'hidden',
      transition: `all ${theme.transitions.base}`
    },
    
    variants: {
      default: {
        padding: theme.spacing[4]
      },
      
      compact: {
        padding: theme.spacing[3]
      },
      
      spacious: {
        padding: theme.spacing[6]
      }
    }
  },

  // Inputs
  input: {
    base: {
      width: '100%',
      padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
      border: `1px solid ${theme.colors.border.medium}`,
      borderRadius: theme.borderRadius.base,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.primary,
      backgroundColor: theme.colors.surface,
      transition: `all ${theme.transitions.base}`,
      '&:focus': {
        outline: 'none',
        borderColor: theme.colors.primary,
        boxShadow: `0 0 0 3px ${theme.colors.primaryLight}`
      },
      '&:disabled': {
        backgroundColor: theme.colors.surfaceHover,
        color: theme.colors.text.disabled,
        cursor: 'not-allowed'
      }
    }
  },

  // Tipografía
  typography: {
    h1: {
      fontSize: theme.typography.fontSize['4xl'],
      fontWeight: theme.typography.fontWeight.bold,
      lineHeight: theme.typography.lineHeight.tight,
      color: theme.colors.text.primary
    },
    
    h2: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.semibold,
      lineHeight: theme.typography.lineHeight.tight,
      color: theme.colors.text.primary
    },
    
    h3: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.semibold,
      lineHeight: theme.typography.lineHeight.tight,
      color: theme.colors.text.primary
    },
    
    body: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.normal,
      lineHeight: theme.typography.lineHeight.normal,
      color: theme.colors.text.primary
    },
    
    caption: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.normal,
      lineHeight: theme.typography.lineHeight.normal,
      color: theme.colors.text.secondary
    }
  }
};

// Utilidades para dark mode
export const darkMode = {
  colors: {
    background: '#1F2937',
    surface: '#374151',
    surfaceHover: '#4B5563',
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
      tertiary: '#9CA3AF',
      disabled: '#6B7280',
      inverse: '#1F2937'
    },
    border: {
      light: '#4B5563',
      medium: '#6B7280',
      dark: '#9CA3AF'
    }
  }
};

// Función para aplicar estilos
export const applyStyles = (component, variant = 'default', size = 'md') => {
  const baseStyles = components[component]?.base || {};
  const variantStyles = components[component]?.variants?.[variant] || {};
  const sizeStyles = components[component]?.sizes?.[size] || {};
  
  return {
    ...baseStyles,
    ...variantStyles,
    ...sizeStyles
  };
};

// Función para obtener color
export const getColor = (colorPath) => {
  const path = colorPath.split('.');
  let value = theme.colors;
  
  for (const key of path) {
    value = value[key];
  }
  
  return value;
};

// Función para obtener espaciado
export const getSpacing = (size) => {
  return theme.spacing[size] || size;
};

export default theme; 