import React, { useState, useEffect } from 'react';
import { usersApi } from '../api/usersApi';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import UserTable from '../components/users/UserTable';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuthStore();
  const { addToast } = useUIStore();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await usersApi.getUsers();
      setUsers(data);
    } catch (err) {
      addToast("Failed to load users list", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await usersApi.updateUserRole(userId, newRole);
      addToast("User role updated successfully!", "success");
      loadUsers();
    } catch (err) {
      addToast(err.response?.data?.detail || "Failed to update role", "error");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>User & Role Management</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Assign roles and manage team access controls (RBAC)</p>
      </div>

      {loading ? (
        <div style={{ padding: '32px', textAlign: 'center' }}>Loading user directory...</div>
      ) : (
        <UserTable users={users} onRoleChange={handleRoleChange} currentUserId={currentUser?.id} />
      )}
    </div>
  );
}
