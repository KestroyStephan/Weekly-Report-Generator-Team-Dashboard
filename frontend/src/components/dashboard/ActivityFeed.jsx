import React from 'react';
import { Activity, CheckCircle, AlertTriangle, Send } from 'lucide-react';
import { formatDateTime } from '../../utils/dateHelpers';

export default function ActivityFeed({ activities = [] }) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      padding: '20px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-card-border)',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Activity size={18} style={{ color: 'var(--color-primary)' }} />
        Recent Submissions & Review Activity
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {activities.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', italic: true }}>No recent activity recorded.</p>
        ) : (
          activities.map((act) => {
            const isApproved = act.action === 'approved';
            const isRequested = act.action === 'requested_changes';
            const Icon = isApproved ? CheckCircle : isRequested ? AlertTriangle : Send;
            const iconColor = isApproved ? '#16A34A' : isRequested ? '#D97706' : '#2563EB';

            return (
              <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.875rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: `${iconColor}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: iconColor,
                  flexShrink: 0
                }}>
                  <Icon size={16} />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <p style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>
                    {act.details}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {formatDateTime(act.timestamp)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
