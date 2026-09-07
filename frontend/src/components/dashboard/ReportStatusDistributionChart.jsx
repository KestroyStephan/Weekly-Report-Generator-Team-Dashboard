import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

export default function ReportStatusDistributionChart({ summary = {} }) {
  const totalApproved = summary.total_approved || 0;
  const totalNeedsReview = summary.total_pending_review || 0;
  const totalNeedsCorrection = summary.total_needs_correction || 0;
  const totalReports = totalApproved + totalNeedsReview + totalNeedsCorrection;

  const data = [
    { name: 'Approved', value: totalApproved, color: '#10B981', pct: totalReports > 0 ? Math.round((totalApproved / totalReports) * 100) : 0 },
    { name: 'Needs Review', value: totalNeedsReview, color: '#F59E0B', pct: totalReports > 0 ? Math.round((totalNeedsReview / totalReports) * 100) : 0 },
    { name: 'Needs Correction', value: totalNeedsCorrection, color: '#EF4444', pct: totalReports > 0 ? Math.round((totalNeedsCorrection / totalReports) * 100) : 0 }
  ];

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.05)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <h3 style={{ fontSize: '1.0625rem', fontWeight: '800', color: '#0F2942', margin: 0 }}>
        Report Status Distribution
      </h3>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        {/* Donut Chart with Center Number */}
        <div style={{ position: 'relative', width: '170px', height: '170px', flexShrink: 0, margin: '0 auto' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F2942',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '0.8125rem',
                  border: 'none'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text Badge */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none'
          }}>
            <span style={{ fontSize: '1.625rem', fontWeight: '900', color: '#0F172A', lineHeight: 1 }}>
              {totalReports}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748B', display: 'block', marginTop: '2px' }}>
              Reports
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: '1 1 140px' }}>
          {data.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                <span style={{ fontWeight: '600', color: '#334155' }}>{item.name}</span>
              </div>
              <span style={{ fontWeight: '700', color: '#64748B', fontSize: '0.8125rem' }}>
                {item.pct}% ({item.value})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
