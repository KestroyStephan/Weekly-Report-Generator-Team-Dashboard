import React from 'react';
import { formatDate } from '../../utils/dateHelpers';
import Badge from '../common/Badge';

export default function UserTable({ users = [], onRoleChange, currentUserId }) {
  return (
    <div style={{ overflowX: 'auto', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-card-border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--color-card-border)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
            <th style={{ padding: '12px 16px' }}>User Name</th>
            <th style={{ padding: '12px 16px' }}>Email Address</th>
            <th style={{ padding: '12px 16px' }}>Role</th>
            <th style={{ padding: '12px 16px' }}>Joined Date</th>
            <th style={{ padding: '12px 16px', textAlign: 'right' }}>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const isSelf = u.id === currentUserId;
            return (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--color-card-border)' }}>
                <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                  {u.name} {isSelf && <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>(You)</span>}
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>
                  {u.email}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge variant={u.role === 'admin' ? 'indigo' : u.role === 'manager' ? 'blue' : 'gray'}>
                    {u.role}
                  </Badge>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>
                  {formatDate(u.created_at)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <select
                    value={u.role}
                    disabled={isSelf}
                    onChange={(e) => onRoleChange(u.id, e.target.value)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid var(--color-card-border)',
                      fontSize: '0.8125rem',
                      cursor: isSelf ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <option value="member">member</option>
                    <option value="manager">manager</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
