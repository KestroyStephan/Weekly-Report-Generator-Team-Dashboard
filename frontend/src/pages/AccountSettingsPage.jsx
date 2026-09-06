import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ConfirmModal from '../components/common/ConfirmModal';
import { User, Shield, Lock, Save, RefreshCw } from 'lucide-react';

export default function AccountSettingsPage() {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast("Account profile settings saved successfully!", "success");
    }, 400);
  };

  const handleDiscard = () => {
    setName(user?.name || '');
    setCurrentPassword('');
    setNewPassword('');
    setShowDiscardConfirm(false);
    addToast("Changes discarded", "info");
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '32px',
        borderRadius: '20px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #F1F5F9', paddingBottom: '16px' }}>
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
            <User size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F2942', margin: 0 }}>Account Settings</h2>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>Manage your profile credentials and security preferences</p>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email Address (Corporate Login)" value={email} disabled />

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
            <Badge variant="indigo">{user?.role ? user.role.toUpperCase() : 'MEMBER'}</Badge>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '4px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
            <Input
              type="password"
              label="New Password"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
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
