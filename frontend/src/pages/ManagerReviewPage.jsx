import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportsApi } from '../api/reportsApi';
import StatusBadge from '../components/report/StatusBadge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { Eye, CheckCircle2, UserCheck } from 'lucide-react';
import { formatDate } from '../utils/dateHelpers';

export default function ManagerReviewPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadSubmittedReports = async () => {
    setLoading(true);
    try {
      const data = await reportsApi.getReports({ status: 'submitted' });
      setReports(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmittedReports();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {loading ? (
        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading review queue...</div>
      ) : reports.length === 0 ? (
        <EmptyState
          title="All caught up!"
          description="There are currently no reports awaiting manager review."
          icon={CheckCircle2}
        />
      ) : (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-card-border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--color-card-border)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
                <th style={{ padding: '12px 16px' }}>Team Member</th>
                <th style={{ padding: '12px 16px' }}>Week Period</th>
                <th style={{ padding: '12px 16px' }}>Project</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Version</th>
                <th style={{ padding: '12px 16px' }}>Submitted Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((rep) => (
                <tr key={rep.id} style={{ borderBottom: '1px solid var(--color-card-border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                    {rep.user_name || 'Member'}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-primary)' }}>
                    {rep.week_start_date} to {rep.week_end_date}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>
                    {rep.project_name || 'General / Other'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <StatusBadge status={rep.status} />
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>
                    v{rep.version}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>
                    {formatDate(rep.submitted_at || rep.created_at)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <Button variant="primary" size="sm" icon={Eye} onClick={() => navigate(`/reports/${rep.id}`)}>
                      Review Report
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
