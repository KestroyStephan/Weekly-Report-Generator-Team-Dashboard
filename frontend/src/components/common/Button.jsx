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
    fontWeight: '700',
    borderRadius: '12px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.65 : 1,
    whiteSpace: 'nowrap',
    outline: 'none',
    border: 'none',
    userSelect: 'none'
  };

  const sizes = {
    sm: { padding: '8px 14px', fontSize: '0.8125rem' },
    md: { padding: '11px 20px', fontSize: '0.875rem' },
    lg: { padding: '14px 26px', fontSize: '1rem' }
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      color: '#FFFFFF',
      boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.35)',
    },
    secondary: {
      backgroundColor: '#ECFDF5',
      color: '#065F46',
      border: '1px solid #A7F3D0',
    },
    outline: {
      backgroundColor: '#FFFFFF',
      color: '#0D8A6A',
      border: '1.5px solid #0D8A6A',
    },
    danger: {
      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      color: '#FFFFFF',
      boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.35)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#0D8A6A',
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
      onMouseOver={(e) => {
        if (!disabled && !isLoading) {
          if (variant === 'primary') {
            e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(16, 185, 129, 0.45)';
            e.currentTarget.style.transform = 'translateY(-1.5px)';
          } else if (variant === 'outline') {
            e.currentTarget.style.backgroundColor = '#ECFDF5';
          }
        }
      }}
      onMouseOut={(e) => {
        if (!disabled && !isLoading) {
          if (variant === 'primary') {
            e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(16, 185, 129, 0.35)';
            e.currentTarget.style.transform = 'translateY(0)';
          } else if (variant === 'outline') {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
          }
        }
      }}
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
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} style={{ strokeWidth: 2.2 }} />
      ) : null}
      {children}
    </button>
  );
}
