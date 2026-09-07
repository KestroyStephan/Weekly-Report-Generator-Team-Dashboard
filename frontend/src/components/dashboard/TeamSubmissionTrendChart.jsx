import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export default function TeamSubmissionTrendChart({ data = [] }) {
  const chartData = data && data.length > 0
    ? data.map((d) => ({
        week: d.week_start_date ? d.week_start_date.substring(5) : (d.week || 'Week'),
        submitted: d.planned_tasks !== undefined ? d.planned_tasks : (d.submitted || 0),
        approved: d.completed_tasks !== undefined ? d.completed_tasks : (d.approved || 0)
      }))
    : [];

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: '800', color: '#0F2942', margin: 0 }}>
          Team Submission Trend
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8125rem', fontWeight: '600' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            Submitted
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2563EB' }} />
            Approved
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height: '240px' }}>
        {chartData.length === 0 ? (
          <div style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            fontSize: '0.875rem'
          }}>
            No weekly submission trend data yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="week" tickLine={false} axisLine={{ stroke: '#E2E8F0' }} tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F2942',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.8125rem',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}
              />
              <Area type="monotone" dataKey="submitted" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorSubmitted)" dot={{ r: 4, fill: '#10B981' }} />
              <Area type="monotone" dataKey="approved" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorApproved)" dot={{ r: 4, fill: '#2563EB' }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
