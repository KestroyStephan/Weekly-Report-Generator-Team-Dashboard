import React from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

export default function SummaryCards({ summary = {}, membersCount = 0 }) {
  const totalSubmissions = (summary.total_submitted || 0) + (summary.total_approved || 0) + (summary.total_needs_correction || 0);

  const cards = [
    {
      title: 'Total Submissions',
      value: totalSubmissions,
      icon: FileText,
      color: '#059669',
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0'
    },
    {
      title: 'Approved Reports',
      value: summary.total_approved || 0,
      icon: CheckCircle2,
      color: '#2563EB',
      bgColor: '#EFF6FF',
      borderColor: '#BFDBFE'
    },
    {
      title: 'Needs Review',
      value: summary.total_pending_review || 0,
      icon: Clock,
      color: '#D97706',
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A'
    },
    {
      title: 'At-Risk Items',
      value: summary.open_blockers_count || 0,
      icon: AlertTriangle,
      color: '#EF4444',
      bgColor: '#FEF2F2',
      borderColor: '#FCA5A5'
    },
    {
      title: 'Team Members',
      value: membersCount || 0,
      icon: Users,
      color: '#8B5CF6',
      bgColor: '#F3E8FF',
      borderColor: '#DDD6FE'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px'
    }}>
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            style={{
              backgroundColor: '#FFFFFF',
              padding: '22px 24px',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 14px 32px -6px rgba(15, 23, 42, 0.09)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(15, 23, 42, 0.05)';
            }}
          >
            {/* Top Row: Icon + Value */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                backgroundColor: card.bgColor,
                border: `1px solid ${card.borderColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color,
                flexShrink: 0
              }}>
                <Icon size={22} style={{ strokeWidth: 2.2 }} />
              </div>

              <h3 style={{
                fontSize: '2rem',
                fontWeight: '900',
                color: '#0F172A',
                margin: 0,
                lineHeight: 1
              }}>
                {card.value}
              </h3>
            </div>

            {/* Bottom Row: Label */}
            <div>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '700',
                color: '#475569',
                display: 'block'
              }}>
                {card.title}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
