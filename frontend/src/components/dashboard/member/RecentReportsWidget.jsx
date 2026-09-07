import React from 'react';
import { FileCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RecentReportsWidget({ reportsHistory = [] }) {
  const navigate = useNavigate();

  // If reportsHistory is empty, display clean state or fallback array
  const displayReports = reportsHistory.length > 0 ? reportsHistory.slice(0, 5) : [];

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
            <FileCheck size={18} />
          </div>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>
            Recent Reports
          </h3>
        </div>

        <button
          onClick={() => navigate('/reports-history')}
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
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        {displayReports.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '0.875rem' }}>
            No past reports submitted yet. Submit your first weekly report to view history!
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F1F5F9', color: '#64748B', fontWeight: '600' }}>
                <th style={{ padding: '8px 12px 12px 0' }}>Week</th>
                <th style={{ padding: '8px 12px 12px 12px' }}>Status</th>
                <th style={{ padding: '8px 12px 12px 12px' }}>Submitted On</th>
                <th style={{ padding: '8px 12px 12px 12px' }}>Comments</th>
                <th style={{ padding: '8px 0 12px 12px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayReports.map((r) => {
                const weekLabel = `${r.week_start_date} ${r.week_end_date ? `– ${r.week_end_date}` : ''}`;
                const statusColor = r.status === 'approved' ? '#15803D' : r.status === 'submitted' ? '#2563EB' : '#D97706';
                const statusBg = r.status === 'approved' ? '#DCFCE7' : r.status === 'submitted' ? '#EFF6FF' : '#FEF3C7';
                const submittedDate = r.submitted_at ? new Date(r.submitted_at).toLocaleDateString() : 'N/A';
                const reviewComment = r.review?.comments || 'No comments';

                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td style={{ padding: '12px 12px 12px 0', fontWeight: '600', color: '#1E293B' }}>{weekLabel}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: statusBg,
                        color: statusColor,
                        display: 'inline-block',
                        textTransform: 'capitalize'
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#64748B' }}>{submittedDate}</td>
                    <td style={{ padding: '12px', color: '#475569', fontStyle: 'italic' }}>"{reviewComment}"</td>
                    <td style={{ padding: '12px 0 12px 12px', textAlign: 'right' }}>
                      <button
                        onClick={() => navigate(`/reports/${r.id}`)}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          padding: '4px 12px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: '#2563EB',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
