import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import logoImg from '../../assets/Logo.png';
import {
  FileText,
  BarChart3,
  CheckSquare,
  FolderKanban,
  Users,
  Settings,
  UserCheck
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuthStore();
  const isManagerOrAdmin = user?.role === 'manager' || user?.role === 'admin';

  const navItems = [
    { label: isManagerOrAdmin ? 'Team Dashboard' : 'My Dashboard', path: '/dashboard', icon: BarChart3, roles: ['member', 'manager', 'admin'] },
    { label: 'My Weekly Report', path: '/my-report', icon: FileText, roles: ['member'] },
    { label: 'Report History', path: '/reports-history', icon: CheckSquare, roles: ['member', 'manager', 'admin'] },
    { label: 'Manager Review Queue', path: '/manager-review', icon: UserCheck, roles: ['manager', 'admin'] },
    { label: 'Projects', path: '/projects', icon: FolderKanban, roles: ['manager', 'admin'] },
    { label: 'User Management', path: '/users', icon: Users, roles: ['admin', 'manager'] },
    { label: 'Account Settings', path: '/settings', icon: Settings, roles: ['member', 'manager', 'admin'] },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#042316',
      color: '#95B5A0',
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
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <img
          src={logoImg}
          alt="WorkPulse Logo"
          style={{
            height: '52px',
            width: 'auto',
            maxHeight: '52px',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Navigation Menu */}
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
                gap: '14px',
                padding: '12px 16px',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#FFFFFF' : '#95B5A0',
                backgroundColor: isActive ? '#0C422B' : 'transparent',
                transition: 'all 0.15s ease'
              })}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer User Info */}
      <div style={{
        padding: '18px 20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#02190F'
      }}>
        <div>
          <p style={{ fontSize: '0.875rem', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>{user?.name}</p>
          <p style={{ fontSize: '0.75rem', color: '#7DE8B5', margin: 0 }}>{user?.email}</p>
        </div>
        <span style={{
          fontSize: '0.6875rem',
          fontWeight: '800',
          padding: '4px 10px',
          borderRadius: '12px',
          backgroundColor: isManagerOrAdmin ? '#0C422B' : '#072E1E',
          color: isManagerOrAdmin ? '#7DE8B5' : '#95B5A0',
          border: isManagerOrAdmin ? '1px solid #146B46' : '1px solid rgba(255,255,255,0.08)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          {user?.role}
        </span>
      </div>
    </aside>
  );
}
