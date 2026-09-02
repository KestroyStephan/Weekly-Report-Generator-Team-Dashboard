import React, { useState } from 'react';
import Button from '../common/Button';
import { CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react';

export default function ReviewPanel({ report, onSubmitReview, isLoading = false }) {
  const [action, setAction] = useState('approve'); // 'approve' | 'request_changes'
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (action === 'request_changes' && !comment.trim()) {
      setError('Please provide feedback/comments explaining what changes are required.');
      return;
    }
    setError('');
    onSubmitReview({ action, comment });
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: '#FFFFFF',
      padding: '24px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-card-border)',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <MessageSquare size={20} style={{ color: 'var(--color-primary)' }} />
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
          Manager Review Actions
        </h3>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button
          type="button"
          onClick={() => { setAction('approve'); setError(''); }}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: 'var(--radius-sm)',
            border: action === 'approve' ? '2px solid #16A34A' : '1px solid var(--color-card-border)',
            backgroundColor: action === 'approve' ? '#F0FDF4' : '#FFFFFF',
            color: action === 'approve' ? '#15803D' : 'var(--color-text-secondary)',
            fontWeight: '600',
            fontSize: '0.9375rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle size={18} />
          Approve Report
        </button>

        <button
          type="button"
          onClick={() => { setAction('request_changes'); setError(''); }}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: 'var(--radius-sm)',
            border: action === 'request_changes' ? '2px solid #D97706' : '1px solid var(--color-card-border)',
            backgroundColor: action === 'request_changes' ? '#FFFBEB' : '#FFFFFF',
            color: action === 'request_changes' ? '#B45309' : 'var(--color-text-secondary)',
            fontWeight: '600',
            fontSize: '0.9375rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <AlertTriangle size={18} />
          Request Changes
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-secondary)' }}>
          Reviewer Feedback & Comments {action === 'request_changes' && <span style={{ color: '#EF4444' }}>*</span>}
        </label>
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={
            action === 'approve'
              ? 'Optional praise or feedback for the team member...'
              : 'Clearly explain what needs correction (e.g., add missing tasks, update time hours)...'
          }
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            border: error ? '1px solid #EF4444' : '1px solid var(--color-card-border)',
            fontSize: '0.875rem',
            outline: 'none',
            resize: 'vertical'
          }}
        />
        {error && <span style={{ fontSize: '0.75rem', color: '#EF4444' }}>{error}</span>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant={action === 'approve' ? 'primary' : 'secondary'}
          isLoading={isLoading}
        >
          {action === 'approve' ? 'Confirm Approval' : 'Send Correction Request'}
        </Button>
      </div>
    </form>
  );
}
