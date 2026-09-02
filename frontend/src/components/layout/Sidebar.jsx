import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  FileText,
  BarChart3,
  CheckSquare,
  FolderKanban,
  Users,
  Settings,
  ShieldCheck,
  UserCheck,
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuthStore();
  const isManagerOrAdmin = user?.role === 'manager' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  const navItems = [
    { label: 'My Report', path: '/my-report', icon: FileText, roles: ['member', 'manager', 'admin'] },
    { label: 'Report History', path: '/reports-history', icon: CheckSquare, roles: ['member', 'manager', 'admin'] },
    { label: 'Manager Review Queue', path: '/manager-review', icon: UserCheck, roles: ['manager', 'admin'] },
    { label: 'Team Dashboard', path: '/dashboard', icon: BarChart3, roles: ['manager', 'admin'] },
    { label: 'Projects', path: '/projects', icon: FolderKanban, roles: ['manager', 'admin'] },
    { label: 'User Management', path: '/users', icon: Users, roles: ['admin', 'manager'] },
    { label: 'Account Settings', path: '/settings', icon: Settings, roles: ['member', 'manager', 'admin'] },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--color-sidebar-bg)',
      color: 'var(--color-sidebar-text)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF'
        }}>
          <Sparkles size={20} />
        </div>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF', fontFamily: 'var(--font-family-heading)' }}>Team Pulse</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-sidebar-text)' }}>Weekly Report Hub</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ padding: '20px 12px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          if (!item.roles.includes(user?.role || 'member')) return null;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                fontWeight: isActive ? '600' : '400',
                color: isActive ? 'var(--color-sidebar-text-active)' : 'var(--color-sidebar-text)',
                backgroundColor: isActive ? 'var(--color-sidebar-active)' : 'transparent',
                transition: 'background-color 0.15s ease'
              })}
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Role Badge */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#0D1120'
      }}>
        <div>
          <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#FFFFFF' }}>{user?.name}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-sidebar-text)' }}>{user?.email}</p>
        </div>
        <span style={{
          fontSize: '0.6875rem',
          fontWeight: '700',
          padding: '2px 8px',
          borderRadius: '12px',
          backgroundColor: isManagerOrAdmin ? '#312E81' : '#1E293B',
          color: isManagerOrAdmin ? '#C7D2FE' : '#94A3B8',
          textTransform: 'uppercase'
        }}>
          {user?.role}
        </span>
      </div>
    </aside>
  );
}
