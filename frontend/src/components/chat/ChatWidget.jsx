import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { aiApi } from '../../api/aiApi';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am your ProgressHub Assistant. Ask me anything about team weekly reports, key achievements, or blockers! You can also listen to summary responses using voice assistance.'
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
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Failed to initialize Speech Recognition:', e);
      setIsListening(false);
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userQuestion = input.trim();
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
          title="Open ProgressHub Voice Assistant"
        >
          <Bot size={26} />
        </button>
      )}

      {isOpen && (
        <div style={{
          width: '390px',
          height: '530px',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} style={{ color: '#34D399' }} />
              <div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>ProgressHub Assistant</h4>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Auto Voice Mode Toggle */}
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
                <span>Ollama AI is generating team summary...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

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
              placeholder={isListening ? "Listening... Speak now..." : "Ask about team progress or blockers..."}
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

            {/* Mic Dictation Button */}
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

            {/* Send Button */}
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

