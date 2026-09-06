import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../common/Button';

export default function TaskTable({ tasks = [], onChange, isReadOnly = false, title = "Completed / In-Progress Tasks" }) {
  const handleAddTask = () => {
    const newTask = {
      task_name: '',
      priority: 'medium',
      planned_pct: 100,
      actual_pct: 0,
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>{title}</h3>
        {!isReadOnly && (
          <Button variant="outline" size="sm" icon={Plus} onClick={handleAddTask}>
            Add Task Row
          </Button>
        )}
      </div>

      <div style={{ overflowX: 'auto', border: '1px solid var(--color-card-border)', borderRadius: 'var(--radius-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--color-card-border)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
              <th style={{ padding: '10px 12px', width: '30%' }}>Task Description</th>
              <th style={{ padding: '10px 12px', width: '12%' }}>Priority</th>
              <th style={{ padding: '10px 12px', width: '12%' }}>Status</th>
              <th style={{ padding: '10px 12px', width: '10%' }}>Actual %</th>
              <th style={{ padding: '10px 12px', width: '10%' }}>Spent (hrs)</th>
              <th style={{ padding: '10px 12px', width: '20%' }}>Deliverable / PR</th>
              {!isReadOnly && <th style={{ padding: '10px 12px', width: '6%', textAlign: 'center' }}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={isReadOnly ? 6 : 7} style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No tasks recorded for this section.
                </td>
              </tr>
            ) : (
              tasks.map((task, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--color-card-border)' }}>
                  <td style={{ padding: '8px 12px' }}>
                    {isReadOnly ? (
                      <span style={{ fontWeight: '500' }}>{task.task_name || 'N/A'}</span>
                    ) : (
                      <input
                        type="text"
                        value={task.task_name}
                        onChange={(e) => handleUpdateTask(idx, 'task_name', e.target.value)}
                        placeholder="e.g. Implement user login API"
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--color-card-border)' }}
                      />
                    )}
                  </td>

                  <td style={{ padding: '8px 12px' }}>
                    {isReadOnly ? (
                      <span style={{ textTransform: 'capitalize', fontSize: '0.8125rem' }}>{task.priority}</span>
                    ) : (
                      <select
                        value={task.priority}
                        onChange={(e) => handleUpdateTask(idx, 'priority', e.target.value)}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--color-card-border)' }}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    )}
                  </td>

                  <td style={{ padding: '8px 12px' }}>
                    {isReadOnly ? (
                      <span style={{ textTransform: 'capitalize', fontSize: '0.8125rem' }}>{(task?.status || 'in_progress').replace('_', ' ')}</span>
                    ) : (
                      <select
                        value={task?.status || 'in_progress'}
                        onChange={(e) => handleUpdateTask(idx, 'status', e.target.value)}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--color-card-border)' }}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    )}
                  </td>

                  <td style={{ padding: '8px 12px' }}>
                    {isReadOnly ? (
                      <span>{task.actual_pct}%</span>
                    ) : (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={task.actual_pct}
                        onChange={(e) => handleUpdateTask(idx, 'actual_pct', parseInt(e.target.value) || 0)}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--color-card-border)' }}
                      />
                    )}
                  </td>

                  <td style={{ padding: '8px 12px' }}>
                    {isReadOnly ? (
                      <span>{task.time_spent_hrs} hrs</span>
                    ) : (
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={task.time_spent_hrs}
                        onChange={(e) => handleUpdateTask(idx, 'time_spent_hrs', parseFloat(e.target.value) || 0)}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--color-card-border)' }}
                      />
                    )}
                  </td>

                  <td style={{ padding: '8px 12px' }}>
                    {isReadOnly ? (
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>{task.deliverable || '-'}</span>
                    ) : (
                      <input
                        type="text"
                        value={task.deliverable}
                        onChange={(e) => handleUpdateTask(idx, 'deliverable', e.target.value)}
                        placeholder="e.g. PR #104 merged"
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--color-card-border)' }}
                      />
                    )}
                  </td>

                  {!isReadOnly && (
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleRemoveTask(idx)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
