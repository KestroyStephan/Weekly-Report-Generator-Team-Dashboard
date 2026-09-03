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
  style = {},
  ...props
}) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '600',
    borderRadius: 'var(--radius-sm)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.65 : 1,
    whiteSpace: 'nowrap',
    outline: 'none',
    border: 'none'
  };

  const sizes = {
    sm: { padding: '7px 14px', fontSize: '0.8125rem' },
    md: { padding: '10px 18px', fontSize: '0.875rem' },
    lg: { padding: '13px 24px', fontSize: '1rem' }
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
      color: '#FFFFFF',
      boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.35)',
    },
    secondary: {
      backgroundColor: '#F1F5F9',
      color: '#0F172A',
      border: '1px solid #E2E8F0',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--color-text-primary)',
      border: '1px solid var(--color-card-border)',
    },
    danger: {
      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      color: '#FFFFFF',
      boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.35)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-text-secondary)',
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      style={{
        ...baseStyle,
        ...sizes[size],
        ...variants[variant],
        ...style
      }}
      className={className}
      {...props}
    >
      {isLoading ? (
        <span style={{
          display: 'inline-block',
          width: '16px',
          height: '16px',
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
      ) : null}
      {children}
    </button>
  );
}
