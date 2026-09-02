import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { User, Shield } from 'lucide-react';

export default function AccountSettingsPage() {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');

  const handleSave = (e) => {
    e.preventDefault();
    addToast("Profile settings saved", "success");
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '24px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-card-border)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <User size={22} style={{ color: 'var(--color-primary)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>Account Settings</h2>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email Address" value={email} disabled />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-secondary)' }}>Current Role</span>
            <Badge variant="indigo">{user?.role}</Badge>
          </div>

          <Button type="submit" variant="primary" style={{ alignSelf: 'flex-start' }}>
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}
