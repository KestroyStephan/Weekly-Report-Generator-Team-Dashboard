import React from 'react';
import { FileText, Target, AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MemberSummaryCards({ currentReport, onNavigate }) {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    if (onNavigate) onNavigate(path);
    else navigate(path);
  };

  // Real data calculations from current report
  const content = currentReport?.content || {};
  
  // Completed sections calculation (5 total sections: Basic Info, Tasks, Next Week Plans, Blockers/Achievements, Hours)
  let completedSections = 0;
  if (currentReport?.project_id) completedSections++;
  if (content.tasks_completed && content.tasks_completed.length > 0) completedSections++;
  if (content.tasks_planned_next_week && content.tasks_planned_next_week.length > 0) completedSections++;
  if ((content.blockers && content.blockers.length > 0) || (content.achievements && content.achievements.length > 0)) completedSections++;
  if (content.hours_by_type) completedSections++;

  // Total Hours calculation
  const hours = content.hours_by_type || {};
  const totalHours = Math.round(
    (hours.development || 0) +
    (hours.testing || 0) +
    (hours.meetings || 0) +
    (hours.documentation || 0) +
    (hours.other || 0)
  );

  // Blockers calculation
  const blockersList = content.blockers || [];
  const blockersCount = blockersList.length;
  const keyIssuesCount = blockersList.filter(b => b.is_key_issue).length;

  // Goals calculation
  const goalsPlanned = content.tasks_planned_next_week || [];
  const goalsCount = goalsPlanned.length;
  const goalsPercentage = goalsCount > 0 ? Math.min(100, Math.round((goalsCount / 5) * 100)) : 0;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
      gap: '16px'
    }}>

      {/* Card 1: This Week's Report */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#ECFDF5',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1E293B', margin: 0 }}>
                This Week's Report
              </h4>
              <span style={{
                display: 'inline-block',
                marginTop: '4px',
                fontSize: '0.75rem',
                fontWeight: '600',
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: currentReport?.status === 'approved' ? '#DCFCE7' : currentReport?.status === 'submitted' ? '#EFF6FF' : '#FEF3C7',
                color: currentReport?.status === 'approved' ? '#15803D' : currentReport?.status === 'submitted' ? '#2563EB' : '#D97706',
                textTransform: 'capitalize'
              }}>
                {currentReport?.status || 'Draft'}
              </span>
            </div>
          </div>
          <button
            onClick={() => handleCardClick('/my-report')}
            title="View Weekly Report"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B',
              transition: 'all 0.15s ease'
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ marginTop: '16px' }}>
          <div style={{
            height: '6px',
            width: '100%',
            backgroundColor: '#E2E8F0',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '8px'
          }}>
            <div style={{
              height: '100%',
              width: `${(completedSections / 5) * 100}%`,
              backgroundColor: '#10B981',
              borderRadius: '3px'
            }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '500' }}>
            {completedSections} of 5 sections completed
          </span>
        </div>
      </div>

      {/* Card 2: Goals Progress */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Target size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1E293B', margin: 0 }}>
                Goals Progress
              </h4>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', marginTop: '2px', display: 'block' }}>
                {goalsPercentage}%
              </span>
            </div>
          </div>
          <button
            onClick={() => handleCardClick('/my-report')}
            title="View Goals"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B'
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ marginTop: '16px' }}>
          <div style={{
            height: '6px',
            width: '100%',
            backgroundColor: '#E2E8F0',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '8px'
          }}>
            <div style={{
              height: '100%',
              width: `${goalsPercentage}%`,
              backgroundColor: '#10B981',
              borderRadius: '3px'
            }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '500' }}>
            {goalsCount} goal{goalsCount !== 1 ? 's' : ''} planned for next week
          </span>
        </div>
      </div>

      {/* Card 3: Blockers */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: blockersCount > 0 ? '#FEF2F2' : '#F8FAFC',
              color: blockersCount > 0 ? '#EF4444' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1E293B', margin: 0 }}>
                Blockers
              </h4>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: blockersCount > 0 ? '#EF4444' : '#0F172A', marginTop: '2px', display: 'block' }}>
                {blockersCount}
              </span>
            </div>
          </div>
          <button
            onClick={() => handleCardClick('/my-report')}
            title="View Blockers"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B'
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ marginTop: '16px' }}>
          <span style={{ fontSize: '0.75rem', color: blockersCount > 0 ? '#DC2626' : '#64748B', fontWeight: '600' }}>
            {keyIssuesCount > 0 ? `${keyIssuesCount} key issue${keyIssuesCount > 1 ? 's' : ''} needs attention` : blockersCount === 0 ? 'No active blockers' : `${blockersCount} blocker issue logged`}
          </span>
        </div>
      </div>

      {/* Card 4: Hours Logged */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#EFF6FF',
              color: '#3B82F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1E293B', margin: 0 }}>
                Hours Logged
              </h4>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', marginTop: '2px', display: 'block' }}>
                {totalHours}h
              </span>
            </div>
          </div>
          <button
            onClick={() => handleCardClick('/my-report')}
            title="View Hours"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B'
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ marginTop: '16px' }}>
          <div style={{
            height: '6px',
            width: '100%',
            backgroundColor: '#E2E8F0',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '8px'
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, Math.round((totalHours / 40) * 100))}%`,
              backgroundColor: '#2563EB',
              borderRadius: '3px'
            }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '500' }}>
            of 40h planned
          </span>
        </div>
      </div>

    </div>
  );
}
