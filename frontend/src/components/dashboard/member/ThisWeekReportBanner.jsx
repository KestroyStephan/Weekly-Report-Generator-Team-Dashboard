import React from 'react';
import { Briefcase, Calendar, Check, ArrowRight, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../../../store/uiStore';

export default function ThisWeekReportBanner({ currentReport, onSaveDraft }) {
  const navigate = useNavigate();
  const { addToast } = useUIStore();

  const content = currentReport?.content || {};

  const isBasicCompleted = !!currentReport?.project_id;
  const isTasksCompleted = content.tasks_completed && content.tasks_completed.length > 0;
  const isNextWeekCompleted = content.tasks_planned_next_week && content.tasks_planned_next_week.length > 0;
  const isBlockersCompleted = (content.blockers && content.blockers.length > 0) || (content.achievements && content.achievements.length > 0);
  const isSubmitted = currentReport?.status === 'submitted' || currentReport?.status === 'approved';

  const steps = [
    { label: 'Basic Info', status: isBasicCompleted ? 'completed' : 'active', number: '1' },
    { label: 'Tasks Completed', status: isTasksCompleted ? 'completed' : isBasicCompleted ? 'active' : 'pending', number: '2' },
    { label: 'Next Week Plans', status: isNextWeekCompleted ? 'completed' : isTasksCompleted ? 'active' : 'pending', number: '3' },
    { label: 'Blockers & Achievements', status: isBlockersCompleted ? 'completed' : isNextWeekCompleted ? 'active' : 'pending', number: '4' },
    { label: 'Review & Submit', status: isSubmitted ? 'completed' : isBlockersCompleted ? 'active' : 'pending', number: '5' }
  ];

  const handleContinueReport = () => {
    navigate('/my-report');
  };

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft();
    } else {
      addToast("Draft report state saved successfully!", "success");
    }
  };

  const startDate = currentReport?.week_start_date || 'Current Week';
  const endDate = currentReport?.week_end_date || '';

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      padding: '24px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* Card Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#ECFDF5',
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Briefcase size={20} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>
            This Week's Report
          </h3>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '20px',
          padding: '6px 14px',
          fontSize: '0.8125rem',
          color: '#64748B',
          fontWeight: '600'
        }}>
          <Calendar size={15} style={{ color: '#10B981' }} />
          <span>{startDate} {endDate ? `– ${endDate}` : ''}</span>
        </div>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0, lineHeight: '1.5' }}>
        Continue working on your weekly report. Don't forget to submit before the deadline.
      </p>

      {/* Interactive Stepper Progress */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        padding: '10px 0',
        maxWidth: '700px'
      }}>
        {steps.map((step, idx) => (
          <React.Fragment key={step.label}>
            {/* Step Circle & Label */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              zIndex: 2
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: step.status === 'completed'
                  ? '#10B981'
                  : step.status === 'active'
                  ? '#E0F2FE'
                  : '#F1F5F9',
                color: step.status === 'completed'
                  ? '#FFFFFF'
                  : step.status === 'active'
                  ? '#0284C7'
                  : '#94A3B8',
                border: step.status === 'active' ? '2px solid #0284C7' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.875rem',
                boxShadow: step.status === 'completed' ? '0 2px 6px rgba(16, 185, 129, 0.3)' : 'none'
              }}>
                {step.status === 'completed' ? (
                  <Check size={18} strokeWidth={2.5} />
                ) : (
                  step.number
                )}
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: step.status === 'active' ? '700' : '500',
                color: step.status === 'active' ? '#0F172A' : '#64748B',
                textAlign: 'center'
              }}>
                {step.label}
              </span>
            </div>

            {/* Connecting Line */}
            {idx < steps.length - 1 && (
              <div style={{
                flexGrow: 1,
                height: '3px',
                backgroundColor: idx < 3 && isTasksCompleted ? '#10B981' : '#E2E8F0',
                margin: '0 8px',
                marginTop: '-24px',
                borderRadius: '2px'
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '4px' }}>
        <button
          onClick={handleContinueReport}
          style={{
            backgroundColor: '#10B981',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '0.9375rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.15s ease'
          }}
        >
          <span>Continue Report</span>
          <ArrowRight size={18} />
        </button>

        <button
          onClick={handleSaveDraft}
          style={{
            backgroundColor: '#FFFFFF',
            color: '#334155',
            border: '1px solid #CBD5E1',
            borderRadius: '12px',
            padding: '12px 20px',
            fontSize: '0.9375rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <Save size={17} style={{ color: '#64748B' }} />
          <span>Save as Draft</span>
        </button>
      </div>

    </div>
  );
}
