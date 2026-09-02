import React from 'react';
import Select from '../common/Select';

export default function FilterBar({
  filters = {},
  onFilterChange,
  members = [],
  projects = []
}) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      padding: '16px 20px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-card-border)',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap'
    }}>
      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-secondary)' }}>
        Filter Reports:
      </span>

      <div style={{ width: '180px' }}>
        <Select
          value={filters.status || ''}
          onChange={(e) => onFilterChange('status', e.target.value)}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'submitted', label: 'Submitted (Pending Review)' },
            { value: 'needs_correction', label: 'Needs Correction' },
            { value: 'approved', label: 'Approved' },
            { value: 'draft', label: 'Draft' }
          ]}
        />
      </div>

      <div style={{ width: '200px' }}>
        <Select
          value={filters.user_id || ''}
          onChange={(e) => onFilterChange('user_id', e.target.value)}
          options={[
            { value: '', label: 'All Team Members' },
            ...members.map((m) => ({ value: m.id, label: m.name }))
          ]}
        />
      </div>

      <div style={{ width: '200px' }}>
        <Select
          value={filters.project_id || ''}
          onChange={(e) => onFilterChange('project_id', e.target.value)}
          options={[
            { value: '', label: 'All Projects' },
            ...projects.map((p) => ({ value: p.id, label: p.name }))
          ]}
        />
      </div>

      {Object.values(filters).some(Boolean) && (
        <button
          onClick={() => onFilterChange('reset')}
          style={{
            fontSize: '0.8125rem',
            color: 'var(--color-primary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
