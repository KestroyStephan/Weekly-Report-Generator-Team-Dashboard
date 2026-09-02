import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export default function StatusByMemberChart({ data = [] }) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      padding: '20px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-card-border)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px' }}>
        Submission Status Breakdown by Team Member
      </h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="member_name" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} allowDecimals={false} />
            <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
            <Legend />
            <Bar dataKey="approved" name="Approved" fill="#16A34A" radius={[4, 4, 0, 0]} />
            <Bar dataKey="submitted" name="Submitted" fill="#2563EB" radius={[4, 4, 0, 0]} />
            <Bar dataKey="needs_correction" name="Needs Correction" fill="#D97706" radius={[4, 4, 0, 0]} />
            <Bar dataKey="draft" name="Draft" fill="#94A3B8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
