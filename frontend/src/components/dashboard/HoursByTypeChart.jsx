import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function HoursByTypeChart({ data = [] }) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      padding: '20px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-card-border)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px' }}>
        Total Time Spent Breakdown (Hours by Category)
      </h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis type="number" stroke="#94A3B8" fontSize={12} />
            <YAxis dataKey="category" type="category" stroke="#94A3B8" fontSize={12} width={100} />
            <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
            <Bar dataKey="hours" name="Total Hours" fill="#6366F1" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
