import React, { useState } from 'react';
import { taskApi } from '../../api/taskApi';
import { PlusCircle } from 'lucide-react';

export default function QuickAssignTaskWidget({ members, projects }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    project_id: '',
    assigned_to: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await taskApi.createTask(formData);
      setMessage('Task assigned successfully!');
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        project_id: '',
        assigned_to: ''
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setMessage('Failed to assign task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      padding: '24px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#E0F2FE', padding: '8px', borderRadius: '10px', color: '#0EA5E9' }}>
          <PlusCircle size={20} />
        </div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0F2942', margin: 0 }}>Quick Assign Task</h3>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Task Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Update user authentication"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Assignee</label>
            <select
              name="assigned_to"
              required
              value={formData.assigned_to}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem', backgroundColor: '#fff' }}
            >
              <option value="">Select Member</option>
              {members.map(m => (
                <option key={m.id || m._id} value={m.id || m._id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Project</label>
            <select
              name="project_id"
              required
              value={formData.project_id}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem', backgroundColor: '#fff' }}
            >
              <option value="">Select Project</option>
              {projects.map(p => (
                <option key={p.id || p._id} value={p.id || p._id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem', backgroundColor: '#fff' }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#0D8A6A',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Assigning...' : 'Assign Task'}
          </button>
          {message && (
            <p style={{ marginTop: '10px', fontSize: '0.8125rem', color: message.includes('success') ? '#0D8A6A' : '#EF4444', textAlign: 'center', fontWeight: '500' }}>
              {message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
