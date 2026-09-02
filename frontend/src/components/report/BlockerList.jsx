import React from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import Button from '../common/Button';

export default function BlockerList({ blockers = [], onChange, isReadOnly = false }) {
  const handleAddBlocker = () => {
    onChange([...blockers, { text: '', is_key_issue: false }]);
  };

  const handleUpdateBlocker = (index, field, value) => {
    const updated = blockers.map((b, idx) => (idx === index ? { ...b, [field]: value } : b));
    onChange(updated);
  };

  const handleRemoveBlocker = (index) => {
    onChange(blockers.filter((_, idx) => idx !== index));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} style={{ color: '#D97706' }} />
          Blockers & Issues
        </h3>
        {!isReadOnly && (
          <Button variant="outline" size="sm" icon={Plus} onClick={handleAddBlocker}>
            Add Blocker
          </Button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {blockers.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', italic: true }}>No blockers reported this week.</p>
        ) : (
          blockers.map((b, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              backgroundColor: b.is_key_issue ? '#FFFBEB' : '#F8FAFC',
              border: `1px solid ${b.is_key_issue ? '#FDE68A' : 'var(--color-card-border)'}`,
              borderRadius: 'var(--radius-sm)'
            }}>
              {isReadOnly ? (
                <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {b.is_key_issue && (
                    <span style={{ fontSize: '0.6875rem', fontWeight: '700', padding: '2px 6px', backgroundColor: '#D97706', color: '#FFFFFF', borderRadius: '4px' }}>
                      KEY ISSUE
                    </span>
                  )}
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>{b.text}</span>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={b.text}
                    onChange={(e) => handleUpdateBlocker(idx, 'text', e.target.value)}
                    placeholder="Describe the obstacle or dependency delay..."
                    style={{ flexGrow: 1, padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--color-card-border)' }}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', cursor: 'pointer', userSelect: 'none' }}>
                    <input
                      type="checkbox"
                      checked={b.is_key_issue}
                      onChange={(e) => handleUpdateBlocker(idx, 'is_key_issue', e.target.checked)}
                    />
                    Key Issue
                  </label>
                  <button
                    onClick={() => handleRemoveBlocker(idx)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
