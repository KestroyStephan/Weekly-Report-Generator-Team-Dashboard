import React from 'react';

export default function Badge({ children, variant = 'gray' }) {
  const styles = {
    gray: { bg: 'var(--status-draft-bg)', text: 'var(--status-draft-text)', border: 'var(--status-draft-border)' },
    blue: { bg: 'var(--status-submitted-bg)', text: 'var(--status-submitted-text)', border: 'var(--status-submitted-border)' },
    amber: { bg: 'var(--status-correction-bg)', text: 'var(--status-correction-text)', border: 'var(--status-correction-border)' },
    green: { bg: 'var(--status-approved-bg)', text: 'var(--status-approved-text)', border: 'var(--status-approved-border)' },
    indigo: { bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE' }
  };

  const current = styles[variant] || styles.gray;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 10px',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.75rem',
      fontWeight: '600',
      backgroundColor: current.bg,
      color: current.text,
      border: `1px solid ${current.border}`,
      textTransform: 'capitalize'
    }}>
      {children}
    </span>
  );
}
