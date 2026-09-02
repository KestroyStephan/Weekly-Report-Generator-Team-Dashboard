import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportsApi } from '../api/reportsApi';
import { projectsApi } from '../api/projectsApi';
import StatusBadge from '../components/report/StatusBadge';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import EmptyState from '../components/common/EmptyState';
import { Eye, FileText } from 'lucide-react';
import { formatDate } from '../utils/dateHelpers';

export default function ReportHistoryPage() {
  const [reports, setReports] = useState([]);
  const [projects, setProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      try {
        const [repData, projData] = await Promise.all([
          reportsApi.getReports({ status: statusFilter || undefined, project_id: projectFilter || undefined }),
          projectsApi.getProjects()
        ]);
        setReports(repData);
        setProjects(projData);
      } catch (err) {
        console.error("Error fetching report history:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [statusFilter, projectFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Filter Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '16px 20px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-card-border)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Filters:</span>
        <div style={{ width: '180px' }}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'draft', label: 'Draft' },
              { value: 'submitted', label: 'Submitted' },
              { value: 'needs_correction', label: 'Needs Correction' },
              { value: 'approved', label: 'Approved' }
            ]}
          />
        </div>
        <div style={{ width: '200px' }}>
          <Select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            options={[
              { value: '', label: 'All Projects' },
              ...projects.map((p) => ({ value: p.id, label: p.name }))
            ]}
          />
        </div>
      </div>

      {/* Reports Table */}
      {loading ? (
        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading reports...</div>
      ) : reports.length === 0 ? (
        <EmptyState title="No weekly reports found" description="No reports match your selected filters." icon={FileText} />
      ) : (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-card-border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--color-card-border)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
                <th style={{ padding: '12px 16px' }}>Week Period</th>
                <th style={{ padding: '12px 16px' }}>Author</th>
                <th style={{ padding: '12px 16px' }}>Project</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Version</th>
                <th style={{ padding: '12px 16px' }}>Last Updated</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((rep) => (
                <tr key={rep.id} style={{ borderBottom: '1px solid var(--color-card-border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                    {rep.week_start_date} to {rep.week_end_date}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>
                    {rep.user_name || 'Member'}
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
                    {formatDate(rep.updated_at)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <Button variant="outline" size="sm" icon={Eye} onClick={() => navigate(`/reports/${rep.id}`)}>
                      View Details
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
