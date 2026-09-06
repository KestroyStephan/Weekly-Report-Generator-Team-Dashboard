import React, { useState, useEffect } from 'react';
import { Bot, User, Volume2, VolumeX, Radio } from 'lucide-react';

export default function ChatMessage({ message, autoPlay = false }) {
  const isAssistant = message.role === 'assistant';
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // If autoPlay is enabled for new assistant messages, read aloud automatically
    if (isAssistant && autoPlay && 'speechSynthesis' in window) {
      speakText();
    }
    return () => {
      if (isSpeaking && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = () => {
    if (!('speechSynthesis' in window)) {
      alert("Voice synthesis is not supported in your browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Stop any existing speech synthesis
    window.speechSynthesis.cancel();

    // Format text for natural speaking (strip markdown indicators)
    const formattedText = message.text
      .replace(/\*\*/g, '')
      .replace(/#/g, '')
      .replace(/[-•]\s+/g, '. ')
      .replace(/\n+/g, '. ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(formattedText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

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
        backgroundColor: isAssistant ? '#0D8A6A' : '#E2E8F0',
        color: isAssistant ? '#FFFFFF' : 'var(--color-text-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: isAssistant ? '0 2px 6px rgba(13, 138, 106, 0.25)' : 'none'
      }}>
        {isAssistant ? <Bot size={16} /> : <User size={16} />}
      </div>

      <div style={{
        maxWidth: '82%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isAssistant ? 'flex-start' : 'flex-end',
        gap: '4px'
      }}>
        <div style={{
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          backgroundColor: isAssistant ? '#FFFFFF' : '#0D8A6A',
          color: isAssistant ? 'var(--color-text-primary)' : '#FFFFFF',
          border: isAssistant ? '1px solid var(--color-card-border)' : 'none',
          boxShadow: isAssistant ? '0 1px 3px rgba(0,0,0,0.04)' : 'none',
          whiteSpace: 'pre-wrap',
          position: 'relative'
        }}>
          {message.text}
        </div>

        {/* Voice Assistance Bar for Assistant summaries */}
        {isAssistant && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <button
              type="button"
              onClick={speakText}
              title={isSpeaking ? "Stop reading summary" : "Read summary aloud"}
              style={{
                background: isSpeaking ? '#FEF2F2' : '#F0FDF4',
                border: `1px solid ${isSpeaking ? '#FCA5A5' : '#BBF7D0'}`,
                color: isSpeaking ? '#DC2626' : '#059669',
                borderRadius: '12px',
                padding: '3px 8px',
                fontSize: '0.75rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {isSpeaking ? (
                <>
                  <VolumeX size={13} />
                  <span>Stop Voice</span>
                  <Radio size={12} className="animate-pulse" style={{ color: '#DC2626' }} />
                </>
              ) : (
                <>
                  <Volume2 size={13} />
                  <span>Listen Summary</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

