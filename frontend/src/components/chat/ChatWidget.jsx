import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Mic, MicOff, Volume2, VolumeX, MessageCircle } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { aiApi } from '../../api/aiApi';
import { useAuthStore } from '../../store/authStore';

const MEMBER_QUESTIONS = [
  "What's my report status?",
  "Summarize my week",
  "Which goals are behind?",
  "Show my blockers",
  "What needs correction?",
  "Show my recent reports",
  "Help improve my report"
];

const MANAGER_QUESTIONS = [
  "How is my team doing?",
  "What needs my attention?",
  "Show pending reports",
  "What are the biggest blockers?",
  "Which projects are at risk?",
  "Show team progress",
  "Summarize this week's reports",
  "Show workload by project"
];

export default function ChatWidget() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const isManager = user?.role === 'manager' || user?.role === 'admin';
  const roleSubtitle = isManager ? "Team insights & reporting assistant" : "Your personal ProgressHub assistant";
  const placeholderText = isManager ? "Ask about team progress, blockers, or workload..." : "Ask about your report, goals, or blockers...";
  const quickQuestions = isManager ? MANAGER_QUESTIONS : MEMBER_QUESTIONS;

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello! I am your ${isManager ? 'Team Analytics Assistant' : 'Personal ProgressHub Assistant'}. How can I help you today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoVoice, setAutoVoice] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Voice Dictation (Speech Recognition) Setup
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice dictation is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInput(transcript);
      };
      recognition.onerror = (err) => {
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleSend = async (e, textOverride = null) => {
    e?.preventDefault();
    const userQuestion = (textOverride || input).trim();
    
    if (!userQuestion || isLoading) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userQuestion }]);
    setIsLoading(true);

    try {
      const res = await aiApi.chat(userQuestion);
      setMessages((prev) => [...prev, { role: 'assistant', text: res.answer, autoPlay: autoVoice }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Sorry, I encountered an error connecting to the AI Assistant service.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '24px', zIndex: 1500 }}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: '#0D8A6A',
            color: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(13, 138, 106, 0.4), 0 2px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '2px solid #FFFFFF',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Open AI Assistant"
        >
          <Bot size={26} />
        </button>
      )}

      {isOpen && (
        <div style={{
          width: '390px',
          height: '560px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18)',
          border: '1px solid var(--color-card-border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Widget Header */}
          <div style={{
            padding: '12px 16px',
            background: 'linear-gradient(135deg, #022C22 0%, #064E3B 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '8px' }}>
                <Bot size={20} style={{ color: '#34D399' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>AI Assistant</h4>
                <div style={{ fontSize: '0.7rem', color: '#A7F3D0', opacity: 0.9 }}>{roleSubtitle}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setAutoVoice(!autoVoice)}
                title={autoVoice ? "Auto-speak incoming answers is ON" : "Turn ON Auto-speak summaries"}
                style={{
                  background: autoVoice ? 'rgba(52, 211, 153, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                  border: `1px solid ${autoVoice ? '#34D399' : 'rgba(255, 255, 255, 0.2)'}`,
                  color: autoVoice ? '#34D399' : '#E2E8F0',
                  borderRadius: '14px',
                  padding: '3px 8px',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                {autoVoice ? <Volume2 size={13} /> : <VolumeX size={13} />}
                <span>{autoVoice ? 'Auto Voice ON' : 'Voice Off'}</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{
            flexGrow: 1,
            padding: '14px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: '#FAFAFA'
          }}>
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} autoPlay={msg.autoPlay} />
            ))}
            {isLoading && (
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} className="animate-spin" style={{ color: '#0D8A6A' }} />
                <span>AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {!isLoading && messages.length < 3 && (
            <div style={{
              padding: '8px 12px',
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid var(--color-card-border)',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE/Edge
            }}>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={(e) => handleSend(e, q)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 10px',
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    borderRadius: '16px',
                    fontSize: '0.75rem',
                    color: '#334155',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.15s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#E2E8F0';
                    e.currentTarget.style.borderColor = '#CBD5E1';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#F1F5F9';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                  }}
                >
                  <MessageCircle size={12} style={{ color: '#0D8A6A' }} />
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Form with Voice Dictation */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '10px 12px',
              borderTop: '1px solid var(--color-card-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FFFFFF'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening... Speak now..." : placeholderText}
              style={{
                flexGrow: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${isListening ? '#0D8A6A' : 'var(--color-card-border)'}`,
                fontSize: '0.875rem',
                outline: 'none',
                backgroundColor: isListening ? '#F0FDF4' : '#FFFFFF'
              }}
            />

            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? "Stop voice dictation" : "Speak question using microphone"}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isListening ? '#FEF2F2' : '#F1F5F9',
                color: isListening ? '#DC2626' : '#475569',
                border: `1px solid ${isListening ? '#FCA5A5' : '#CBD5E1'}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#0D8A6A',
                color: '#FFFFFF',
                border: 'none',
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isLoading || !input.trim() ? 0.6 : 1
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

