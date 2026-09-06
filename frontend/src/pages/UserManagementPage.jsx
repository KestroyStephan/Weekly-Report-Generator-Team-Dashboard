import React, { useState, useEffect } from 'react';
import { usersApi } from '../api/usersApi';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import UserTable from '../components/users/UserTable';
import {
  UserPlus,
  X,
  ShieldCheck,
  Mail,
  Users,
  CheckCircle2,
  Copy,
  ExternalLink,
  Send,
  Search,
  Filter,
  User,
  Briefcase,
  KeyRound
} from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [availableRoles, setAvailableRoles] = useState(['admin', 'manager', 'member']);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // New User Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [creating, setCreating] = useState(false);
  const [createdInvite, setCreatedInvite] = useState(null);
  const [copied, setCopied] = useState(false);

  const { user: currentUser } = useAuthStore();
  const { addToast } = useUIStore();

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, rolesData] = await Promise.all([
        usersApi.getUsers(),
        usersApi.getRoles().catch(() => ['admin', 'manager', 'member'])
      ]);
      setUsers(usersData);
      if (rolesData && rolesData.length > 0) {
        setAvailableRoles(rolesData);
      }
    } catch (err) {
      addToast("Failed to load users list or roles", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await usersApi.updateUserRole(userId, newRole);
      addToast("User role updated successfully!", "success");
      loadData();
    } catch (err) {
      addToast(err.response?.data?.detail || "Failed to update role", "error");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to remove user "${userName}"?`)) return;
    try {
      await usersApi.deleteUser(userId);
      addToast(`User ${userName} deleted successfully`, "success");
      loadData();
    } catch (err) {
      addToast(err.response?.data?.detail || "Failed to delete user", "error");
    }
  };

  const handleResetPassword = async (userId, userName, userEmail) => {
    try {
      const res = await usersApi.resetUserPassword(userId);
      addToast(`Password reset link generated for ${userName}!`, "success");
      setCreatedInvite({
        name: userName,
        email: userEmail,
        link: res.invitation_link,
        isReset: true
      });
      setShowModal(true);
    } catch (err) {
      addToast(err.response?.data?.detail || "Failed to reset password", "error");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      addToast("Please fill in all required fields", "error");
      return;
    }
    setCreating(true);
    try {
      const newUser = await usersApi.createUser({ name, email, role });
      addToast(`User ${name} created & invitation email dispatched!`, "success");
      setCreatedInvite({
        name,
        email,
        link: newUser.invitation_link || `http://localhost:5173/setup-password?email=${encodeURIComponent(email)}`
      });
      setName('');
      setEmail('');
      setRole('member');
      loadData();
    } catch (err) {
      addToast(err.response?.data?.detail || "Failed to create user", "error");
    } finally {
      setCreating(false);
    }
  };

  const copyInviteLink = () => {
    if (createdInvite?.link) {
      navigator.clipboard.writeText(createdInvite.link);
      setCopied(true);
      addToast("Invitation setup link copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCreatedInvite(null);
    setName('');
    setEmail('');
    setRole('member');
  };

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Calculate Stat Counts
  const totalCount = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const managerCount = users.filter((u) => u.role === 'manager').length;
  const memberCount = users.filter((u) => u.role === 'member').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Premium Filter & Search Bar Controls Card */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        backgroundColor: '#FFFFFF',
        padding: '20px 24px',
        borderRadius: '20px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 12px 32px -6px rgba(15, 23, 42, 0.06), 0 2px 6px rgba(0,0,0,0.02)'
      }}>
        {/* Live Search Input with Focus Glow */}
        <div style={{
          position: 'relative',
          flex: '1 1 320px',
          maxWidth: '440px'
        }}>
          <Search size={19} color="#0D8A6A" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name or email..."
            style={{
              width: '100%',
              padding: '12px 16px 12px 48px',
              borderRadius: '14px',
              border: '1.5px solid #CBD5E1',
              fontSize: '0.9375rem',
              outline: 'none',
              backgroundColor: '#F8FAFC',
              color: '#0F2942',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#0D8A6A';
              e.target.style.backgroundColor = '#FFFFFF';
              e.target.style.boxShadow = '0 0 0 4px rgba(13, 138, 106, 0.12)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#CBD5E1';
              e.target.style.backgroundColor = '#F8FAFC';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Right Controls: Filter Selector + Create New User CTA Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#E6F4F0',
              color: '#0D8A6A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Filter size={18} />
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#475569' }}>Role Filter:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.875rem',
                fontWeight: '700',
                color: '#0F2942',
                backgroundColor: '#FFFFFF',
                outline: 'none',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0D8A6A'}
              onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
            >
              <option value="all">All Roles ({users.length})</option>
              <option value="admin">ADMIN ({adminCount})</option>
              <option value="manager">MANAGER ({managerCount})</option>
              <option value="member">MEMBER ({memberCount})</option>
            </select>
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #0D8A6A 0%, #0B7A5D 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '14px',
              fontSize: '0.9375rem',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 8px 20px -4px rgba(13, 138, 106, 0.35)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(13, 138, 106, 0.45)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(13, 138, 106, 0.35)';
            }}
          >
            <UserPlus size={19} />
            <span>Create New User</span>
          </button>
        </div>
      </div>

      {/* User Table Component */}
      {loading ? (
        <div style={{ padding: '64px', textAlign: 'center', color: '#64748B', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
          Loading user directory and dynamic roles...
        </div>
      ) : (
        <UserTable
          users={filteredUsers}
          availableRoles={availableRoles}
          onRoleChange={handleRoleChange}
          onDeleteUser={handleDeleteUser}
          onResetPassword={handleResetPassword}
          currentUserId={currentUser?.id}
        />
      )}

      {/* Modal for Creating New User / Password Reset Link */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  backgroundColor: '#E6F4F0',
                  color: '#0D8A6A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UserPlus size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F2942', margin: 0 }}>
                    {createdInvite ? (createdInvite.isReset ? 'Password Reset Email Dispatched' : 'Invitation Email Dispatched') : 'Create New User'}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
                    {createdInvite ? (createdInvite.isReset ? `Password reset link generated for ${createdInvite.name}` : 'Password setup link sent to user') : 'Add account & set DB role access'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* If Account Created / Reset -> Show Email Banner & Setup Link */}
            {createdInvite ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#F0FDF4',
                  border: '1.5px solid #86EFAC',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Send size={22} color="#16A34A" />
                    <span style={{ fontSize: '1rem', fontWeight: '800', color: '#14532D' }}>
                      {createdInvite.isReset ? 'Reset Link Sent to ' : 'Email Sent to '}{createdInvite.email}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#166534', margin: 0, lineHeight: '1.5' }}>
                    {createdInvite.isReset
                      ? `An automated password reset email has been sent to ${createdInvite.email} with instructions to create a new password.`
                      : `An automated email has been sent to ${createdInvite.email} inviting them to create their login password and set up their credentials.`
                    }
                  </p>
                </div>

                {/* Copyable Password Setup / Reset Link */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#475569' }}>
                    {createdInvite.isReset ? 'Password Reset Link (For Admin / Testing):' : 'Invitation Setup Link (For Admin / Testing):'}
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    borderRadius: '12px'
                  }}>
                    <input
                      type="text"
                      readOnly
                      value={createdInvite.link}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        fontSize: '0.8125rem',
                        color: '#0F2942',
                        fontFamily: 'monospace',
                        outline: 'none'
                      }}
                    />
                    <button
                      onClick={copyInviteLink}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        backgroundColor: copied ? '#16A34A' : '#0F2942',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                      <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    onClick={closeModal}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#F8FAFC',
                      color: '#475569',
                      fontSize: '0.9375rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Done
                  </button>
                  <a
                    href={createdInvite.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1.2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: '#0D8A6A',
                      color: '#FFFFFF',
                      fontSize: '0.9375rem',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    <span>Open Setup Link</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ) : (
              /* Modal Form */
              <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F2942', marginBottom: '6px', display: 'block' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '0.9375rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F2942', marginBottom: '6px', display: 'block' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@company.com"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '0.9375rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F2942', marginBottom: '6px', display: 'block' }}>
                    Assign Role (From Database) *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '0.9375rem',
                      fontWeight: '600',
                      color: '#0F2942',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      boxSizing: 'border-box'
                    }}
                  >
                    {availableRoles.map((r) => (
                      <option key={r} value={r}>
                        {r.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.8125rem',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Send size={16} color="#0D8A6A" />
                  <span>An invitation email with a password setup link will automatically be sent to the user.</span>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#F8FAFC',
                      color: '#475569',
                      fontSize: '0.9375rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: '#0D8A6A',
                      color: '#FFFFFF',
                      fontSize: '0.9375rem',
                      fontWeight: '700',
                      cursor: creating ? 'not-allowed' : 'pointer',
                      opacity: creating ? 0.7 : 1
                    }}
                  >
                    {creating ? 'Creating User...' : 'Create & Send Invite'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
