import React from 'react';
import {
  Send,
  Clock,
  AlertTriangle,
  FolderKanban,
  Activity,
  PauseCircle,
  Archive
} from 'lucide-react';

export default function SummaryCards({ summary = {}, projects = [] }) {
  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (p) => (p.status || 'active').toLowerCase() === 'active' || (p.status || '').toLowerCase() === 'in_progress'
  ).length;
  const onHoldProjects = projects.filter(
    (p) => (p.status || '').toLowerCase() === 'on_hold'
  ).length;
  const completedOrArchived = projects.filter(
    (p) => (p.status || '').toLowerCase() === 'completed' || (p.status || '').toLowerCase() === 'archived'
  ).length;

  const reportCards = [
    {
      title: 'Submitted Reports',
      value: summary.total_submitted || 0,
      icon: Send,
      color: '#2563EB',
      bgColor: '#EFF6FF'
    },
    {
      title: 'Pending Review',
      value: summary.total_pending_review || 0,
      icon: Clock,
      color: '#3B82F6',
      bgColor: '#F0F9FF'
    },
    {
      title: 'Needs Correction',
      value: summary.total_needs_correction || 0,
      icon: AlertTriangle,
      color: '#D97706',
      bgColor: '#FFFBEB'
    },
    {
      title: 'Open Key Blockers',
      value: summary.open_blockers_count || 0,
      icon: AlertTriangle,
      color: '#EF4444',
      bgColor: '#FEF2F2'
    }
  ];

  const projectCards = [
    {
      title: 'Total Projects',
      value: totalProjects,
      icon: FolderKanban,
      color: '#0D8A6A',
      bgColor: '#ECFDF5'
    },
    {
      title: 'Active & In Progress',
      value: activeProjects,
      icon: Activity,
      color: '#059669',
      bgColor: '#E6F4EA'
    },
    {
      title: 'On Hold Projects',
      value: onHoldProjects,
      icon: PauseCircle,
      color: '#D97706',
      bgColor: '#FFFBEB'
    },
    {
      title: 'Completed / Archived',
      value: completedOrArchived,
      icon: Archive,
      color: '#64748B',
      bgColor: '#F8FAFC'
    }
  ];

  const renderCardGrid = (cards) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            style={{
              backgroundColor: '#FFFFFF',
              padding: '20px 22px',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 25px -4px rgba(15, 23, 42, 0.08)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px -2px rgba(15, 23, 42, 0.04)';
            }}
          >
            <div>
              <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#64748B', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                {card.title}
              </span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', margin: 0, lineHeight: 1.15 }}>
                {card.value}
              </h3>
            </div>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              backgroundColor: card.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: card.color,
              flexShrink: 0
            }}>
              <Icon size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Report & Review Analytics */}
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#475569', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Weekly Reports Overview
        </div>
        {renderCardGrid(reportCards)}
      </div>

      {/* Project Status Metrics */}
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#475569', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Project Portfolio Status
        </div>
        {renderCardGrid(projectCards)}
      </div>
    </div>
  );
}
