import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import QuickAccessButton from './QuickAccessButton';
import './layout.css';

interface LayoutProps {
  children: React.ReactNode;
  showQuickAccess?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showQuickAccess = true }) => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('hydora:nav-collapsed');
      setCollapsed(stored === 'true');
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      if (collapsed) document.body.classList.add('nav-collapsed');
      else document.body.classList.remove('nav-collapsed');
    } catch (e) {
      // ignore
    }
  }, [collapsed]);

  return (
    <div className="hydora-layout">
      <Navigation />
      <main className="hydora-main">
        {children}
      </main>
      {showQuickAccess && <QuickAccessButton />}
    </div>
  );
};

export default Layout;