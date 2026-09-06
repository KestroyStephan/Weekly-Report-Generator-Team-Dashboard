import React from 'react';
import { AlertTriangle, HelpCircle, CheckCircle2, Trash2, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  type = 'warning', // 'warning' | 'danger' | 'info' | 'success'
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  discardText = null,
  onConfirm,
  onCancel,
  onDiscard = null,
  isLoading = false,
  maxWidth = '460px'
}) {
  if (!isOpen) return null;

  const isDanger = type === 'danger';
  const isWarning = type === 'warning';
  const isSuccess = type === 'success';

  const Icon = isDanger
    ? Trash2
    : isWarning
    ? AlertTriangle
    : isSuccess
    ? CheckCircle2
    : HelpCircle;

  const iconBg = isDanger
    ? '#FEF2F2'
    : isWarning
    ? '#FFFBEB'
    : isSuccess
    ? '#F0FDF4'
    : '#E6F4F0';

  const iconColor = isDanger
    ? '#EF4444'
    : isWarning
    ? '#D97706'
    : isSuccess
    ? '#16A34A'
    : '#0D8A6A';

  const confirmBtnBg = isDanger
    ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
    : isWarning
    ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
    : 'linear-gradient(135deg, #0D8A6A 0%, #0B7A5D 100%)';

  const confirmBtnShadow = isDanger
    ? '0 8px 18px -4px rgba(239, 68, 68, 0.35)'
    : isWarning
    ? '0 8px 18px -4px rgba(217, 119, 6, 0.35)'
    : '0 8px 18px -4px rgba(13, 138, 106, 0.35)';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2500,
      padding: '16px',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.3), 0 0 0 1px rgba(0,0,0,0.04)',
        width: '100%',
        maxWidth,
        padding: '32px 28px 24px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        boxSizing: 'border-box'
      }}>
        {/* Close Button */}
        <button
          onClick={onCancel}
          disabled={isLoading}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.15s ease'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header Icon & Content */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            backgroundColor: iconBg,
            color: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 4px 12px ${iconBg}`
          }}>
            <Icon size={24} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '2px' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '800',
              color: '#0F2942',
              margin: 0,
              lineHeight: 1.2
            }}>
              {title}
            </h3>
            <p style={{
              fontSize: '0.9375rem',
              color: '#475569',
              margin: 0,
              lineHeight: 1.5,
              fontWeight: '400'
            }}>
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px',
          marginTop: '8px',
          flexWrap: 'wrap'
        }}>
          {/* Cancel Button */}
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              border: '1.5px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#475569',
              fontSize: '0.9375rem',
              fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#F8FAFC')}
            onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#FFFFFF')}
          >
            {cancelText}
          </button>

          {/* Optional Discard Button (for 3-button layout) */}
          {onDiscard && (
            <button
              type="button"
              onClick={onDiscard}
              disabled={isLoading}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1.5px solid #FCA5A5',
                backgroundColor: '#FEF2F2',
                color: '#B91C1C',
                fontSize: '0.9375rem',
                fontWeight: '700',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {discardText || 'Discard'}
            </button>
          )}

          {/* Confirm Primary Button */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: confirmBtnBg,
              color: '#FFFFFF',
              fontSize: '0.9375rem',
              fontWeight: '800',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: confirmBtnShadow,
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseOver={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseOut={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
