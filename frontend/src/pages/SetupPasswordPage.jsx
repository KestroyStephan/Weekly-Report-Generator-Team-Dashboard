import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/authApi';
import logoImg from '../assets/Logo.png';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SetupPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await authApi.setupPassword({ email, token, password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to setup password. Link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #022C22 0%, #064E3B 40%, #0F172A 100%)',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Ambient Glow Accents */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13,138,106,0.3) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,78,59,0.4) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none'
      }} />

      {/* Elevated White Card Container */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '460px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '40px 36px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box'
      }}>
        {/* Centered Large Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px', width: '100%' }}>
          <img
            src={logoImg}
            alt="WorkPulse Logo"
            style={{
              height: '72px',
              width: 'auto',
              marginBottom: '20px',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto 20px auto'
            }}
          />
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: '800',
            color: '#0F172A',
            letterSpacing: '-0.03em',
            margin: '0 0 8px 0'
          }}>
            Setup Your Password
          </h1>
          <p style={{
            fontSize: '0.9375rem',
            color: '#64748B',
            margin: 0,
            lineHeight: '1.5'
          }}>
            Create credentials for <strong style={{ color: '#0F2942' }}>{email || 'your account'}</strong> to log into WorkPulse.
          </p>
        </div>

        {success ? (
          <div style={{
            width: '100%',
            padding: '28px 24px',
            backgroundColor: '#F0FDF4',
            border: '1.5px solid #86EFAC',
            borderRadius: '18px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            boxSizing: 'border-box'
          }}>
            <CheckCircle2 size={48} color="#16A34A" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#14532D', margin: 0 }}>
              Password Set Successfully!
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#166534', margin: 0 }}>
              Your account password has been saved. Redirecting to login page...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 16px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '14px',
                color: '#991B1B',
                fontSize: '0.875rem'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* New Password Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#334155' }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  style={{
                    width: '100%',
                    padding: '14px 46px 14px 48px',
                    borderRadius: '14px',
                    border: '1.5px solid #E2E8F0',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    backgroundColor: '#F8FAFC',
                    color: '#0F172A',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0D8A6A';
                    e.target.style.backgroundColor = '#FFFFFF';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E2E8F0';
                    e.target.style.backgroundColor = '#F8FAFC';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94A3B8',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#334155' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  style={{
                    width: '100%',
                    padding: '14px 46px 14px 48px',
                    borderRadius: '14px',
                    border: '1.5px solid #E2E8F0',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    backgroundColor: '#F8FAFC',
                    color: '#0F172A',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0D8A6A';
                    e.target.style.backgroundColor = '#FFFFFF';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E2E8F0';
                    e.target.style.backgroundColor = '#F8FAFC';
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                border: 'none',
                backgroundColor: '#0D8A6A',
                color: '#FFFFFF',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 6px 20px rgba(13, 138, 106, 0.3)',
                marginTop: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#0B7A5D')}
              onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#0D8A6A')}
            >
              <span>{loading ? 'Setting Password...' : 'Save Password & Continue'}</span>
              <ArrowRight size={20} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
