import React from 'react';
import { formatDate } from '../../utils/dateHelpers';
import Badge from '../common/Badge';
import { Trash2, ShieldCheck, UserCheck } from 'lucide-react';

export default function UserTable({ users = [], availableRoles = ['admin', 'manager', 'member'], onRoleChange, onDeleteUser, currentUserId }) {
  return (
    <div style={{ overflowX: 'auto', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
            <th style={{ padding: '14px 20px', fontWeight: '600' }}>User Name</th>
            <th style={{ padding: '14px 20px', fontWeight: '600' }}>Email Address</th>
            <th style={{ padding: '14px 20px', fontWeight: '600' }}>Current Role (RBAC)</th>
            <th style={{ padding: '14px 20px', fontWeight: '600' }}>Created Date</th>
            <th style={{ padding: '14px 20px', fontWeight: '600', textAlign: 'right' }}>Role Access Control</th>
            <th style={{ padding: '14px 20px', fontWeight: '600', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const isSelf = u.id === currentUserId;
            return (
              <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.15s ease' }}>
                <td style={{ padding: '16px 20px', fontWeight: '600', color: '#0F2942', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: u.role === 'admin' ? '#EEF2FF' : u.role === 'manager' ? '#E6F4F0' : '#F1F5F9',
                    color: u.role === 'admin' ? '#4F46E5' : u.role === 'manager' ? '#0D8A6A' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.875rem'
                  }}>
                    {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    {u.name} {isSelf && <span style={{ fontSize: '0.75rem', color: '#0D8A6A', fontWeight: '600', marginLeft: '4px' }}>(You)</span>}
                  </div>
                </td>
                <td style={{ padding: '16px 20px', color: '#475569' }}>
                  {u.email}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <Badge variant={u.role === 'admin' ? 'indigo' : u.role === 'manager' ? 'blue' : 'gray'}>
                    {u.role ? u.role.toUpperCase() : 'MEMBER'}
                  </Badge>
                </td>
                <td style={{ padding: '16px 20px', color: '#64748B' }}>
                  {formatDate(u.created_at)}
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <select
                    value={u.role}
                    disabled={isSelf}
                    onChange={(e) => onRoleChange(u.id, e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      backgroundColor: isSelf ? '#F8FAFC' : '#FFFFFF',
                      fontSize: '0.8125rem',
                      fontWeight: '600',
                      color: '#0F2942',
                      cursor: isSelf ? 'not-allowed' : 'pointer',
                      outline: 'none'
                    }}
                  >
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                  {!isSelf && onDeleteUser && (
                    <button
                      type="button"
                      onClick={() => onDeleteUser(u.id, u.name)}
                      title="Delete User"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '6px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
