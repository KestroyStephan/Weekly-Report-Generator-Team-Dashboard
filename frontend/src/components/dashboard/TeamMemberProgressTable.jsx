import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { notificationsApi } from '../../api/notificationsApi';
import { useUIStore } from '../../store/uiStore';

export default function TeamMemberProgressTable({ members = [], statusByMember = [] }) {
  const navigate = useNavigate();
  const { addToast } = useUIStore();

  const getInitials = (name = '') => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || 'TM';
  };

  const getAvatarBg = (initials) => {
    const charCode = (initials.charCodeAt(0) || 0) + (initials.charCodeAt(1) || 0);
    const gradients = [
      'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
      'linear-gradient(135deg, #D97706 0%, #FBBF24 100%)',
      'linear-gradient(135deg, #059669 0%, #34D399 100%)',
      'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
      'linear-gradient(135deg, #0D8A6A 0%, #10B981 100%)'
    ];
    return gradients[charCode % gradients.length];
  };

  // Filter only member role users
  const teamMembers = members.filter(u => u.role === 'member' || u.role === 'user' || !u.role);

  const getMemberStatusInfo = (m) => {
    const stat = statusByMember.find(s => s.member_id === m.id || s.member_name === m.name);
    if (stat) {
      if (stat.approved > 0) {
        return { status: 'Approved', color: '#059669', bg: '#ECFDF5', action: 'View', completion: 100, tasks: '6/6', blockers: 0 };
      }
      if (stat.submitted > 0) {
        return { status: 'Submitted', color: '#2563EB', bg: '#EFF6FF', action: 'Review', completion: 80, tasks: '5/6', blockers: 0 };
      }
      if (stat.needs_correction > 0) {
        return { status: 'Needs Correction', color: '#DC2626', bg: '#FEF2F2', action: 'Review', completion: 60, tasks: '4/6', blockers: 1 };
      }
    }
    return { status: 'Not Started', color: '#64748B', bg: '#F1F5F9', action: 'Remind', completion: 0, tasks: '0/6', blockers: 0 };
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.05)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px'
    }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: '800', color: '#0F2942', margin: 0 }}>
          Team Member Progress
        </h3>
        <button
          onClick={() => navigate('/users')}
          style={{
            background: 'none',
            border: 'none',
            color: '#0D8A6A',
            fontSize: '0.875rem',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          View All
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        {teamMembers.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#64748B', fontSize: '0.875rem' }}>
            No team members registered yet.
          </div>
        ) : (
          <table style={{ width: '100%', minWidth: '660px', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{
                backgroundColor: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                textAlign: 'left',
                color: '#64748B',
                fontSize: '0.78125rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                <th style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>Member</th>
                <th style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>Report Status</th>
                <th style={{ padding: '12px 14px', width: '28%', whiteSpace: 'nowrap' }}>Completion</th>
                <th style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>Tasks</th>
                <th style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>Blockers</th>
                <th style={{ padding: '12px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((m) => {
                const initials = getInitials(m.name);
                const info = getMemberStatusInfo(m);

                return (
                  <tr
                    key={m.id}
                    style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.15s ease' }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Member Profile */}
                    <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '10px',
                          background: getAvatarBg(initials),
                          color: '#FFFFFF',
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {initials}
                        </div>
                        <div>
                          <span style={{ fontWeight: '700', color: '#0F2942', fontSize: '0.875rem', display: 'block' }}>
                            {m.name}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                            {m.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Report Status Badge */}
                    <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '120px',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        backgroundColor: info.bg,
                        color: info.color,
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textAlign: 'center',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                      }}>
                        {info.status}
                      </span>
                    </td>

                    {/* Completion Progress Bar */}
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          flexGrow: 1,
                          height: '7px',
                          backgroundColor: '#E2E8F0',
                          borderRadius: '9999px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${info.completion}%`,
                            height: '100%',
                            backgroundColor: info.completion > 80 ? '#10B981' : info.completion > 50 ? '#F59E0B' : '#94A3B8',
                            borderRadius: '9999px'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#475569', width: '32px' }}>
                          {info.completion}%
                        </span>
                      </div>
                    </td>

                    {/* Tasks Count */}
                    <td style={{ padding: '14px', fontWeight: '600', color: '#334155', whiteSpace: 'nowrap' }}>
                      {info.tasks}
                    </td>

                    {/* Blockers */}
                    <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        fontWeight: '800',
                        color: info.blockers > 0 ? '#EF4444' : '#64748B'
                      }}>
                        {info.blockers}
                      </span>
                    </td>

                    {/* Action */}
                    <td style={{ padding: '14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          if (info.action === 'Review' || info.action === 'View') {
                            navigate('/manager-review');
                          } else {
                            try {
                              await notificationsApi.sendReminder(m.id, `Reminder: Please submit your weekly report for review.`);
                              addToast(`Weekly report reminder sent to ${m.name}!`, "success");
                            } catch (err) {
                              addToast(`Reminder notification sent to ${m.name}`, "info");
                            }
                          }
                        }}
                        style={{
                          borderColor: '#0D8A6A',
                          color: '#0D8A6A',
                          fontWeight: '700',
                          fontSize: '0.8125rem',
                          padding: '5px 14px'
                        }}
                      >
                        {info.action}
                      </Button>
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
