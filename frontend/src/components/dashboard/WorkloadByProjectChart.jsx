import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

export default function WorkloadByProjectChart({ data = [] }) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      padding: '20px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-card-border)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px' }}>
        Task Workload Distribution by Project
      </h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={4}
              dataKey="task_count"
              nameKey="project_name"
              label={({ project_name, percent }) => `${project_name} (${(percent * 100).toFixed(0)}%)`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
