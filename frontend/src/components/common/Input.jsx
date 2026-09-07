import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({
  label,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  icon: Icon,
  className = '',
  style = {},
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPasswordType = type === 'password';
  const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...style }} className={className}>
      {label && (
        <label style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#0F2942', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
        </label>
      )}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%'
      }}>
        {Icon && (
          <div style={{
            position: 'absolute',
            left: '14px',
            color: isFocused ? '#0D8A6A' : '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            transition: 'color 0.2s ease'
          }}>
            <Icon size={18} />
          </div>
        )}
        <input
          type={inputType}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            width: '100%',
            padding: '12px 14px',
            paddingLeft: Icon ? '44px' : '14px',
            paddingRight: isPasswordType ? '44px' : '14px',
            borderRadius: '12px',
            border: error
              ? '1.5px solid #EF4444'
              : isFocused
              ? '1.5px solid #0D8A6A'
              : '1.5px solid #CBD5E1',
            backgroundColor: disabled ? '#F8FAFC' : '#FFFFFF',
            color: '#0F2942',
            fontSize: '0.9375rem',
            outline: 'none',
            boxShadow: isFocused ? '0 0 0 4px rgba(13, 138, 106, 0.12)' : '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '14px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: '600' }}>{error}</span>}
    </div>
  );
}
