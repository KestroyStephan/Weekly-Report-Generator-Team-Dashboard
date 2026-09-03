import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import { Sparkles, UserPlus, User, Mail, Lock, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const { register, isLoading, error } = useAuthStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ name, email, password, role });
      addToast('Account created successfully! Please sign in.', 'success');
      navigate('/login');
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#090D16',
      backgroundImage: `
        radial-gradient(circle at 85% 20%, rgba(79, 70, 229, 0.18) 0%, transparent 45%),
        radial-gradient(circle at 15% 80%, rgba(14, 165, 233, 0.15) 0%, transparent 45%)
      `,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'var(--font-family-body)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '40px 36px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)'
          }}>
            <Sparkles size={26} />
          </div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: '800', color: '#0F172A', fontFamily: 'var(--font-family-heading)' }}>
            Create Account
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
            Join your team's weekly reporting workspace
          </p>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', backgroundColor: '#FEF2F2', border: '1.5px solid #FCA5A5', color: '#B91C1C', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '500' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Full Name"
            icon={User}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
          />
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
          <Input
            label="Password"
            type="password"
            icon={Lock}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
          />
          <Select
            label="Account Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: 'member', label: 'Team Member (Submit reports)' },
              { value: 'manager', label: 'Engineering Manager (Review & Analytics)' }
            ]}
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={UserPlus}
            isLoading={isLoading}
            style={{ marginTop: '8px', width: '100%', borderRadius: '10px', fontWeight: '700' }}
          >
            Register Account
          </Button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748B' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: '700', color: '#4F46E5' }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
