import React from 'react';
import Select from '../common/Select';
import Button from '../common/Button';
import StatusBadge from './StatusBadge';
import TaskTable from './TaskTable';
import BlockerList from './BlockerList';
import AchievementList from './AchievementList';
import HoursBreakdown from './HoursBreakdown';
import { Save, Send, AlertTriangle, MessageSquare } from 'lucide-react';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '20px 24px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-card-border)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
              Weekly Report: {report?.week_start_date || ''} to {report?.week_end_date || ''}
            </h2>
            <StatusBadge status={report?.status || 'draft'} />
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>
              (Version #{report?.version || 1})
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Author: <strong>{report?.user_name || 'Current User'}</strong>
          </p>
        </div>

        <div style={{ width: '240px' }}>
          <Select
            label="Associated Project"
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

      {/* Amber Feedback Banner for Needs Correction */}
      {isNeedsCorrection && reviewerComment && (
        <div style={{
          backgroundColor: '#FFFBEB',
          borderLeft: '5px solid #D97706',
          borderRadius: 'var(--radius-sm)',
          padding: '16px 20px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          gap: '14px'
        }}>
          <AlertTriangle size={24} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#B45309', marginBottom: '4px' }}>
              Action Required: Reviewer Requested Changes
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#78350F', lineHeight: 1.5 }}>
              "{reviewerComment}"
            </p>
            <span style={{ fontSize: '0.75rem', color: '#92400E', marginTop: '6px', display: 'block' }}>
              Please update your report content below and click <strong>"Resubmit Report"</strong> once ready.
            </span>
          </div>
        </div>
      )}

      {/* Main Document Content Sections */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '24px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-card-border)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px'
      }}>
        {/* Section 1: Completed / In-Progress Tasks */}
        <TaskTable
          title="Section 1: Completed & In-Progress Tasks"
          tasks={content.tasks_completed}
          onChange={(newTasks) => handleContentChange('tasks_completed', newTasks)}
          isReadOnly={isReadOnly}
        />

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-card-border)' }} />

        {/* Section 2: Planned Tasks for Next Week */}
        <TaskTable
          title="Section 2: Planned Tasks for Next Week"
          tasks={content.tasks_planned_next_week}
          onChange={(newTasks) => handleContentChange('tasks_planned_next_week', newTasks)}
          isReadOnly={isReadOnly}
        />

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-card-border)' }} />

        {/* Section 3: Blockers */}
        <BlockerList
          blockers={content.blockers}
          onChange={(newBlockers) => handleContentChange('blockers', newBlockers)}
          isReadOnly={isReadOnly}
        />

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-card-border)' }} />

        {/* Section 4: Achievements */}
        <AchievementList
          achievements={content.achievements}
          onChange={(newAch) => handleContentChange('achievements', newAch)}
          isReadOnly={isReadOnly}
        />

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-card-border)' }} />

        {/* Section 5: Hours Breakdown */}
        <HoursBreakdown
          hours={content.hours_by_type}
          onChange={(newHours) => handleContentChange('hours_by_type', newHours)}
          isReadOnly={isReadOnly}
        />

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-card-border)' }} />

        {/* Section 6: Additional Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
            Additional Notes & Comments
          </label>
          {isReadOnly ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '4px' }}>
              {content.notes || 'No additional notes.'}
            </p>
          ) : (
            <textarea
              rows={3}
              value={content.notes}
              onChange={(e) => handleContentChange('notes', e.target.value)}
              placeholder="Any additional updates, leave requests, or comments..."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-card-border)',
                fontSize: '0.875rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          )}
        </div>
      </div>

      {/* Action Footer */}
      {!isReadOnly && (
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '16px 24px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-card-border)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
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
