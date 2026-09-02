import React from 'react';
import { Plus, Trash2, Award } from 'lucide-react';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={18} style={{ color: '#16A34A' }} />
          Key Achievements & Highlights
        </h3>
        {!isReadOnly && (
          <Button variant="outline" size="sm" icon={Plus} onClick={handleAddAchievement}>
            Add Highlight
          </Button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {achievements.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', italic: true }}>No achievements recorded this week.</p>
        ) : (
          achievements.map((a, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              backgroundColor: a.is_key_achievement ? '#F0FDF4' : '#F8FAFC',
              border: `1px solid ${a.is_key_achievement ? '#BBF7D0' : 'var(--color-card-border)'}`,
              borderRadius: 'var(--radius-sm)'
            }}>
              {isReadOnly ? (
                <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {a.is_key_achievement && (
                    <span style={{ fontSize: '0.6875rem', fontWeight: '700', padding: '2px 6px', backgroundColor: '#16A34A', color: '#FFFFFF', borderRadius: '4px' }}>
                      MAJOR WIN
                    </span>
                  )}
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>{a.text}</span>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={a.text}
                    onChange={(e) => handleUpdateAchievement(idx, 'text', e.target.value)}
                    placeholder="Highlight a milestone, performance win, or successful release..."
                    style={{ flexGrow: 1, padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--color-card-border)' }}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', cursor: 'pointer', userSelect: 'none' }}>
                    <input
                      type="checkbox"
                      checked={a.is_key_achievement}
                      onChange={(e) => handleUpdateAchievement(idx, 'is_key_achievement', e.target.checked)}
                    />
                    Key Achievement
                  </label>
                  <button
                    onClick={() => handleRemoveAchievement(idx)}
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
