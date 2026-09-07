import React from 'react';
import { Plus, Trash2, AlertTriangle, AlertCircle } from 'lucide-react';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: '#FFFBEB',
            color: '#D97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: '800', color: '#0F2942', margin: 0 }}>
              Section 3: Blockers & Dependency Issues
            </h3>
            <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
              {blockers.length} obstacle{blockers.length === 1 ? '' : 's'} flagged
            </span>
          </div>
        </div>

        {!isReadOnly && (
          <Button variant="outline" size="sm" icon={Plus} onClick={handleAddBlocker}>
            Add Blocker
          </Button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {blockers.length === 0 ? (
          <div style={{
            padding: '20px 24px',
            backgroundColor: '#F8FAFC',
            borderRadius: '14px',
            border: '1px dashed #CBD5E1',
            color: '#64748B',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={18} color="#94A3B8" />
            <span>No blockers or critical dependencies reported for this week.</span>
          </div>
        ) : (
          blockers.map((b, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: b.is_key_issue ? '#FFFBEB' : '#F8FAFC',
              border: `1.5px solid ${b.is_key_issue ? '#FDE68A' : '#CBD5E1'}`,
              borderRadius: '14px',
              transition: 'all 0.15s ease'
            }}>
              {isReadOnly ? (
                <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {b.is_key_issue && (
                    <span style={{
                      fontSize: '0.6875rem',
                      fontWeight: '800',
                      padding: '3px 8px',
                      backgroundColor: '#D97706',
                      color: '#FFFFFF',
                      borderRadius: '6px',
                      letterSpacing: '0.04em'
                    }}>
                      CRITICAL BLOCKER
                    </span>
                  )}
                  <span style={{ fontSize: '0.9375rem', color: '#0F2942', fontWeight: '500' }}>{b.text}</span>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={b.text}
                    onChange={(e) => handleUpdateBlocker(idx, 'text', e.target.value)}
                    placeholder="Describe the blocker, missing dependency, or delay..."
                    style={{
                      flexGrow: 1,
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '0.875rem',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      color: '#0F2942',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#D97706')}
                    onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                  />

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.8125rem',
                    fontWeight: '700',
                    color: b.is_key_issue ? '#B45309' : '#475569',
                    cursor: 'pointer',
                    userSelect: 'none',
                    backgroundColor: b.is_key_issue ? '#FEF3C7' : '#FFFFFF',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1'
                  }}>
                    <input
                      type="checkbox"
                      checked={b.is_key_issue}
                      onChange={(e) => handleUpdateBlocker(idx, 'is_key_issue', e.target.checked)}
                      style={{ accentColor: '#D97706', width: '16px', height: '16px' }}
                    />
                    Key Blocker
                  </label>

                  <button
                    type="button"
                    onClick={() => handleRemoveBlocker(idx)}
                    title="Remove blocker"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      border: '1px solid #FEE2E2',
                      backgroundColor: '#FFFFFF',
                      color: '#EF4444',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#FEF2F2';
                      e.currentTarget.style.borderColor = '#FCA5A5';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#FEE2E2';
                    }}
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
