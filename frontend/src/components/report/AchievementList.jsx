import React from 'react';
import { Plus, Trash2, Award, Sparkles } from 'lucide-react';
import Button from '../common/Button';

export default function AchievementList({ achievements = [], onChange, isReadOnly = false }) {
  const handleAddAchievement = () => {
    onChange([...achievements, { text: '', is_key_achievement: false }]);
  };

  const handleUpdateAchievement = (index, field, value) => {
    const updated = achievements.map((a, idx) => (idx === index ? { ...a, [field]: value } : a));
    onChange(updated);
  };

  const handleRemoveAchievement = (index) => {
    onChange(achievements.filter((_, idx) => idx !== index));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: '#ECFDF5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Award size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: '800', color: '#0F2942', margin: 0 }}>
              Section 4: Key Achievements & Major Wins
            </h3>
            <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
              {achievements.length} win{achievements.length === 1 ? '' : 's'} highlighted
            </span>
          </div>
        </div>

        {!isReadOnly && (
          <Button variant="outline" size="sm" icon={Plus} onClick={handleAddAchievement}>
            Add Highlight
          </Button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {achievements.length === 0 ? (
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
            <Sparkles size={18} color="#0D8A6A" />
            <span>No achievements recorded this week yet.</span>
          </div>
        ) : (
          achievements.map((a, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: a.is_key_achievement ? '#ECFDF5' : '#F8FAFC',
              border: `1.5px solid ${a.is_key_achievement ? '#A7F3D0' : '#CBD5E1'}`,
              borderRadius: '14px',
              transition: 'all 0.15s ease'
            }}>
              {isReadOnly ? (
                <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {a.is_key_achievement && (
                    <span style={{
                      fontSize: '0.6875rem',
                      fontWeight: '800',
                      padding: '3px 8px',
                      backgroundColor: '#059669',
                      color: '#FFFFFF',
                      borderRadius: '6px',
                      letterSpacing: '0.04em'
                    }}>
                      MAJOR WIN 🎉
                    </span>
                  )}
                  <span style={{ fontSize: '0.9375rem', color: '#0F2942', fontWeight: '500' }}>{a.text}</span>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={a.text}
                    onChange={(e) => handleUpdateAchievement(idx, 'text', e.target.value)}
                    placeholder="Highlight a key deliverable, milestone win, or performance accomplishment..."
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
                    onFocus={(e) => (e.target.style.borderColor = '#0D8A6A')}
                    onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                  />

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.8125rem',
                    fontWeight: '700',
                    color: a.is_key_achievement ? '#065F46' : '#475569',
                    cursor: 'pointer',
                    userSelect: 'none',
                    backgroundColor: a.is_key_achievement ? '#D1FAE5' : '#FFFFFF',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1'
                  }}>
                    <input
                      type="checkbox"
                      checked={a.is_key_achievement}
                      onChange={(e) => handleUpdateAchievement(idx, 'is_key_achievement', e.target.checked)}
                      style={{ accentColor: '#059669', width: '16px', height: '16px' }}
                    />
                    Major Win
                  </label>

                  <button
                    type="button"
                    onClick={() => handleRemoveAchievement(idx)}
                    title="Remove achievement"
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
