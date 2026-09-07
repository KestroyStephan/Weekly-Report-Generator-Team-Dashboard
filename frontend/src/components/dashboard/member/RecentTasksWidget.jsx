import React, { useState } from 'react';
import { ListTodo, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RecentTasksWidget({ currentReport }) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const completedTasks = currentReport?.content?.tasks_completed || [];

  const renderPriority = (priority) => {
    if (priority === 'High') {
      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#EF4444', fontWeight: '600', fontSize: '0.75rem' }}>
          <ArrowUp size={14} /> High
        </span>
      );
    }
    if (priority === 'Low') {
      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#10B981', fontWeight: '600', fontSize: '0.75rem' }}>
          <ArrowDown size={14} /> Low
        </span>
      );
    }
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#F59E0B', fontWeight: '600', fontSize: '0.75rem' }}>
        <Minus size={14} /> Medium
      </span>
    );
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      padding: '24px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
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
            <ListTodo size={18} />
          </div>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>
            Recent Tasks
          </h3>
        </div>

        {completedTasks.length > 0 && (
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

      {/* Tasks Table */}
      <div style={{ overflowX: 'auto' }}>
        {completedTasks.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '0.8125rem' }}>
            <p style={{ margin: '0 0 12px 0' }}>No completed tasks added for this week yet.</p>
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
              + Add Completed Tasks in My Report
            </button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F1F5F9', color: '#64748B', fontWeight: '600' }}>
                <th style={{ padding: '8px 12px 12px 0' }}>Task Description</th>
                <th style={{ padding: '8px 12px 12px 12px' }}>Hours Spent</th>
                <th style={{ padding: '8px 12px 12px 12px' }}>Priority</th>
                <th style={{ padding: '8px 0 12px 12px', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {completedTasks.map((t, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <td style={{ padding: '12px 12px 12px 0', fontWeight: '600', color: '#1E293B' }}>{t.task_name || 'Task'}</td>
                  <td style={{ padding: '12px', color: '#64748B' }}>{t.time_spent_hrs ? `${t.time_spent_hrs}h` : 'N/A'}</td>
                  <td style={{ padding: '12px' }}>{renderPriority(t.priority || 'Medium')}</td>
                  <td style={{ padding: '12px 0 12px 12px', textAlign: 'right' }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      display: 'inline-block'
                    }}>
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Tasks Modal */}
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
            maxWidth: '640px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>
                All Completed Weekly Tasks
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Task Description</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Hours</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {completedTasks.map((t, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 10px', fontWeight: '600' }}>{t.task_name || 'Task'}</td>
                      <td style={{ padding: '12px 10px' }}>{t.time_spent_hrs ? `${t.time_spent_hrs}h` : 'N/A'}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: '#DCFCE7', color: '#15803D' }}>
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
