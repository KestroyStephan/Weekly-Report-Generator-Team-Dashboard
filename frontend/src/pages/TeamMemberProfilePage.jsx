import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersApi } from '../api/usersApi';
import { reportsApi } from '../api/reportsApi';
import StatusBadge from '../components/report/StatusBadge';
import Button from '../components/common/Button';
import { ArrowLeft, UserCheck, Eye, Calendar } from 'lucide-react';
import { formatDate } from '../utils/dateHelpers';

export default function TeamMemberProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [userData, repData] = await Promise.all([
          usersApi.getUserById(id),
          reportsApi.getReports({ user_id: id })
        ]);
        setMember(userData);
        setReports(repData);
      } catch (err) {
        console.error("Error loading team member profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <div style={{ padding: '32px', textAlign: 'center' }}>Loading member profile...</div>;
  if (!member) return <div style={{ padding: '32px', textAlign: 'center' }}>Team member not found.</div>;

  const totalSubmitted = reports.filter((r) => r.status === 'submitted' || r.status === 'approved').length;
  const approvedCount = reports.filter((r) => r.status === 'approved').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      {/* Member Header Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '24px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-card-border)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: '700'
          }}>
            {member.name.charAt(0)}
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>{member.name}</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{member.email} • Role: {member.role}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', textAlign: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Total Reports</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>{reports.length}</h3>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Approved</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#16A34A' }}>{approvedCount}</h3>
          </div>
        </div>
      </div>

      {/* Report History */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-card-border)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-card-border)', backgroundColor: '#F8FAFC' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
            Weekly Report Submissions History
          </h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-card-border)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
              <th style={{ padding: '12px 16px' }}>Week Period</th>
              <th style={{ padding: '12px 16px' }}>Project</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Version</th>
              <th style={{ padding: '12px 16px' }}>Submitted Date</th>
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
                  {rep.project_name || 'General'}
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
                  <Button variant="outline" size="sm" icon={Eye} onClick={() => navigate(`/reports/${rep.id}`)}>
                    View Report
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
