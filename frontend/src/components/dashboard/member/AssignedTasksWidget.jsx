import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle } from 'lucide-react';
import { taskApi } from '../../../api/taskApi';

export default function AssignedTasksWidget() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await taskApi.getAssignedTasks();
        setTasks(data.filter(t => t.status !== 'done'));
      } catch (err) {
        console.error("Error loading assigned tasks", err);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  const handleMarkDone = async (taskId) => {
    try {
      await taskApi.updateTaskStatus(taskId, 'done');
      setTasks(tasks.filter(t => t._id !== taskId && t.id !== taskId));
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      padding: '24px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      height: '100%'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '10px',
          backgroundColor: '#EFF6FF',
          color: '#3B82F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ClipboardList size={18} />
        </div>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>
          Assigned Tasks from Manager
        </h3>
      </div>

      <div style={{ overflowY: 'auto', flexGrow: 1 }}>
        {loading ? (
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>No active assigned tasks right now. Great job!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tasks.map(task => (
              <div key={task._id || task.id} style={{
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: '#1E293B' }}>{task.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748B' }}>Priority: <strong style={{color: task.priority === 'high' ? '#EF4444' : task.priority === 'low' ? '#10B981' : '#F59E0B'}}>{task.priority}</strong></p>
                </div>
                <button
                  onClick={() => handleMarkDone(task._id || task.id)}
                  style={{
                    backgroundColor: '#ECFDF5',
                    color: '#10B981',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '600',
                    fontSize: '0.75rem'
                  }}
                >
                  <CheckCircle size={14} /> Mark Done
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
