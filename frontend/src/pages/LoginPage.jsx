import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { ArrowRight, Mail, Lock, Eye, EyeOff, Activity, Zap, Sparkles } from 'lucide-react';
import loginIllustration from '../assets/login_illustration.png';
import logoImg from '../assets/Logo.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPassFocused, setIsPassFocused] = useState(false);

  const { login, isLoading, error } = useAuthStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password', 'error');
      return;
    }
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
      width: '100vw',
      backgroundColor: '#F4F7F6',
      display: 'flex',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#0F172A',
      overflow: 'hidden'
    }}>
      
      {/* LEFT PANEL - Human-Crafted Unified Login Card */}
      <div style={{
        flex: '1 1 45%',
        minWidth: '420px',
        backgroundColor: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px',
        boxSizing: 'border-box',
        position: 'relative',
        boxShadow: '8px 0 30px rgba(0, 0, 0, 0.06)',
        zIndex: 2
      }}>
        {/* Main Unified Form Card */}
        <div style={{
          maxWidth: '420px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 20px 50px -12px rgba(15, 23, 42, 0.09), 0 1px 3px rgba(0, 0, 0, 0.04)',
          padding: '40px 36px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          {/* Top Emerald Gradient Highlight */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
          }} />

          {/* Logo & Header Section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
            <img
              src={logoImg}
              alt="ProgressHub Logo"
              style={{
                height: '72px',
                width: 'auto',
                maxHeight: '72px',
                objectFit: 'contain'
              }}
            />
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '900',
                color: '#0F172A',
                margin: '0 0 6px 0',
                letterSpacing: '-0.035em',
                lineHeight: 1.15
              }}>
                Sign in to workspace
              </h1>
              <p style={{
                fontSize: '0.9375rem',
                color: '#64748B',
                margin: 0,
                fontWeight: '400',
                lineHeight: 1.4
              }}>
                Welcome back! Enter your details to continue.
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div style={{
              padding: '14px 18px',
              backgroundColor: '#FEF2F2',
              border: '1.5px solid #FCA5A5',
              color: '#B91C1C',
              borderRadius: '14px',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Email Address */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F172A' }}>
                Email address
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  zIndex: 2,
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isEmailFocused ? '#10B981' : '#94A3B8',
                  transition: 'color 0.2s ease'
                }}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  placeholder="you@company.com"
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 46px',
                    borderRadius: '14px',
                    border: isEmailFocused ? '2px solid #10B981' : '1.5px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    fontSize: '0.9375rem',
                    color: '#0F172A',
                    outline: 'none',
                    boxShadow: isEmailFocused ? '0 0 0 4px rgba(16, 185, 129, 0.15)' : '0 1px 2px rgba(0, 0, 0, 0.03)',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F172A' }}>
                Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  zIndex: 2,
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isPassFocused ? '#10B981' : '#94A3B8',
                  transition: 'color 0.2s ease'
                }}>
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPassFocused(true)}
                  onBlur={() => setIsPassFocused(false)}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '14px 46px 14px 46px',
                    borderRadius: '14px',
                    border: isPassFocused ? '2px solid #10B981' : '1.5px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    fontSize: '0.9375rem',
                    color: '#0F172A',
                    outline: 'none',
                    boxShadow: isPassFocused ? '0 0 0 4px rgba(16, 185, 129, 0.15)' : '0 1px 2px rgba(0, 0, 0, 0.03)',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    zIndex: 2,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#475569', fontWeight: '500', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#10B981',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => addToast('Reset password link sent to your email!', 'info')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#059669',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  padding: 0
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Primary Sign In CTA Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px 24px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '14px',
                fontSize: '1.0625rem',
                fontWeight: '800',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 10px 24px -4px rgba(16, 185, 129, 0.35)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                marginTop: '6px',
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 14px 28px -4px rgba(16, 185, 129, 0.45)';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 24px -4px rgba(16, 185, 129, 0.35)';
                }
              }}
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight size={20} style={{ strokeWidth: 2.5 }} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT PANEL - Deep Rich Emerald Hero Canvas */}
      <div style={{
        flex: '1 1 55%',
        background: `
          radial-gradient(circle at 20% 20%, rgba(52, 211, 153, 0.25) 0%, transparent 45%),
          radial-gradient(circle at 80% 80%, rgba(14, 165, 233, 0.2) 0%, transparent 45%),
          linear-gradient(135deg, #022C22 0%, #064E3B 50%, #0F172A 100%)
        `,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '56px 64px',
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        {/* Ambient Glowing Light Blur */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          backgroundColor: 'rgba(52, 211, 153, 0.15)',
          filter: 'blur(90px)',
          pointerEvents: 'none'
        }} />

        {/* Center Content Container */}
        <div style={{
          maxWidth: '540px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '32px',
          position: 'relative',
          zIndex: 3
        }}>
          
          {/* Main Headline */}
          <h2 style={{
            fontSize: '3.25rem',
            fontWeight: '900',
            color: '#FFFFFF',
            letterSpacing: '-0.035em',
            margin: 0,
            lineHeight: 1.15
          }}>
            Better Teams.<br />
            Build <span style={{
              background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Brighter
            </span>{' '}
            <span style={{
              background: 'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Tomorrows.
            </span>
          </h2>

          {/* Floating Premium Illustration Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '24px 32px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <img
              src={loginIllustration}
              alt="Team Weekly Reporting & Productivity"
              style={{
                width: '100%',
                maxHeight: '340px',
                objectFit: 'contain'
              }}
            />
          </div>

        </div>

      </div>

    </div>
  );
}
