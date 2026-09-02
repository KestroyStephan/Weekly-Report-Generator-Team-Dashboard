import React from 'react';
import Badge from '../common/Badge';

export default function StatusBadge({ status }) {
  const statusMap = {
    draft: { label: 'Draft', variant: 'gray' },
    submitted: { label: 'Submitted', variant: 'blue' },
    needs_correction: { label: 'Needs Correction', variant: 'amber' },
    approved: { label: 'Approved', variant: 'green' }
  };

  const current = statusMap[status] || { label: status, variant: 'gray' };

  return <Badge variant={current.variant}>{current.label}</Badge>;
}
