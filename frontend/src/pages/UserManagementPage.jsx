import React, { useState, useEffect } from 'react';
import { usersApi } from '../api/usersApi';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import UserTable from '../components/users/UserTable';
import { UserPlus, X, Shield, Key, Mail, User } from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [availableRoles, setAvailableRoles] = useState(['admin', 'manager', 'member']);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New User Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [creating, setCreating] = useState(false);

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

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      addToast("Please fill in all required fields", "error");
      return;
    }
    setCreating(true);
    try {
      await usersApi.createUser({ name, email, password, role });
      addToast(`User ${name} created successfully!`, "success");
      setShowModal(false);
      setName('');
      setEmail('');
      setPassword('');
      setRole('member');
      loadData();
    } catch (err) {
      addToast(err.response?.data?.detail || "Failed to create user", "error");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F2942', margin: 0 }}>
            User & Role Management (RBAC)
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '4px 0 0 0' }}>
            Create users, view active team accounts, and assign database role-based access permissions.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            backgroundColor: '#0D8A6A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            fontSize: '0.9375rem',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(13, 138, 106, 0.2)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0B7A5D'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0D8A6A'}
        >
          <UserPlus size={18} />
          <span>Create New User</span>
        </button>
      </div>

      {/* User Table Component */}
      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: '#64748B', backgroundColor: '#FFFFFF', borderRadius: '16px' }}>
          Loading user directory and dynamic roles...
        </div>
      ) : (
        <UserTable
          users={users}
          availableRoles={availableRoles}
          onRoleChange={handleRoleChange}
          onDeleteUser={handleDeleteUser}
          currentUserId={currentUser?.id}
        />
      )}

      {/* Modal for Creating New User */}
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
            maxWidth: '500px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: '#E6F4F0',
                  color: '#0D8A6A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F2942', margin: 0 }}>Create New User</h3>
                  <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>Add account & set DB role access</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
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
                  Initial Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
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

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
                  {creating ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
