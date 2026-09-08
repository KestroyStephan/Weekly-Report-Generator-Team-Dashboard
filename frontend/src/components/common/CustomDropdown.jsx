import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, Check } from 'lucide-react';

export default function CustomDropdown({ value, onChange, options, labelPrefix = "Filter:" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOpt = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 18px',
          borderRadius: '14px',
          border: isOpen ? '1.5px solid #0D8A6A' : '1.5px solid #CBD5E1',
          backgroundColor: isOpen ? '#FFFFFF' : '#F8FAFC',
          color: '#0F2942',
          fontSize: '0.9375rem',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: isOpen ? '0 0 0 4px rgba(13, 138, 106, 0.12)' : '0 1px 2px rgba(0,0,0,0.03)',
          transition: 'all 0.2s ease',
          userSelect: 'none',
          whiteSpace: 'nowrap'
        }}
        onMouseOver={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderColor = '#94A3B8';
          }
        }}
        onMouseOut={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = '#F8FAFC';
            e.currentTarget.style.borderColor = '#CBD5E1';
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={17} color="#0D8A6A" style={{ strokeWidth: 2.2 }} />
          <span style={{ color: '#64748B', fontWeight: '500' }}>{labelPrefix}</span>
          <strong style={{ color: '#0F2942' }}>{selectedOpt?.label || 'Select'}</strong>
        </div>

        <ChevronDown
          size={16}
          color="#64748B"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}
        />
      </button>

      {/* Floating Filter Menu Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          minWidth: '220px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.16), 0 2px 6px rgba(0,0,0,0.04)',
          padding: '8px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {options.map((opt) => {
            const isSelectedOpt = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: isSelectedOpt ? '#ECFDF5' : 'transparent',
                  color: isSelectedOpt ? '#065F46' : '#334155',
                  fontSize: '0.875rem',
                  fontWeight: isSelectedOpt ? '700' : '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => {
                  if (!isSelectedOpt) e.currentTarget.style.backgroundColor = '#F8FAFC';
                }}
                onMouseOut={(e) => {
                  if (!isSelectedOpt) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>{opt.label}</span>
                {isSelectedOpt && <Check size={16} color="#0D8A6A" style={{ strokeWidth: 2.5 }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
