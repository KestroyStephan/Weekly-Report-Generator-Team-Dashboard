import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md',          // 'sm' | 'md' | 'lg'
  icon: Icon,
  disabled = false,
  isLoading = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '500',
    borderRadius: 'var(--radius-sm)',
    transition: 'all 0.15s ease-in-out',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.6 : 1,
    whiteSpace: 'nowrap'
  };

  const sizes = {
    sm: { padding: '6px 12px', fontSize: '0.8125rem' },
    md: { padding: '9px 16px', fontSize: '0.875rem' },
    lg: { padding: '12px 20px', fontSize: '1rem' }
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: '#FFFFFF',
      border: 'none',
    },
    secondary: {
      backgroundColor: '#E2E8F0',
      color: '#1E293B',
      border: 'none',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--color-text-primary)',
      border: '1px solid var(--color-card-border)',
    },
    danger: {
      backgroundColor: '#EF4444',
      color: '#FFFFFF',
      border: 'none',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-text-secondary)',
      border: 'none',
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      style={{ ...baseStyle, ...sizes[size], ...variants[variant] }}
      className={className}
      {...props}
    >
      {isLoading ? (
        <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
    </button>
  );
}
