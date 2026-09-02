import React from 'react';

export default function Select({
  label,
  options = [], // Array of { value, label } or strings
  value,
  onChange,
  error,
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
      <select
        value={value ?? ''}
        onChange={onChange}
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
          cursor: disabled ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
        {...props}
      >
        {options.map((opt, idx) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return <option key={idx} value={val}>{lbl}</option>;
        })}
      </select>
      {error && <span style={{ fontSize: '0.75rem', color: '#EF4444' }}>{error}</span>}
    </div>
  );
}
