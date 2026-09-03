import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import {
  Sparkles,
  LogIn,
  Mail,
  Lock,
  BarChart3,
  CheckCircle2,
  Bot,
  ShieldCheck,
  ChevronRight,
  Zap
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      addToast(err.message || 'Invalid email or password', 'error');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#090D16',
      backgroundImage: `
        radial-gradient(circle at 15% 20%, rgba(79, 70, 229, 0.18) 0%, transparent 45%),
        radial-gradient(circle at 85% 80%, rgba(14, 165, 233, 0.15) 0%, transparent 45%)
      `,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'var(--font-family-body)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Container Box */}
      <div style={{
        width: '100%',
        maxWidth: '1060px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        overflow: 'hidden',
        minHeight: '620px'
      }}>

        {/* Left Panel - Brand Showcase */}
        <div style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #4338CA 100%)',
          padding: '48px 40px',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Ambient Glow Orbs */}
          <div style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            backgroundColor: 'rgba(129, 140, 248, 0.25)',
            filter: 'blur(50px)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-40px',
            left: '-40px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: 'rgba(14, 165, 233, 0.2)',
            filter: 'blur(45px)',
            pointerEvents: 'none'
          }} />

          {/* Top Brand Header */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', backgroundColor: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)', marginBottom: '24px' }}>
              <Zap size={14} style={{ color: '#FDE047' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#E0E7FF' }}>Enterprise Team Intelligence</span>
            </div>

            <h2 style={{ fontSize: '2.125rem', fontWeight: '800', lineHeight: 1.25, fontFamily: 'var(--font-family-heading)', marginBottom: '16px', color: '#FFFFFF' }}>
              Weekly Report Generator & Team Dashboard
            </h2>
            <p style={{ fontSize: '0.9375rem', color: '#C7D2FE', lineHeight: 1.6, maxWidth: '420px' }}>
              Streamline weekly engineering updates, manager correction workflows, and executive AI summary insights.
            </p>
          </div>

          {/* Feature Bullets Showcase */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '16px', margin: '32px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', flexShrink: 0 }}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#FFFFFF' }}>Correction & Approval Workflows</h4>
                <p style={{ fontSize: '0.75rem', color: '#A5B4FC' }}>Snapshot version history with inline reviewer comments</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', flexShrink: 0 }}>
                <BarChart3 size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#FFFFFF' }}>Executive Recharts Dashboard</h4>
                <p style={{ fontSize: '0.75rem', color: '#A5B4FC' }}>Completed tasks trend, member workload & time breakdown</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', flexShrink: 0 }}>
                <Bot size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#FFFFFF' }}>AI Manager Assistant Engine</h4>
                <p style={{ fontSize: '0.75rem', color: '#A5B4FC' }}>Query blockers, achievements & team updates via Ollama / Grok API</p>
              </div>
            </div>
          </div>

          {/* Bottom Security Footer */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#818CF8' }}>
            <ShieldCheck size={16} />
            <span>Enterprise Security • Role-Based Access Control (RBAC)</span>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div style={{
          padding: '48px 44px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '28px',
          backgroundColor: '#FFFFFF'
        }}>
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)'
              }}>
                <Sparkles size={24} />
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', fontFamily: 'var(--font-family-heading)' }}>
                Sign In
              </h1>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
              Welcome back! Please enter your workspace credentials to continue.
            </p>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', backgroundColor: '#FEF2F2', border: '1.5px solid #FCA5A5', color: '#B91C1C', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '500' }}>
              {error}
            </div>
          )}

          {/* Main Login Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
            />
            <Input
              label="Password"
              type="password"
              icon={Lock}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={LogIn}
              isLoading={isLoading}
              style={{
                marginTop: '8px',
                width: '100%',
                borderRadius: '12px',
                fontWeight: '700',
                padding: '14px 24px'
              }}
            >
              Sign In to Workspace
            </Button>
          </form>

          {/* Registration link */}
          <div style={{ paddingTop: '16px', borderTop: '1px solid #E2E8F0', textAlign: 'center', fontSize: '0.875rem', color: '#64748B' }}>
            Don't have a workspace account?{' '}
            <Link to="/register" style={{ fontWeight: '700', color: '#4F46E5', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              Register Here <ChevronRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
