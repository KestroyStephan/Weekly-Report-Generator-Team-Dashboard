import React from 'react';
import { Clock } from 'lucide-react';

export default function HoursBreakdown({ hours = {}, onChange, isReadOnly = false }) {
  const categories = [
    { key: 'development', label: 'Development' },
    { key: 'testing', label: 'Testing & QA' },
    { key: 'meetings', label: 'Meetings & Syncs' },
    { key: 'documentation', label: 'Documentation' },
    { key: 'other', label: 'Other Activities' },
  ];

  const handleHourChange = (key, val) => {
    const num = Math.max(0, parseFloat(val) || 0);
    onChange({ ...hours, [key]: num });
  };

  const totalHours = categories.reduce((acc, cat) => acc + (hours[cat.key] || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} style={{ color: 'var(--color-primary)' }} />
          Time Spent Breakdown (Hours)
        </h3>
        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-primary)' }}>
          Total: {totalHours.toFixed(1)} hrs
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        backgroundColor: '#F8FAFC',
        padding: '16px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-card-border)'
      }}>
        {categories.map((cat) => (
          <div key={cat.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--color-text-secondary)' }}>{cat.label}</label>
            {isReadOnly ? (
              <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                {hours[cat.key] || 0} <span style={{ fontSize: '0.75rem', fontWeight: '400' }}>hrs</span>
              </span>
            ) : (
              <input
                type="number"
                step="0.5"
                min="0"
                value={hours[cat.key] ?? 0}
                onChange={(e) => handleHourChange(cat.key, e.target.value)}
                style={{
                  padding: '6px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--color-card-border)',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
