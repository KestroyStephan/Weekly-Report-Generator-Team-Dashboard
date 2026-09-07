import React from 'react';

export default function BlockersByProjectChart({ projects = [] }) {
  const colors = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#8B5CF6'];

  const items = projects.length > 0 ? projects.map((p, idx) => ({
    name: p.name || p.project_name || `Project ${idx + 1}`,
    count: p.open_blockers || p.task_count || 0,
    color: colors[idx % colors.length]
  })) : [];

  const maxCount = Math.max(...items.map(i => i.count), 1);

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.05)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px'
    }}>
      <h3 style={{ fontSize: '1.0625rem', fontWeight: '800', color: '#0F2942', margin: 0 }}>
        Blockers by Project
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {items.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: '#64748B', fontSize: '0.875rem' }}>
            No active project blockers recorded.
          </div>
        ) : (
          items.map((item, idx) => {
            const pct = Math.round((item.count / maxCount) * 100);
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>
                  <span>{item.name}</span>
                  <span style={{ fontWeight: '800', color: '#0F172A' }}>{item.count}</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#F1F5F9',
                  borderRadius: '9999px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    backgroundColor: item.color,
                    borderRadius: '9999px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
