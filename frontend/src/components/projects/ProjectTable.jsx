import React, { useState } from 'react';
import {
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  PauseCircle,
  Archive,
  Activity,
  FolderKanban,
  Info,
  Calendar,
  Layers
} from 'lucide-react';

export const STATUS_CONFIG = {
  active: {
    label: 'Active',
    meaning: 'Live project with ongoing team work & deliverables',
    color: '#059669',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    icon: Activity
  },
  in_progress: {
    label: 'In Progress',
    meaning: 'Currently in active development sprint execution',
    color: '#0284C7',
    bgColor: '#F0F9FF',
    borderColor: '#BAE6FD',
    icon: Clock
  },
  on_hold: {
    label: 'On Hold',
    meaning: 'Temporarily paused awaiting client or resource input',
    color: '#D97706',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    icon: PauseCircle
  },
  completed: {
    label: 'Completed',
    meaning: 'All project milestones & deliverables completed',
    color: '#4F46E5',
    bgColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    icon: CheckCircle2
  },
  archived: {
    label: 'Archived',
    meaning: 'Inactive project preserved for historical records',
    color: '#475569',
    bgColor: '#F1F5F9',
    borderColor: '#CBD5E1',
    icon: Archive
  }
};

export default function ProjectTable({ projects = [], onEdit, onDelete, onQuickStatusChange }) {
  const [hoveredStatusId, setHoveredStatusId] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 12px 32px -6px rgba(15, 23, 42, 0.06), 0 2px 6px rgba(0,0,0,0.02)',
      overflow: 'hidden'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
          <thead>
            <tr style={{
              backgroundColor: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              textAlign: 'left',
              color: '#64748B',
              fontSize: '0.8125rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <th style={{ padding: '16px 20px' }}>Project Name</th>
              <th style={{ padding: '16px 20px' }}>Description</th>
              <th style={{ padding: '16px 20px' }}>Status & Meaning</th>
              <th style={{ padding: '16px 20px' }}>Created Date</th>
              <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '48px 24px', textAlign: 'center' }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: '#F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#94A3B8'
                    }}>
                      <FolderKanban size={28} />
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1E293B', margin: 0 }}>
                      No projects found
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0, maxWidth: '360px' }}>
                      Try adjusting your search criteria or add a new project to get started.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              projects.map((proj) => {
                const projId = proj.id || proj._id;
                const statusKey = (proj.status || 'active').toLowerCase();
                const config = STATUS_CONFIG[statusKey] || STATUS_CONFIG.active;
                const StatusIcon = config.icon;
                const isHovered = hoveredStatusId === projId;

                return (
                  <tr
                    key={projId}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Project Name */}
                    <td style={{ padding: '18px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          backgroundColor: config.bgColor,
                          border: `1px solid ${config.borderColor}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: config.color,
                          flexShrink: 0
                        }}>
                          <Layers size={20} />
                        </div>
                        <div>
                          <span style={{
                            fontSize: '0.9375rem',
                            fontWeight: '700',
                            color: '#0F172A',
                            display: 'block',
                            lineHeight: 1.3
                          }}>
                            {proj.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Description */}
                    <td style={{ padding: '18px 20px', maxWidth: '320px' }}>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#475569',
                        margin: 0,
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {proj.description || <em style={{ color: '#94A3B8' }}>No description provided</em>}
                      </p>
                    </td>

                    {/* Status with Interactive Meaning Tooltip */}
                    <td style={{ padding: '18px 20px', position: 'relative' }}>
                      <div
                        style={{ position: 'relative', display: 'inline-block' }}
                        onMouseEnter={() => setHoveredStatusId(projId)}
                        onMouseLeave={() => setHoveredStatusId(null)}
                      >
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          width: '135px',
                          boxSizing: 'border-box',
                          borderRadius: '9999px',
                          backgroundColor: config.bgColor,
                          color: config.color,
                          border: `1px solid ${config.borderColor}`,
                          fontSize: '0.8125rem',
                          fontWeight: '700',
                          cursor: 'help',
                          userSelect: 'none',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                        }}>
                          <StatusIcon size={14} style={{ strokeWidth: 2.5 }} />
                          <span>{config.label}</span>
                          <Info size={12} style={{ opacity: 0.6, marginLeft: '2px' }} />
                        </span>

                        {/* Hover Tooltip showing Status Meaning */}
                        {isHovered && (
                          <div style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%) translateY(-8px)',
                            backgroundColor: '#0F172A',
                            color: '#FFFFFF',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                            zIndex: 100,
                            pointerEvents: 'none'
                          }}>
                            <div style={{ fontWeight: '700', color: '#34D399', marginBottom: '2px' }}>
                              Status: {config.label}
                            </div>
                            <div>{config.meaning}</div>
                            {/* Tooltip Arrow */}
                            <div style={{
                              position: 'absolute',
                              top: '100%',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: 0,
                              height: 0,
                              borderLeft: '6px solid transparent',
                              borderRight: '6px solid transparent',
                              borderTop: '6px solid #0F172A'
                            }} />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Created Date */}
                    <td style={{ padding: '18px 20px', color: '#64748B', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={15} color="#94A3B8" />
                        <span>{formatDate(proj.created_at)}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '18px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => onEdit(proj)}
                          title="Edit Project"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '34px',
                            height: '34px',
                            borderRadius: '10px',
                            border: '1px solid #E2E8F0',
                            backgroundColor: '#FFFFFF',
                            color: '#0D8A6A',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#ECFDF5';
                            e.currentTarget.style.borderColor = '#A7F3D0';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFFFFF';
                            e.currentTarget.style.borderColor = '#E2E8F0';
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => onDelete(proj)}
                          title="Delete Project"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '34px',
                            height: '34px',
                            borderRadius: '10px',
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
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
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
