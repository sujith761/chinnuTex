import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VoiceAssistant.css';

export default function VoiceAssistant() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const finalRef = useRef('');
  const holdTimerRef = useRef(null);
  const commandTimeoutRef = useRef(null);
  const [mode, setMode] = useState('tap'); // 'tap' or 'hold'

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = true;
    recog.lang = 'en-US';

    recog.onstart = () => {
      setIsListening(true);
      finalRef.current = '';
    };
    recog.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const txt = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalRef.current = (finalRef.current ? finalRef.current + ' ' : '') + txt;
          setTranscript((prev) => (prev ? prev + ' ' : '') + txt);
        } else {
          interim += txt;
        }
      }
    };
    recog.onerror = () => setIsListening(false);
    recog.onend = () => {
      setIsListening(false);
      // Debounce command processing to ensure we got complete final transcript
      if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
      commandTimeoutRef.current = setTimeout(() => {
        const finalText = finalRef.current.trim();
        if (finalText) handleCommand(finalText);
        finalRef.current = '';
        setTranscript('');
      }, 100);
    };
    recognitionRef.current = recog;
    return () => { 
      recog.onstart = null; 
      recog.onresult = null; 
      recog.onend = null;
      if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
    };
  }, []);

  const speak = (text) => {
    if (!voiceEnabled || !synthRef.current) return;
    try {
      synthRef.current.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 1;
      u.pitch = 1;
      synthRef.current.speak(u);
    } catch {}
  };

  const start = () => {
    if (recognitionRef.current && !isListening) {
      try { recognitionRef.current.start(); } catch {}
    }
  };
  const stop = () => {
    if (recognitionRef.current && isListening) {
      try { recognitionRef.current.stop(); } catch {}
    }
  };
  const toggle = () => {
    if (!recognitionRef.current) return;
    if (isListening) stop(); else start();
  };

  // Hold-to-talk handlers
  const handleHoldStart = (e) => {
    if (mode !== 'hold') return;
    e.preventDefault();
    clearTimeout(holdTimerRef.current);
    start();
  };
  const handleHoldEnd = (e) => {
    if (mode !== 'hold') return;
    e.preventDefault();
    clearTimeout(holdTimerRef.current);
    stop();
  };

  // Tap-to-toggle handler
  const handleTap = (e) => {
    if (mode !== 'tap') return;
    e.preventDefault();
    toggle();
  };

  const handleCommand = (raw) => {
    const q = raw.toLowerCase();

    // Navigation intents
    const go = (path, say) => { navigate(path); speak(say || 'Opening'); };

    if (/home|main( menu)?/.test(q)) return go('/', 'Going to home');
    if (/services?/.test(q) && !/sizing|weaving/.test(q)) return go('/services', 'Opening services');
    if (/sizing|size ing|yarn/.test(q)) return go('/products/sizing', 'Opening sizing');
    if (/weaving|fabric/.test(q)) return go('/products/weaving', 'Opening weaving');
    if (/products?/.test(q)) return go('/products', 'Opening products');
    if (/why|about cs|chinnu|why chinnu/.test(q)) return go('/why-chinnu-tex', 'Opening Why CS TEX');
    if (/savings?/.test(q)) return go('/why-chinnu-tex/savings', 'Opening savings');
    if (/sustain(ability)?/.test(q)) return go('/why-chinnu-tex/sustainability', 'Opening sustainability');
    if (/about/.test(q)) return go('/about', 'Opening about');
    if (/careers?/.test(q)) return go('/careers', 'Opening careers');
    if (/contact|support/.test(q)) return go('/contact', 'Opening contact');
    if (/login|sign in/.test(q)) return go('/login', 'Opening login');
    if (/register|sign up/.test(q)) return go('/register', 'Opening register');
    if (/forgot password/.test(q)) return go('/forgot-password', 'Opening password recovery');
    if (/my orders?/.test(q)) return go('/my-orders', 'Opening your orders');
    if (/booking|book now/.test(q)) return go('/booking', 'Opening booking');

    // Helper intents
    if (/help|what can you do|commands/.test(q)) {
      speak('You can say: Go home, open services, open sizing, open weaving, open products, contact, login, register, my orders, booking, savings, or sustainability.');
      return;
    }

    speak("Sorry, I didn't catch that. Try saying 'Open services' or 'Go home'.");
  };

  // Keyboard push-to-talk: Shift + Space
  useEffect(() => {
    const keydown = (e) => {
      if (e.shiftKey && e.code === 'Space') { e.preventDefault(); start(); }
    };
    const keyup = (e) => {
      if (e.code === 'Space') stop();
    };
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    return () => {
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
    };
  }, []);

  const SpeechRecognitionSupported = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

  return (
    <div className="voice-assistant-container" aria-live="polite">
      {!SpeechRecognitionSupported && (
        <div className="va-tooltip">Voice not supported in this browser</div>
      )}
      {SpeechRecognitionSupported && (
        <div className="va-tooltip">
          {mode === 'tap' ? 'Click to start/stop' : 'Hold Shift+Space or button to talk'}
        </div>
      )}
      <button
        className={`va-mic-btn ${isListening ? 'listening' : ''}`}
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
        onClick={handleTap}
        title={mode === 'tap' ? (isListening ? 'Click to stop' : 'Click to start') : 'Hold to talk'}
        aria-pressed={isListening}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
          <path d="M17 11v0c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.06 2.29 5.6 5.25 5.96V21h3.5v-4.04C16.71 16.6 19 14.06 19 11h-2z"/>
        </svg>
      </button>
      <button
        className={`va-mode-btn ${mode === 'hold' ? 'active' : ''}`}
        onClick={() => setMode(mode === 'tap' ? 'hold' : 'tap')}
        title={`Switch to ${mode === 'tap' ? 'hold-to-talk' : 'tap-to-toggle'} mode`}
      >
        {mode === 'tap' ? '👆' : '✋'}
      </button>
      <button
        className={`va-speaker-btn ${voiceEnabled ? 'enabled' : 'disabled'}`}
        onClick={() => setVoiceEnabled(!voiceEnabled)}
        title={voiceEnabled ? 'Voice replies enabled' : 'Voice replies disabled'}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M3 9v6h4l5 5V4L7 9H3z"/>
          <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
      </button>
    </div>
  );
}
