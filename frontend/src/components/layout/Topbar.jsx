import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { notificationsApi } from '../../api/notificationsApi';
import { LogOut, Bell, CheckCheck, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ title }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsApi.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      // Handle error gracefully
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      // Handle error gracefully
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.is_read) {
      try {
        await notificationsApi.markRead(notif.id);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
      } catch (err) {}
    }
    setShowNotifications(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header style={{
      height: '64px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--color-card-border)',
      padding: '0 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-primary)', fontFamily: 'var(--font-family-heading)' }}>
        {title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        {/* Notifications Center */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Team Notifications"
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s ease'
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: '0.6875rem',
                fontWeight: '700',
                borderRadius: '10px',
                padding: '1px 5px',
                minWidth: '16px',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(239, 68, 68, 0.4)'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '40px',
              right: '0',
              width: '340px',
              maxHeight: '420px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
              border: '1px solid var(--color-card-border)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 200,
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#F8FAFC',
                borderBottom: '1px solid var(--color-card-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0 }}>
                  Notifications {unreadCount > 0 ? `(${unreadCount} new)` : ''}
                </h4>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-primary)',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>

              <div style={{ overflowY: 'auto', flexGrow: 1, padding: '4px 0' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      style={{
                        padding: '10px 14px',
                        borderBottom: '1px solid var(--color-card-border)',
                        backgroundColor: n.is_read ? '#FFFFFF' : '#F0FDF4',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'flex-start',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <div style={{ marginTop: '2px', flexShrink: 0 }}>
                        {n.type === 'approval' ? (
                          <CheckCircle size={16} style={{ color: '#16A34A' }} />
                        ) : n.type === 'review_request' ? (
                          <AlertTriangle size={16} style={{ color: '#D97706' }} />
                        ) : (
                          <FileText size={16} style={{ color: '#2563EB' }} />
                        )}
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <strong style={{ fontSize: '0.8125rem', color: 'var(--color-text-primary)', display: 'block' }}>
                          {n.title}
                        </strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>
                          {n.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#F0FDF4',
            color: '#0D8A6A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            fontSize: '0.875rem'
          }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-primary)' }}>
            {user?.name}
          </span>
        </div>

        <button
          onClick={handleLogout}
          title="Logout"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.875rem',
            padding: '6px 10px',
            borderRadius: 'var(--radius-sm)',
            transition: 'background-color 0.15s ease'
          }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

