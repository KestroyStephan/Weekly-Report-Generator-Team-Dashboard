import React from 'react';
import { formatDate } from '../../utils/dateHelpers';
import Badge from '../common/Badge';
import { Trash2, KeyRound, Shield, User, Briefcase, Sparkles } from 'lucide-react';

export default function UserTable({
  users = [],
  availableRoles = ['admin', 'manager', 'member'],
  onRoleChange,
  onDeleteUser,
  onResetPassword,
  currentUserId
}) {
  return (
    <div style={{
      overflow: 'hidden',
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(0,0,0,0.02)'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{
              backgroundColor: '#F8FAFC',
              borderBottom: '1.5px solid #E2E8F0',
              textAlign: 'left',
              color: '#475569'
            }}>
              <th style={{ padding: '16px 24px', fontWeight: '700', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                User Profile
              </th>
              <th style={{ padding: '16px 24px', fontWeight: '700', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Email Address
              </th>
              <th style={{ padding: '16px 24px', fontWeight: '700', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Current Role (RBAC)
              </th>
              <th style={{ padding: '16px 24px', fontWeight: '700', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Joined Date
              </th>
              <th style={{ padding: '16px 24px', fontWeight: '700', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'right' }}>
                Role Access Control
              </th>
              <th style={{ padding: '16px 24px', fontWeight: '700', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'center' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
                  No users found matching the selected criteria.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isSelf = u.id === currentUserId;
                const isAdmin = u.role === 'admin';
                const isManager = u.role === 'manager';
                const isProtectedAccount = u.email?.toLowerCase() === 'admin@demo.com' || u.role === 'admin';

                const avatarBg = isAdmin
                  ? 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)'
                  : isManager
                  ? 'linear-gradient(135deg, #0D8A6A 0%, #10B981 100%)'
                  : 'linear-gradient(135deg, #475569 0%, #64748B 100%)';

                return (
                  <tr
                    key={u.id}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {/* User Profile */}
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          background: avatarBg,
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontSize: '0.9375rem',
                          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.12)',
                          flexShrink: 0
                        }}>
                          {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: '700', color: '#0F2942', fontSize: '0.9375rem' }}>
                              {u.name}
                            </span>
                            {isSelf && (
                              <span style={{
                                fontSize: '0.6875rem',
                                fontWeight: '800',
                                backgroundColor: '#E6F4F0',
                                color: '#0D8A6A',
                                padding: '2px 8px',
                                borderRadius: '10px'
                              }}>
                                You
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>ID: {u.id ? u.id.slice(-6) : ''}</span>
                        </div>
                      </div>
                    </td>

                    {/* Email Address */}
                    <td style={{ padding: '16px 24px', color: '#334155', fontWeight: '500' }}>
                      {u.email}
                    </td>

                    {/* Current Role Badge */}
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        backgroundColor: isAdmin ? '#EEF2FF' : isManager ? '#E6F4F0' : '#F1F5F9',
                        color: isAdmin ? '#4338CA' : isManager ? '#0D8A6A' : '#475569',
                        border: isAdmin ? '1px solid #C7D2FE' : isManager ? '1px solid #A7F3D0' : '1px solid #E2E8F0'
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: isAdmin ? '#4F46E5' : isManager ? '#10B981' : '#64748B'
                        }} />
                        {u.role ? u.role.toUpperCase() : 'MEMBER'}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td style={{ padding: '16px 24px', color: '#64748B', fontSize: '0.8125rem', fontWeight: '500' }}>
                      {formatDate(u.created_at)}
                    </td>

                    {/* Role Access Select */}
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <select
                        value={u.role}
                        disabled={isSelf || isProtectedAccount}
                        onChange={(e) => onRoleChange(u.id, e.target.value)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #CBD5E1',
                          backgroundColor: (isSelf || isProtectedAccount) ? '#F8FAFC' : '#FFFFFF',
                          fontSize: '0.8125rem',
                          fontWeight: '700',
                          color: '#0F2942',
                          cursor: (isSelf || isProtectedAccount) ? 'not-allowed' : 'pointer',
                          outline: 'none',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                          transition: 'border-color 0.15s ease'
                        }}
                        onFocus={(e) => !(isSelf || isProtectedAccount) && (e.target.style.borderColor = '#0D8A6A')}
                        onBlur={(e) => !(isSelf || isProtectedAccount) && (e.target.style.borderColor = '#CBD5E1')}
                      >
                        {availableRoles.map((role) => (
                          <option key={role} value={role}>
                            {role.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions Column */}
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {onResetPassword && (
                          <button
                            type="button"
                            onClick={() => onResetPassword(u.id, u.name, u.email)}
                            title="Reset Password & Send Link"
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '10px',
                              border: 'none',
                              backgroundColor: '#E6F4F0',
                              color: '#0D8A6A',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 2px 4px rgba(13, 138, 106, 0.1)'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = '#0D8A6A';
                              e.currentTarget.style.color = '#FFFFFF';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = '#E6F4F0';
                              e.currentTarget.style.color = '#0D8A6A';
                            }}
                          >
                            <KeyRound size={16} />
                          </button>
                        )}

                        {isProtectedAccount ? (
                          <span
                            title="System Admin Account (Protected from deletion by any user)"
                            style={{
                              padding: '6px 10px',
                              borderRadius: '10px',
                              backgroundColor: '#EEF2FF',
                              color: '#4338CA',
                              fontSize: '0.75rem',
                              fontWeight: '800',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              border: '1px solid #C7D2FE',
                              userSelect: 'none'
                            }}
                          >
                            <Shield size={14} color="#4F46E5" />
                            Protected
                          </span>
                        ) : !isSelf && onDeleteUser ? (
                          <button
                            type="button"
                            onClick={() => onDeleteUser(u.id, u.name)}
                            title="Delete User Account"
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '10px',
                              border: 'none',
                              backgroundColor: '#FEF2F2',
                              color: '#EF4444',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.1)'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = '#EF4444';
                              e.currentTarget.style.color = '#FFFFFF';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = '#FEF2F2';
                              e.currentTarget.style.color = '#EF4444';
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        ) : null}
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
