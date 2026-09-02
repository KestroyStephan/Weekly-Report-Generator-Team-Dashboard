import React from 'react';
import { Bot, User } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isAssistant = message.role === 'assistant';

  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-start',
      flexDirection: isAssistant ? 'row' : 'row-reverse'
    }}>
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        backgroundColor: isAssistant ? 'var(--color-primary-light)' : '#E2E8F0',
        color: isAssistant ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {isAssistant ? <Bot size={16} /> : <User size={16} />}
      </div>

      <div style={{
        maxWidth: '80%',
        padding: '10px 14px',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.875rem',
        lineHeight: '1.5',
        backgroundColor: isAssistant ? '#F8FAFC' : 'var(--color-primary)',
        color: isAssistant ? 'var(--color-text-primary)' : '#FFFFFF',
        border: isAssistant ? '1px solid var(--color-card-border)' : 'none',
        whiteSpace: 'pre-wrap'
      }}>
        {message.text}
      </div>
    </div>
  );
}
