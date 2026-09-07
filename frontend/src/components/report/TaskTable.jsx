import React from 'react';
import {
  Plus,
  Trash2,
  CheckCircle2,
  CalendarClock,
  AlertTriangle,
  Clock,
  Layers,
  Link2,
  Sparkles,
  Inbox
} from 'lucide-react';
import Button from '../common/Button';

export default function TaskTable({
  tasks = [],
  onChange,
  isReadOnly = false,
  title = "Completed & In-Progress Tasks",
  icon: SectionIcon = CheckCircle2,
  iconColor = "#059669",
  iconBg = "#ECFDF5"
}) {
  const handleAddTask = () => {
    const newTask = {
      task_name: '',
      priority: 'medium',
      planned_pct: 100,
      actual_pct: 100,
      status: 'in_progress',
      time_planned_hrs: 0,
      time_spent_hrs: 0,
      deliverable: ''
    };
    onChange([...tasks, newTask]);
  };

  const handleUpdateTask = (index, field, value) => {
    const updated = tasks.map((t, idx) => (idx === index ? { ...t, [field]: value } : t));
    onChange(updated);
  };

  const handleRemoveTask = (index) => {
    onChange(tasks.filter((_, idx) => idx !== index));
  };

  const getPriorityBadgeStyle = (p = 'medium') => {
    switch (p.toLowerCase()) {
      case 'high':
        return { bg: '#FEF2F2', text: '#DC2626', border: '#FCA5A5', label: 'High' };
      case 'medium':
        return { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A', label: 'Medium' };
      case 'low':
      default:
        return { bg: '#F8FAFC', text: '#475569', border: '#CBD5E1', label: 'Low' };
    }
  };

  const getStatusBadgeStyle = (s = 'in_progress') => {
    switch (s.toLowerCase()) {
      case 'completed':
        return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0', label: 'Completed' };
      case 'in_progress':
        return { bg: '#F0F9FF', text: '#0284C7', border: '#BAE6FD', label: 'In Progress' };
      case 'blocked':
        return { bg: '#FEF2F2', text: '#DC2626', border: '#FCA5A5', label: 'Blocked' };
      case 'todo':
      default:
        return { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1', label: 'To Do' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Section Title Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: iconBg,
            color: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <SectionIcon size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: '800', color: '#0F2942', margin: 0 }}>
              {title}
            </h3>
            <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
              {tasks.length} task{tasks.length === 1 ? '' : 's'} recorded
            </span>
          </div>
        </div>

        {!isReadOnly && (
          <Button variant="primary" size="sm" icon={Plus} onClick={handleAddTask}>
            Add Task Row
          </Button>
        )}
      </div>

      {/* Task Table Container */}
      <div style={{
        overflowX: 'auto',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.03)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{
              backgroundColor: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              textAlign: 'left',
              color: '#64748B',
              fontSize: '0.78125rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <th style={{ padding: '14px 16px', width: '32%' }}>Task Description</th>
              <th style={{ padding: '14px 16px', width: '13%' }}>Priority</th>
              <th style={{ padding: '14px 16px', width: '14%' }}>Status</th>
              <th style={{ padding: '14px 16px', width: '11%' }}>Actual %</th>
              <th style={{ padding: '14px 16px', width: '11%' }}>Spent (hrs)</th>
              <th style={{ padding: '14px 16px', width: '13%' }}>Deliverable / PR</th>
              {!isReadOnly && <th style={{ padding: '14px 16px', width: '6%', textAlign: 'center' }}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={isReadOnly ? 6 : 7} style={{ padding: '40px 24px', textAlign: 'center' }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#94A3B8'
                    }}>
                      <Inbox size={24} />
                    </div>
                    <span style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#334155' }}>
                      No tasks recorded for this section
                    </span>
                    {!isReadOnly && (
                      <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
                        Click <strong>"+ Add Task Row"</strong> above to record your progress.
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              tasks.map((task, idx) => {
                const priBadge = getPriorityBadgeStyle(task.priority);
                const statBadge = getStatusBadgeStyle(task.status);

                return (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Task Description */}
                    <td style={{ padding: '12px 16px' }}>
                      {isReadOnly ? (
                        <span style={{ fontWeight: '600', color: '#0F2942', display: 'block', lineHeight: 1.4 }}>
                          {task.task_name || 'N/A'}
                        </span>
                      ) : (
                        <input
                          type="text"
                          value={task.task_name}
                          onChange={(e) => handleUpdateTask(idx, 'task_name', e.target.value)}
                          placeholder="Describe the task or deliverable..."
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '10px',
                            border: '1.5px solid #CBD5E1',
                            fontSize: '0.875rem',
                            outline: 'none',
                            backgroundColor: '#FFFFFF',
                            color: '#0F2942',
                            boxSizing: 'border-box',
                            transition: 'all 0.15s ease'
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
                    </td>

                    {/* Priority Select / Badge */}
                    <td style={{ padding: '12px 16px' }}>
                      {isReadOnly ? (
                        <span style={{
                          display: 'inline-flex',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          backgroundColor: priBadge.bg,
                          color: priBadge.text,
                          border: `1px solid ${priBadge.border}`,
                          fontSize: '0.75rem',
                          fontWeight: '700'
                        }}>
                          {priBadge.label}
                        </span>
                      ) : (
                        <select
                          value={task.priority || 'medium'}
                          onChange={(e) => handleUpdateTask(idx, 'priority', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '10px',
                            border: `1.5px solid ${priBadge.border}`,
                            backgroundColor: priBadge.bg,
                            color: priBadge.text,
                            fontSize: '0.8125rem',
                            fontWeight: '700',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                        </select>
                      )}
                    </td>

                    {/* Status Select / Badge */}
                    <td style={{ padding: '12px 16px' }}>
                      {isReadOnly ? (
                        <span style={{
                          display: 'inline-flex',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          backgroundColor: statBadge.bg,
                          color: statBadge.text,
                          border: `1px solid ${statBadge.border}`,
                          fontSize: '0.75rem',
                          fontWeight: '700'
                        }}>
                          {statBadge.label}
                        </span>
                      ) : (
                        <select
                          value={task.status || 'in_progress'}
                          onChange={(e) => handleUpdateTask(idx, 'status', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '10px',
                            border: `1.5px solid ${statBadge.border}`,
                            backgroundColor: statBadge.bg,
                            color: statBadge.text,
                            fontSize: '0.8125rem',
                            fontWeight: '700',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="blocked">Blocked</option>
                        </select>
                      )}
                    </td>

                    {/* Actual % */}
                    <td style={{ padding: '12px 16px' }}>
                      {isReadOnly ? (
                        <span style={{ fontWeight: '700', color: '#0F2942' }}>{task.actual_pct}%</span>
                      ) : (
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={task.actual_pct ?? 0}
                            onChange={(e) => handleUpdateTask(idx, 'actual_pct', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                            style={{
                              width: '100%',
                              padding: '8px 24px 8px 10px',
                              borderRadius: '10px',
                              border: '1.5px solid #CBD5E1',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              outline: 'none',
                              color: '#0F2942',
                              boxSizing: 'border-box'
                            }}
                            onFocus={(e) => (e.target.style.borderColor = '#0D8A6A')}
                            onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                          />
                          <span style={{ position: 'absolute', right: '8px', fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>%</span>
                        </div>
                      )}
                    </td>

                    {/* Time Spent (hrs) */}
                    <td style={{ padding: '12px 16px' }}>
                      {isReadOnly ? (
                        <span style={{ fontWeight: '700', color: '#0F2942' }}>{task.time_spent_hrs} hrs</span>
                      ) : (
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={task.time_spent_hrs ?? 0}
                            onChange={(e) => handleUpdateTask(idx, 'time_spent_hrs', Math.max(0, parseFloat(e.target.value) || 0))}
                            style={{
                              width: '100%',
                              padding: '8px 30px 8px 10px',
                              borderRadius: '10px',
                              border: '1.5px solid #CBD5E1',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              outline: 'none',
                              color: '#0F2942',
                              boxSizing: 'border-box'
                            }}
                            onFocus={(e) => (e.target.style.borderColor = '#0D8A6A')}
                            onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                          />
                          <span style={{ position: 'absolute', right: '8px', fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>h</span>
                        </div>
                      )}
                    </td>

                    {/* Deliverable / PR */}
                    <td style={{ padding: '12px 16px' }}>
                      {isReadOnly ? (
                        <span style={{ color: '#475569', fontSize: '0.8125rem' }}>{task.deliverable || '-'}</span>
                      ) : (
                        <input
                          type="text"
                          value={task.deliverable || ''}
                          onChange={(e) => handleUpdateTask(idx, 'deliverable', e.target.value)}
                          placeholder="PR #102 / Commit link"
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '10px',
                            border: '1.5px solid #CBD5E1',
                            fontSize: '0.8125rem',
                            outline: 'none',
                            color: '#0F2942',
                            boxSizing: 'border-box'
                          }}
                          onFocus={(e) => (e.target.style.borderColor = '#0D8A6A')}
                          onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                        />
                      )}
                    </td>

                    {/* Action */}
                    {!isReadOnly && (
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleRemoveTask(idx)}
                          title="Remove task row"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            border: '1px solid #FEE2E2',
                            backgroundColor: '#FFFFFF',
                            color: '#EF4444',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#FEF2F2';
                            e.currentTarget.style.borderColor = '#FCA5A5';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFFFFF';
                            e.currentTarget.style.borderColor = '#FEE2E2';
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
