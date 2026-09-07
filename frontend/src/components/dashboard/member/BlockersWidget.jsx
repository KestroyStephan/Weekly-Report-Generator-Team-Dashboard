import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BlockersWidget({ currentReport }) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const blockers = currentReport?.content?.blockers || [];

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      padding: '24px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      height: '100%'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            backgroundColor: blockers.length > 0 ? '#FEF2F2' : '#ECFDF5',
            color: blockers.length > 0 ? '#EF4444' : '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertCircle size={18} />
          </div>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>
            Blockers & Challenges
          </h3>
        </div>

        {blockers.length > 0 && (
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

      {/* Table */}
      <div style={{ overflowX: 'auto', flexGrow: 1 }}>
        {blockers.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '0.8125rem' }}>
            <p style={{ margin: '0 0 12px 0' }}>No active blockers logged for this week 🎉</p>
            <button
              onClick={() => navigate('/my-report')}
              style={{
                backgroundColor: '#F8FAFC',
                color: '#475569',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              + Log Blocker in Report
            </button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F1F5F9', color: '#64748B', fontWeight: '600' }}>
                <th style={{ padding: '8px 12px 12px 0' }}>Issue Description</th>
                <th style={{ padding: '8px 12px 12px 12px' }}>Impact / Severity</th>
                <th style={{ padding: '8px 0 12px 12px', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {blockers.map((b, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <td style={{ padding: '12px 12px 12px 0', fontWeight: '600', color: '#1E293B' }}>{b.text || 'Blocker'}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: b.is_key_issue ? '#EF4444' : '#F59E0B'
                      }} />
                      <span style={{ color: '#475569', fontWeight: '500' }}>{b.is_key_issue ? 'High' : 'Medium'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 0 12px 12px', textAlign: 'right' }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: b.status === 'resolved' ? '#DCFCE7' : '#FEF2F2',
                      color: b.status === 'resolved' ? '#15803D' : '#EF4444',
                      display: 'inline-block',
                      textTransform: 'capitalize'
                    }}>
                      {b.status || 'Open'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
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
            maxWidth: '560px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>
                Active Blockers & Challenges
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {blockers.map((b, idx) => (
                <div key={idx} style={{
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong style={{ fontSize: '0.875rem', color: '#0F172A', display: 'block' }}>{b.text || 'Blocker'}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Severity: {b.is_key_issue ? 'High' : 'Medium'}</span>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    backgroundColor: b.status === 'resolved' ? '#DCFCE7' : '#FEF2F2',
                    color: b.status === 'resolved' ? '#15803D' : '#EF4444'
                  }}>
                    {b.status || 'Open'}
                  </span>
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
