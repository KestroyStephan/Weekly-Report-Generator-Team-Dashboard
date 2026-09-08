import CustomDropdown from '../common/CustomDropdown';
import { Search, X } from 'lucide-react';

export default function FilterBar({
  filters = {},
  onFilterChange,
  members = [],
  projects = [],
  showSearch = false,
  searchTerm = '',
  onSearchChange
}) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      padding: '20px 24px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 12px 32px -6px rgba(15, 23, 42, 0.06), 0 2px 6px rgba(0,0,0,0.02)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 480px', flexWrap: 'wrap' }}>
          
          {showSearch && (
            <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
              <Search size={18} color="#0D8A6A" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                placeholder="Search..."
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 46px',
                  borderRadius: '14px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  backgroundColor: '#F8FAFC',
                  color: '#0F2942',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0D8A6A';
                  e.target.style.backgroundColor = '#FFFFFF';
                  e.target.style.boxShadow = '0 0 0 4px rgba(13, 138, 106, 0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#CBD5E1';
                  e.target.style.backgroundColor = '#F8FAFC';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange && onSearchChange('')}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          )}

          {/* Status Dropdown */}
          <CustomDropdown
            labelPrefix="Status:"
            value={filters.status || ''}
            onChange={(val) => onFilterChange('status', val)}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'submitted', label: 'Submitted' },
              { value: 'needs_correction', label: 'Needs Correction' },
              { value: 'approved', label: 'Approved' },
              { value: 'draft', label: 'Draft' }
            ]}
          />

          {/* Users Dropdown */}
          {members.length > 0 && (
            <CustomDropdown
              labelPrefix="Member:"
              value={filters.user_id || ''}
              onChange={(val) => onFilterChange('user_id', val)}
              options={[
                { value: '', label: 'All Team Members' },
                ...members.map((m) => ({ value: m.id, label: m.name }))
              ]}
            />
          )}

          {/* Projects Dropdown */}
          {projects.length > 0 && (
            <CustomDropdown
              labelPrefix="Project:"
              value={filters.project_id || ''}
              onChange={(val) => onFilterChange('project_id', val)}
              options={[
                { value: '', label: 'All Projects' },
                ...projects.map((p) => ({ value: p.id, label: p.name }))
              ]}
            />
          )}

          {Object.values(filters).some(Boolean) && (
            <button
              onClick={() => onFilterChange('reset')}
              style={{
                fontSize: '0.8125rem',
                color: '#EF4444',
                background: '#FEF2F2',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #FECACA',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
