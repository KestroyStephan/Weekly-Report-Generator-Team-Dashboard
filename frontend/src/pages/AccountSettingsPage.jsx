import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ConfirmModal from '../components/common/ConfirmModal';
import { User, Shield, Lock, Save, KeyRound } from 'lucide-react';

export default function AccountSettingsPage() {
  const { user, updateProfile } = useAuthStore();
  const { addToast } = useUIStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AU';

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      addToast("New passwords do not match!", "error");
      return;
    }

    if (newPassword && !currentPassword) {
      addToast("Please enter your current password to set a new password.", "error");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        current_password: currentPassword || undefined,
        new_password: newPassword || undefined
      });
      addToast("Account profile settings updated successfully!", "success");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      addToast(err.message || "Failed to update profile settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowDiscardConfirm(false);
    addToast("Changes discarded", "info");
  };

  return (
    <div style={{
      width: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '24px',
      alignItems: 'start'
    }}>

      {/* Left Column: Profile Summary & Security Tips */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Profile Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '28px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '16px'
        }}>
          {/* Avatar */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#FFFFFF',
            fontSize: '1.875rem',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
          }}>
            {initials}
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F2942', margin: 0 }}>
              {user?.name || 'Admin User'}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '4px 0 0 0' }}>
              {user?.email || 'admin@demo.com'}
            </p>
          </div>

          <Badge variant="indigo" style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '700', padding: '6px 14px' }}>
            {user?.role ? user.role.toUpperCase() : 'ADMIN'} ROLE
          </Badge>
        </div>

        {/* Security Tips Card */}
        <div style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '20px',
          padding: '22px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0D8A6A' }}>
            <KeyRound size={20} />
            <h4 style={{ fontSize: '0.9375rem', fontWeight: '700', margin: 0, color: '#0F2942' }}>
              Security Best Practices
            </h4>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
            Ensure your password is at least 8 characters long, combining uppercase letters, numbers, and symbols to protect corporate weekly reports.
          </p>
        </div>

      </div>

      {/* Right Column: Account & Security Form */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '32px',
        borderRadius: '20px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #F1F5F9', paddingBottom: '18px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: '#ECFDF5',
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F2942', margin: 0 }}>Account Settings</h2>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>Manage your profile credentials and security preferences</p>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email Address (Corporate Login)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            backgroundColor: '#F8FAFC',
            borderRadius: '14px',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="#0D8A6A" />
              <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#334155' }}>Assigned RBAC Role:</span>
            </div>
            <Badge variant="indigo">{user?.role ? user.role.toUpperCase() : 'ADMIN'}</Badge>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '4px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} color="#0D8A6A" />
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0F2942', margin: 0 }}>Change Security Password</h3>
            </div>
            <Input
              type="password"
              label="Current Password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <Input
                type="password"
                label="New Password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                type="password"
                label="Confirm New Password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <Button type="button" variant="outline" onClick={() => setShowDiscardConfirm(true)}>
              Discard Changes
            </Button>
            <Button type="submit" variant="primary" icon={Save} isLoading={isSaving}>
              Save Profile Updates
            </Button>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={showDiscardConfirm}
        title="Discard Unsaved Edits?"
        message="Are you sure you want to discard your profile updates and reset the form?"
        type="warning"
        confirmText="Yes, Discard Edits"
        cancelText="Keep Editing"
        onConfirm={handleDiscard}
        onCancel={() => setShowDiscardConfirm(false)}
      />
    </div>
  );
}
