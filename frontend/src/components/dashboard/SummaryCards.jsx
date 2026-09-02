import React from 'react';
import { Send, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function SummaryCards({ summary = {} }) {
  const cards = [
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

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            style={{
              backgroundColor: '#FFFFFF',
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-card-border)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <span style={{ fontSize: '0.8125rem', fontWeight: '500', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                {card.title}
              </span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                {card.value}
              </h3>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: card.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: card.color
            }}>
              <Icon size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
