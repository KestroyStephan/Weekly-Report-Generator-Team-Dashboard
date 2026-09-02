import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Sparkles, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('manager@demo.com');
  const [password, setPassword] = useState('Password123');
  const { login, isLoading, error } = useAuthStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login({ email, password });
      addToast(`Welcome back, ${user.name}!`, 'success');
      if (user.role === 'manager' || user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/my-report');
      }
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
    }
  };

  const setDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password123');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-sidebar-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        padding: '36px 32px',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Sparkles size={26} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-primary)', fontFamily: 'var(--font-family-heading)' }}>
            Weekly Report Generator
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Sign in to access your dashboard & reports
          </p>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <Button type="submit" variant="primary" icon={LogIn} isLoading={isLoading} style={{ marginTop: '8px' }}>
            Sign In
          </Button>
        </form>

        {/* Demo Accounts Quick-Select */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--color-card-border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            One-Click Seed Demo Accounts:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setDemoAccount('manager@demo.com')} style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--color-card-border)', cursor: 'pointer' }}>
              Manager
            </button>
            <button onClick={() => setDemoAccount('member1@demo.com')} style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--color-card-border)', cursor: 'pointer' }}>
              Member 1
            </button>
            <button onClick={() => setDemoAccount('admin@demo.com')} style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--color-card-border)', cursor: 'pointer' }}>
              Admin
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: '600', color: 'var(--color-primary)' }}>Register</Link>
        </div>
      </div>
    </div>
  );
}
