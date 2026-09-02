import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No records found', description = 'There is no data to display right now.', icon: Icon = Inbox, action }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-md)',
      border: '1px border-dashed var(--color-card-border)',
      color: 'var(--color-text-secondary)'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: '#F1F5F9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        color: 'var(--color-text-muted)'
      }}>
        <Icon size={24} />
      </div>
      <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '4px' }}>{title}</h4>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', maxWidth: '360px', marginBottom: action ? '20px' : '0' }}>{description}</p>
      {action}
    </div>
  );
}
