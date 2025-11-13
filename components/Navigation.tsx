import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { getMenuByRole, UserRole } from '../types/roles';
import './Navigation.css';

// SVG Icons
const WaterDropIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
    <path d="M12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18Z" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const LogoutIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('hydora:nav-collapsed');
      if (stored !== null) setCollapsed(stored === 'true');
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('hydora:nav-collapsed', String(collapsed));
    } catch (e) {
      // ignore
    }
  }, [collapsed]);

  // Sync body class so Layout can respond immediately when navigation is toggled
  useEffect(() => {
    try {
      if (collapsed) document.body.classList.add('nav-collapsed');
      else document.body.classList.remove('nav-collapsed');
    } catch (e) {
      // ignore
    }
  }, [collapsed]);

  if (!user) return null;

  const menuItems = getMenuByRole(user.role as UserRole);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'AUTHORITY': return 'Autoridad';
      case 'CITIZEN': return 'Ciudadano';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'admin';
      case 'AUTHORITY': return 'authority';
      case 'CITIZEN': return 'citizen';
      default: return 'citizen';
    }
  };

  return (
    <nav className={`navigation ${collapsed ? 'collapsed' : 'expanded'}`} aria-label="Panel lateral">
      <div className="navigation-container">
        <div className="navigation-top">
          {/* Logo y título */}
          <div className="navigation-brand">
            <div className="navigation-logo">
              <WaterDropIcon />
            </div>
            {!collapsed && (
              <div>
                <h1 className="navigation-title">Hydora</h1>
                <p className="navigation-subtitle">{getRoleDisplayName(user.role)}</p>
              </div>
            )}
          </div>

          {/* Collapse toggle */}
          <button
            className="navigation-toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Abrir menú lateral' : 'Cerrar menú lateral'}
            aria-pressed={collapsed}
            title={collapsed ? 'Abrir' : 'Ocultar'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Menú de navegación */}
        <div className="navigation-menu" role="navigation" aria-label="Menú lateral">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`navigation-link ${location.pathname === item.path ? 'active' : ''}`}
              title={item.label}
              aria-current={location.pathname === item.path ? 'page' : undefined}
            >
              <span className="navigation-link-icon" aria-hidden={true}>{/* placeholder for icon */}</span>
              {!collapsed && <span className="navigation-link-label">{item.label}</span>}
            </Link>
          ))}
        </div>

        {/* Usuario y logout */}
        <div className="navigation-user">
          <div className="navigation-user-info">
            <div className={`navigation-user-avatar ${getRoleColor(user.role)}`}>
              {user.name?.charAt(0) || 'U'}
            </div>
            {!collapsed && (
              <div className="navigation-user-details">
                <p className="navigation-user-name">{user.name}</p>
                <p className="navigation-user-email">{user.email}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="navigation-logout"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogoutIcon />
            {!collapsed && <span style={{ marginLeft: 8 }}>Cerrar Sesión</span>}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;