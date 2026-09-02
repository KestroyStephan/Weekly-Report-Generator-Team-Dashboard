import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';

export default function ProjectTable({ projects = [], onEdit, onDelete }) {
  return (
    <div style={{ overflowX: 'auto', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-card-border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--color-card-border)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
            <th style={{ padding: '12px 16px' }}>Project Name</th>
            <th style={{ padding: '12px 16px' }}>Description</th>
            <th style={{ padding: '12px 16px' }}>Status</th>
            <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                No projects defined yet.
              </td>
            </tr>
          ) : (
            projects.map((proj) => (
              <tr key={proj.id} style={{ borderBottom: '1px solid var(--color-card-border)' }}>
                <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                  {proj.name}
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>
                  {proj.description || '-'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge variant={proj.status === 'active' ? 'green' : 'gray'}>
                    {proj.status}
                  </Badge>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      onClick={() => onEdit(proj)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(proj.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
