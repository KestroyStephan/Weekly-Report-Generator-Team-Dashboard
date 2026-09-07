import React from 'react';

export default function MotivationalQuoteCard() {
  return (
    <div style={{
      backgroundColor: '#ECFDF5',
      background: 'linear-gradient(135deg, #F0FDF4 0%, #E6F4ED 100%)',
      borderRadius: '20px',
      padding: '28px 24px',
      border: '1px solid #D1FAE5',
      boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      height: '100%',
      minHeight: '220px',
      gap: '16px'
    }}>

      {/* Stylized Plant SVG Illustration */}
      <div style={{
        width: '64px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <svg width="60" height="60" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Pot */}
          <path d="M22 42L25 56H39L42 42H22Z" fill="#94A3B8" />
          <path d="M20 38H44V42H20V38Z" fill="#CBD5E1" />
          
          {/* Stem & Leaves */}
          <path d="M32 38V22" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
          
          {/* Center Leaf */}
          <path d="M32 20C32 20 28 12 32 8C36 12 32 20 32 20Z" fill="#10B981" />
          
          {/* Left Leaf */}
          <path d="M32 28C32 28 22 24 20 18C26 18 32 28 32 28Z" fill="#059669" />
          
          {/* Right Leaf */}
          <path d="M32 28C32 28 42 24 44 18C38 18 32 28 32 28Z" fill="#10B981" />
          
          {/* Bottom Left Leaf */}
          <path d="M32 34C32 34 24 32 22 26C28 27 32 34 32 34Z" fill="#047857" />
          
          {/* Bottom Right Leaf */}
          <path d="M32 34C32 34 40 32 42 26C36 27 32 34 32 34Z" fill="#059669" />
        </svg>
      </div>

      <div style={{ maxWidth: '280px' }}>
        <p style={{
          fontSize: '1rem',
          fontWeight: '700',
          color: '#065F46',
          fontStyle: 'italic',
          lineHeight: '1.5',
          margin: 0
        }}>
          "Consistency today creates success tomorrow."
        </p>

        <div style={{
          width: '36px',
          height: '4px',
          backgroundColor: '#10B981',
          borderRadius: '2px',
          margin: '14px auto 0 auto'
        }} />
      </div>

    </div>
  );
}
