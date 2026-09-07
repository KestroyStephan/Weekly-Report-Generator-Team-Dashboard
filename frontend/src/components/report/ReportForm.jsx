import React from 'react';
import Select from '../common/Select';
import Button from '../common/Button';
import StatusBadge from './StatusBadge';
import TaskTable from './TaskTable';
import BlockerList from './BlockerList';
import AchievementList from './AchievementList';
import HoursBreakdown from './HoursBreakdown';
import {
  Save,
  Send,
  AlertTriangle,
  MessageSquare,
  Calendar,
  User,
  FolderKanban,
  CheckCircle2,
  CalendarClock,
  Sparkles,
  FileText
} from 'lucide-react';

export default function ReportForm({
  report,
  projects = [],
  onChange,
  onSaveDraft,
  onSubmit,
  isSaving = false,
  isSubmitting = false,
  isReadOnly = false
}) {
  const safeProjects = Array.isArray(projects) ? projects : [];

  const rawContent = report?.content || {};
  const content = {
    tasks_completed: rawContent.tasks_completed || [],
    tasks_planned_next_week: rawContent.tasks_planned_next_week || [],
    blockers: rawContent.blockers || [],
    achievements: rawContent.achievements || [],
    hours_by_type: rawContent.hours_by_type || { development: 0, testing: 0, meetings: 0, documentation: 0, other: 0 },
    notes: rawContent.notes || ''
  };

  const handleContentChange = (field, value) => {
    onChange({
      ...report,
      content: { ...content, [field]: value }
    });
  };

  const handleProjectChange = (e) => {
    onChange({ ...report, project_id: e.target.value });
  };

  const isNeedsCorrection = report?.status === 'needs_correction';
  const reviewerComment = report?.review?.comment;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1080px', margin: '0 auto' }}>
      
      {/* Executive Header Banner Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 12px 36px -8px rgba(15, 23, 42, 0.07), 0 2px 6px rgba(0,0,0,0.02)',
        position: 'relative',
        overflow: 'hidden',
        padding: '28px 32px'
      }}>
        {/* Top Emerald Gradient Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '5px',
          background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
        }} />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          {/* Title & Metadata */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '12px',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                border: '1px solid #A7F3D0',
                fontSize: '0.875rem',
                fontWeight: '700'
              }}>
                <Calendar size={16} />
                <span>Week: {report?.week_start_date || ''} to {report?.week_end_date || ''}</span>
              </div>

              <StatusBadge status={report?.status || 'draft'} />

              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '4px 10px',
                borderRadius: '9999px',
                backgroundColor: '#F1F5F9',
                color: '#475569',
                border: '1px solid #CBD5E1'
              }}>
                Version #{report?.version || 1}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '0.9375rem' }}>
              <User size={16} color="#0D8A6A" />
              <span>Report Author: <strong style={{ color: '#0F2942' }}>{report?.user_name || 'Current User'}</strong></span>
            </div>
          </div>

          {/* Associated Project Selector */}
          <div style={{ width: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: '700', color: '#0F2942', marginBottom: '6px' }}>
              <FolderKanban size={15} color="#0D8A6A" />
              <span>Associated Project</span>
            </div>
            <Select
              disabled={isReadOnly}
              value={report?.project_id || ''}
              onChange={handleProjectChange}
              options={[
                { value: '', label: '-- Select Project --' },
                ...safeProjects.map((p) => ({ value: p.id || p._id, label: p.name }))
              ]}
            />
          </div>
        </div>
      </div>

      {/* Amber Alert Banner for Needs Correction */}
      {isNeedsCorrection && reviewerComment && (
        <div style={{
          backgroundColor: '#FFFBEB',
          border: '1.5px solid #FDE68A',
          borderLeft: '6px solid #D97706',
          borderRadius: '18px',
          padding: '20px 24px',
          boxShadow: '0 8px 24px -4px rgba(217, 119, 6, 0.12)',
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: '#FEF3C7',
            color: '#D97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#B45309', margin: '0 0 4px 0' }}>
              Manager Requested Corrections
            </h4>
            <p style={{ fontSize: '0.9375rem', color: '#78350F', margin: 0, lineHeight: 1.5, fontWeight: '500' }}>
              "{reviewerComment}"
            </p>
            <span style={{ fontSize: '0.8125rem', color: '#92400E', marginTop: '8px', display: 'block', fontWeight: '600' }}>
              Please update the requested sections below and click <strong>"Resubmit Report"</strong> once ready.
            </span>
          </div>
        </div>
      )}

      {/* Main Document Content Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '32px',
        borderRadius: '24px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 12px 36px -8px rgba(15, 23, 42, 0.06), 0 2px 6px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '36px'
      }}>
        {/* Section 1: Completed / In-Progress Tasks */}
        <TaskTable
          title="Section 1: Completed & In-Progress Tasks"
          icon={CheckCircle2}
          iconColor="#059669"
          iconBg="#ECFDF5"
          tasks={content.tasks_completed}
          onChange={(newTasks) => handleContentChange('tasks_completed', newTasks)}
          isReadOnly={isReadOnly}
        />

        <hr style={{ border: 'none', borderTop: '1px dashed #E2E8F0' }} />

        {/* Section 2: Planned Tasks for Next Week */}
        <TaskTable
          title="Section 2: Planned Tasks for Next Week"
          icon={CalendarClock}
          iconColor="#0284C7"
          iconBg="#F0F9FF"
          tasks={content.tasks_planned_next_week}
          onChange={(newTasks) => handleContentChange('tasks_planned_next_week', newTasks)}
          isReadOnly={isReadOnly}
        />

        <hr style={{ border: 'none', borderTop: '1px dashed #E2E8F0' }} />

        {/* Section 3: Blockers */}
        <BlockerList
          blockers={content.blockers}
          onChange={(newBlockers) => handleContentChange('blockers', newBlockers)}
          isReadOnly={isReadOnly}
        />

        <hr style={{ border: 'none', borderTop: '1px dashed #E2E8F0' }} />

        {/* Section 4: Achievements */}
        <AchievementList
          achievements={content.achievements}
          onChange={(newAch) => handleContentChange('achievements', newAch)}
          isReadOnly={isReadOnly}
        />

        <hr style={{ border: 'none', borderTop: '1px dashed #E2E8F0' }} />

        {/* Section 5: Hours Breakdown */}
        <HoursBreakdown
          hours={content.hours_by_type}
          onChange={(newHours) => handleContentChange('hours_by_type', newHours)}
          isReadOnly={isReadOnly}
        />

        <hr style={{ border: 'none', borderTop: '1px dashed #E2E8F0' }} />

        {/* Section 6: Additional Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#F1F5F9',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MessageSquare size={18} />
            </div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: '800', color: '#0F2942', margin: 0 }}>
              Section 6: Additional Notes & Comments
            </h3>
          </div>

          {isReadOnly ? (
            <p style={{
              fontSize: '0.9375rem',
              color: '#334155',
              backgroundColor: '#F8FAFC',
              padding: '16px',
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              lineHeight: 1.5,
              margin: 0
            }}>
              {content.notes || 'No additional notes provided for this report.'}
            </p>
          ) : (
            <textarea
              rows={3}
              value={content.notes}
              onChange={(e) => handleContentChange('notes', e.target.value)}
              placeholder="Any additional team updates, leave requests, or general notes..."
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.9375rem',
                fontFamily: 'inherit',
                outline: 'none',
                backgroundColor: '#FFFFFF',
                color: '#0F2942',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
                resize: 'vertical'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0D8A6A';
                e.target.style.boxShadow = '0 0 0 3px rgba(13, 138, 106, 0.12)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#CBD5E1';
                e.target.style.boxShadow = 'none';
              }}
            />
          )}
        </div>
      </div>

      {/* Action Footer Bar */}
      {!isReadOnly && (
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '20px 28px',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 12px 32px -6px rgba(15, 23, 42, 0.06)',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '14px'
        }}>
          <Button
            variant="outline"
            icon={Save}
            isLoading={isSaving}
            onClick={onSaveDraft}
          >
            Save Draft
          </Button>
          <Button
            variant="primary"
            icon={Send}
            isLoading={isSubmitting}
            onClick={onSubmit}
          >
            {isNeedsCorrection ? 'Resubmit Report' : 'Submit Report for Review'}
          </Button>
        </div>
      )}
    </div>
  );
}
