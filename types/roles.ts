// Tipos de roles
export type UserRole = 'CITIZEN' | 'AUTHORITY' | 'ADMIN';

// Interfaz para permisos
export interface Permission {
  action: string;
  resource: string;
  roles: UserRole[];
}

// Interfaz para menú
export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  roles: UserRole[];
  children?: MenuItem[];
}

// Permisos del sistema
export const PERMISSIONS: Permission[] = [
  // Reportes
  { action: 'create', resource: 'reports', roles: ['CITIZEN', 'AUTHORITY', 'ADMIN'] },
  { action: 'read', resource: 'own-reports', roles: ['CITIZEN', 'AUTHORITY', 'ADMIN'] },
  { action: 'read', resource: 'all-reports', roles: ['AUTHORITY', 'ADMIN'] },
  { action: 'update', resource: 'own-reports', roles: ['CITIZEN', 'AUTHORITY', 'ADMIN'] },
  { action: 'update', resource: 'all-reports', roles: ['AUTHORITY', 'ADMIN'] },
  { action: 'delete', resource: 'own-reports', roles: ['CITIZEN', 'AUTHORITY', 'ADMIN'] },
  { action: 'delete', resource: 'all-reports', roles: ['ADMIN'] },
  { action: 'assign', resource: 'reports', roles: ['AUTHORITY', 'ADMIN'] },
  { action: 'change-status', resource: 'reports', roles: ['AUTHORITY', 'ADMIN'] },

  // Usuarios
  { action: 'read', resource: 'users', roles: ['ADMIN'] },
  { action: 'create', resource: 'users', roles: ['ADMIN'] },
  { action: 'update', resource: 'users', roles: ['ADMIN'] },
  { action: 'delete', resource: 'users', roles: ['ADMIN'] },
  { action: 'change-role', resource: 'users', roles: ['ADMIN'] },

  // Dashboard
  { action: 'read', resource: 'dashboard-citizen', roles: ['CITIZEN'] },
  { action: 'read', resource: 'dashboard-authority', roles: ['AUTHORITY', 'ADMIN'] },
  { action: 'read', resource: 'dashboard-admin', roles: ['ADMIN'] },

  // Mapa
  { action: 'read', resource: 'map-public', roles: ['CITIZEN', 'AUTHORITY', 'ADMIN'] },
  { action: 'read', resource: 'map-admin', roles: ['AUTHORITY', 'ADMIN'] },

  // Guía educativa
  { action: 'read', resource: 'guide', roles: ['CITIZEN', 'AUTHORITY', 'ADMIN'] },

  // Perfil
  { action: 'read', resource: 'profile', roles: ['CITIZEN', 'AUTHORITY', 'ADMIN'] },
  { action: 'update', resource: 'profile', roles: ['CITIZEN', 'AUTHORITY', 'ADMIN'] },
];

// Menú por roles
export const MENU_ITEMS: MenuItem[] = [
  // Dashboard
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'BarChart3',
    roles: ['CITIZEN', 'AUTHORITY', 'ADMIN']
  },

  // Reportes
  {
    id: 'create-report',
    label: 'Crear Reporte',
    path: '/create-report',
    icon: 'PlusCircle',
    roles: ['CITIZEN', 'AUTHORITY', 'ADMIN']
  },
  {
    id: 'my-reports',
    label: 'Mis Reportes',
    path: '/my-reports',
    icon: 'FileText',
    roles: ['CITIZEN']
  },
  {
    id: 'all-reports',
    label: 'Panel de Reportes',
    path: '/reports',
    icon: 'ClipboardList',
    roles: ['AUTHORITY', 'ADMIN']
  },

  // Mapa
  {
    id: 'map',
    label: 'Mapa',
    path: '/map',
    icon: 'Map',
    roles: ['CITIZEN', 'AUTHORITY', 'ADMIN']
  },

  // Guías de agua
  {
    id: 'guide',
    label: 'Guías de Agua',
    path: '/guide',
    icon: 'BookOpen',
    roles: ['CITIZEN', 'AUTHORITY', 'ADMIN']
  },

  // Gestión de usuarios (solo admin)
  {
    id: 'users',
    label: 'Gestión de Usuarios',
    path: '/users',
    icon: 'Users',
    roles: ['ADMIN']
  },

  // Perfil
  {
    id: 'profile',
    label: 'Mi Perfil',
    path: '/profile',
    icon: 'User',
    roles: ['CITIZEN', 'AUTHORITY', 'ADMIN']
  }
];

// Función para verificar permisos
export const hasPermission = (userRole: UserRole, action: string, resource: string): boolean => {
  const permission = PERMISSIONS.find(p => 
    p.action === action && 
    p.resource === resource && 
    p.roles.includes(userRole)
  );
  return !!permission;
};

// Función para obtener menú según rol
export const getMenuByRole = (role: UserRole): MenuItem[] => {
  return MENU_ITEMS.filter(item => item.roles.includes(role));
};

// Función para verificar acceso a ruta
export const canAccessRoute = (userRole: UserRole, path: string): boolean => {
  const menuItem = MENU_ITEMS.find(item => item.path === path);
  return menuItem ? menuItem.roles.includes(userRole) : false;
}; 