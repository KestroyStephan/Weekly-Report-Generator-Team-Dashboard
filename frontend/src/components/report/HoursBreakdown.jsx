import React from 'react';
import { Clock, PieChart } from 'lucide-react';

export default function HoursBreakdown({ hours = {}, onChange, isReadOnly = false }) {
  const categories = [
    { key: 'development', label: 'Development', color: '#0D8A6A', bgColor: '#ECFDF5' },
    { key: 'testing', label: 'Testing & QA', color: '#0284C7', bgColor: '#F0F9FF' },
    { key: 'meetings', label: 'Meetings & Syncs', color: '#D97706', bgColor: '#FFFBEB' },
    { key: 'documentation', label: 'Documentation', color: '#4F46E5', bgColor: '#EEF2FF' },
    { key: 'other', label: 'Other Activities', color: '#64748B', bgColor: '#F8FAFC' },
  ];

  const handleHourChange = (key, val) => {
    const num = Math.max(0, parseFloat(val) || 0);
    onChange({ ...hours, [key]: num });
  };

  const totalHours = categories.reduce((acc, cat) => acc + (hours[cat.key] || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: '#F0F9FF',
            color: '#0284C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Clock size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: '800', color: '#0F2942', margin: 0 }}>
              Section 5: Time Spent Breakdown (Hours)
            </h3>
            <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
              Distribute effort across project work categories
            </span>
          </div>
        </div>

        <div style={{
          fontSize: '0.9375rem',
          fontWeight: '800',
          color: '#0D8A6A',
          backgroundColor: '#ECFDF5',
          border: '1px solid #A7F3D0',
          padding: '6px 16px',
          borderRadius: '9999px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>Total Effort:</span>
          <span style={{ fontSize: '1.125rem', color: '#059669' }}>{totalHours.toFixed(1)} hrs</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: '14px'
      }}>
        {categories.map((cat) => {
          const val = hours[cat.key] ?? 0;
          return (
            <div
              key={cat.key}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                padding: '16px',
                borderRadius: '14px',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: cat.color
                }} />
                <label style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#475569' }}>
                  {cat.label}
                </label>
              </div>

              {isReadOnly ? (
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F2942' }}>
                  {val} <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>hrs</span>
                </div>
              ) : (
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={val}
                    onChange={(e) => handleHourChange(cat.key, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 28px 8px 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '0.9375rem',
                      fontWeight: '700',
                      outline: 'none',
                      color: '#0F2942',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = cat.color;
                      e.target.style.boxShadow = `0 0 0 3px ${cat.color}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#CBD5E1';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <span style={{ position: 'absolute', right: '10px', fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>
                    hrs
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
