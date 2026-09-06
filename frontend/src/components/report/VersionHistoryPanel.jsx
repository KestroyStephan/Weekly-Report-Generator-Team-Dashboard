import React, { useState, useEffect } from 'react';
import { reportsApi } from '../../api/reportsApi';
import { formatDateTime } from '../../utils/dateHelpers';
import { History, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import Badge from '../common/Badge';

export default function VersionHistoryPanel({ reportId, currentVersion }) {
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reportId) return;
    setLoading(true);
    reportsApi.getReportVersions(reportId)
      .then((data) => {
        setVersions(data);
        if (data.length > 0) {
          setSelectedVersion(data[data.length - 1]); // default to latest snapshot
        }
      })
      .catch((err) => console.error("Error fetching version history:", err))
      .finally(() => setLoading(false));
  }, [reportId]);

  if (loading) return <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', padding: '12px' }}>Loading version history...</div>;

  if (versions.length === 0) {
    return (
      <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-card-border)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
        No prior submission versions recorded yet. This is Version #{currentVersion}.
      </div>
    );
  }

  return (
    <div style={{
      border: '1px solid var(--color-card-border)',
      borderRadius: 'var(--radius-md)',
      backgroundColor: '#FFFFFF',
      overflow: 'hidden',
      marginTop: '24px'
    }}>
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#F8FAFC',
        borderBottom: '1px solid var(--color-card-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <History size={18} style={{ color: 'var(--color-primary)' }} />
        <h3 style={{ fontSize: '0.9375rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
          Revision & Comment History ({versions.length} past version{versions.length > 1 ? 's' : ''})
        </h3>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-card-border)' }}>
        {versions.map((ver) => (
          <button
            key={ver.id}
            onClick={() => setSelectedVersion(ver)}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom: selectedVersion?.id === ver.id ? '2px solid var(--color-primary)' : '2px solid transparent',
              backgroundColor: selectedVersion?.id === ver.id ? '#FFFFFF' : '#F1F5F9',
              color: selectedVersion?.id === ver.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontWeight: selectedVersion?.id === ver.id ? '600' : '400',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Version #{ver.version_number}
          </button>
        ))}
      </div>

      {selectedVersion && (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                Snapshot Taken: {formatDateTime(selectedVersion.created_at)}
              </span>
            </div>
            <Badge variant={selectedVersion.status_at_time === 'needs_correction' ? 'amber' : 'blue'}>
              Status at time: {(selectedVersion.status_at_time || 'submitted').replace('_', ' ')}
            </Badge>
          </div>

          {selectedVersion.review_comment_at_time && (
            <div style={{
              padding: '12px 14px',
              backgroundColor: '#FFFBEB',
              borderLeft: '4px solid #D97706',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              gap: '10px'
            }}>
              <MessageSquare size={18} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.8125rem', color: '#B45309', display: 'block' }}>
                  Reviewer Comment on Version #{selectedVersion.version_number}:
                </strong>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', marginTop: '2px' }}>
                  "{selectedVersion.review_comment_at_time}"
                </p>
              </div>
            </div>
          )}

          {/* Snapshot Task Summary */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              Tasks Recorded in Version #{selectedVersion.version_number}:
            </h4>
            <ul style={{ paddingLeft: '20px', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {(selectedVersion.content?.tasks_completed || []).map((t, idx) => (
                <li key={idx}>
                  <strong>{t.task_name || 'Task'}</strong> - {t.actual_pct ?? 0}% completed ({t.time_spent_hrs ?? 0} hrs spent)
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
