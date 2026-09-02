import React from 'react';

export default function Input({
  label,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  style = {},
  ...props
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...style }} className={className}>
      {label && (
        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-secondary)' }}>
          {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        style={{
          padding: '9px 12px',
          borderRadius: 'var(--radius-sm)',
          border: error ? '1px solid #EF4444' : '1px solid var(--color-card-border)',
          backgroundColor: disabled ? '#F1F5F9' : '#FFFFFF',
          color: 'var(--color-text-primary)',
          fontSize: '0.875rem',
          outline: 'none',
          transition: 'border-color 0.15s ease',
          width: '100%'
        }}
        {...props}
      />
      {error && <span style={{ fontSize: '0.75rem', color: '#EF4444' }}>{error}</span>}
    </div>
  );
}
