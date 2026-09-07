import React, { useState } from 'react';
import { Target, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyGoalsWidget({ currentReport }) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const plannedTasks = currentReport?.content?.tasks_planned_next_week || [];

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      padding: '24px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      height: '100%'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            backgroundColor: '#ECFDF5',
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Target size={18} />
          </div>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>
            My Goals
          </h3>
        </div>

        {plannedTasks.length > 0 && (
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#2563EB',
              fontSize: '0.8125rem',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '4px 8px'
            }}
          >
            View All
          </button>
        )}
      </div>

      {/* Goal List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flexGrow: 1 }}>
        {plannedTasks.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '0.8125rem' }}>
            <p style={{ margin: '0 0 12px 0' }}>No planned goals added for next week yet.</p>
            <button
              onClick={() => navigate('/my-report')}
              style={{
                backgroundColor: '#ECFDF5',
                color: '#059669',
                border: '1px solid #A7F3D0',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              + Add Goals in My Report
            </button>
          </div>
        ) : (
          plannedTasks.map((g, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#334155' }}>
                    {g.task_description || g}
                  </span>
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#0F172A' }}>
                  {g.planned_hours ? `${g.planned_hours}h` : 'On Track'}
                </span>
              </div>

              <div style={{
                height: '6px',
                width: '100%',
                backgroundColor: '#F1F5F9',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: '75%',
                  backgroundColor: '#10B981',
                  borderRadius: '3px'
                }} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Goals Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '28px',
            width: '90%',
            maxWidth: '520px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>
                All Weekly Goals & Targets
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {plannedTasks.map((g, idx) => (
                <div key={idx} style={{
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.875rem', color: '#0F172A' }}>{g.task_description || g}</span>
                    <span style={{ fontWeight: '700', fontSize: '0.875rem', color: '#10B981' }}>Planned: {g.planned_hours || 4}h</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '75%', backgroundColor: '#10B981' }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
