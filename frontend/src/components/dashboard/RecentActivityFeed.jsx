import React from 'react';
import {
  CheckCircle2,
  Upload,
  AlertTriangle,
  FolderPlus,
  UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function formatTimeAgo(dateStr) {
  if (!dateStr) return 'Recently';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
    if (isNaN(diffSec) || diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } catch (e) {
    return 'Recently';
  }
}

export default function RecentActivityFeed({ activities = [] }) {
  const navigate = useNavigate();

  const getActivityStyle = (action = '') => {
    const act = action.toLowerCase();
    if (act.includes('approved')) {
      return { icon: CheckCircle2, color: '#10B981', bgColor: '#ECFDF5' };
    }
    if (act.includes('submitted')) {
      return { icon: Upload, color: '#0284C7', bgColor: '#F0F9FF' };
    }
    if (act.includes('correction') || act.includes('changes') || act.includes('blocker')) {
      return { icon: AlertTriangle, color: '#F59E0B', bgColor: '#FFFBEB' };
    }
    if (act.includes('project')) {
      return { icon: FolderPlus, color: '#8B5CF6', bgColor: '#F3E8FF' };
    }
    return { icon: UserCheck, color: '#0D8A6A', bgColor: '#E6F4F0' };
  };

  const displayActivities = activities.slice(0, 8);

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: '800', color: '#0F2942', margin: 0 }}>
          Recent Activity
        </h3>
        <button
          onClick={() => navigate('/manager-review')}
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {displayActivities.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: '#64748B', fontSize: '0.875rem' }}>
            No recent activity recorded yet.
          </div>
        ) : (
          displayActivities.map((act, idx) => {
            const style = getActivityStyle(act.action || act.details || '');
            const Icon = style.icon;
            const timeAgo = formatTimeAgo(act.timestamp || act.created_at);
            const text = act.details || `${act.user_name || 'User'} ${act.action || 'updated report'}`;

            return (
              <div key={act.id || idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: style.bgColor,
                  color: style.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={18} style={{ strokeWidth: 2.2 }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F2942', lineHeight: 1.3 }}>
                    {text}
                  </span>
                  <span style={{ fontSize: '0.78125rem', color: '#64748B' }}>
                    {timeAgo}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
