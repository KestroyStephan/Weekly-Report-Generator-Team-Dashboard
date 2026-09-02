import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Toast from '../common/Toast';
import ChatWidget from '../chat/ChatWidget';
import { useAuthStore } from '../../store/authStore';

export default function AppLayout() {
  const location = useLocation();
  const { user } = useAuthStore();
  const isManager = user?.role === 'manager' || user?.role === 'admin';

  // Map route to page title
  const getTitle = (pathname) => {
    if (pathname.startsWith('/my-report')) return 'My Weekly Report';
    if (pathname.startsWith('/reports-history')) return 'Report History';
    if (pathname.startsWith('/manager-review')) return 'Manager Review Queue';
    if (pathname.startsWith('/dashboard')) return 'Team Analytics Dashboard';
    if (pathname.startsWith('/projects')) return 'Project Management';
    if (pathname.startsWith('/users')) return 'User & Role Management';
    if (pathname.startsWith('/settings')) return 'Account Settings';
    if (pathname.startsWith('/member/')) return 'Team Member Profile';
    if (pathname.startsWith('/reports/')) return 'Report Detail View';
    return 'Dashboard';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-canvas-bg)' }}>
      <Sidebar />
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar title={getTitle(location.pathname)} />
        <main style={{ padding: '28px', flexGrow: 1 }}>
          <Outlet />
        </main>
      </div>
      <Toast />
      {isManager && <ChatWidget />}
    </div>
  );
}
