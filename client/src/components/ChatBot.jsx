import { useState, useEffect, useRef } from 'react';
import './ChatBot.css';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const messagesEndRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Initialize chatbot session on first open
  useEffect(() => {
    if (isOpen && !sessionId) {
      initiateChatbot();
    }
  }, [isOpen]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initiateChatbot = async () => {
    try {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);

      const response = await fetch(`${API_URL}/chatbot/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: newSessionId })
      });

      const data = await response.json();
      setMessages([{ sender: 'bot', text: data.greeting }]);
      
      // Set initial quick replies
      setQuickReplies([
        { id: 1, text: '1️⃣ Sizing Services', value: 'sizing' },
        { id: 2, text: '2️⃣ Weaving Services', value: 'weaving' },
        { id: 3, text: '3️⃣ View Pricing', value: 'pricing' },
        { id: 4, text: '4️⃣ Help & FAQ', value: 'help' }
      ]);
    } catch (error) {
      console.error('Error initializing chatbot:', error);
    }
  };

  const handleQuickReply = (value) => {
    sendMessageToBot(value);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !sessionId) return;
    sendMessageToBot(inputValue.trim());
    setInputValue('');
  };

  const sendMessageToBot = async (userMessage) => {
    if (!userMessage || !sessionId) return;

    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setIsLoading(true);
    setQuickReplies([]); // Clear quick replies when user sends message

    try {
      const response = await fetch(`${API_URL}/chatbot/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: userMessage })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);

      // Set contextual quick replies based on conversation
      updateQuickReplies(userMessage, data.response);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg = 'Sorry, something went wrong. Please try again.';
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: errorMsg
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuickReplies = (userMsg, botResponse) => {
    const lowerMsg = userMsg.toLowerCase();
    const lowerRes = botResponse.toLowerCase();

    // Main menu - show initial menu options
    if (lowerMsg === 'main menu' || lowerMsg.includes('main menu')) {
      setQuickReplies([
        { id: 1, text: '1️⃣ Sizing Services', value: 'sizing' },
        { id: 2, text: '2️⃣ Weaving Services', value: 'weaving' },
        { id: 3, text: '3️⃣ View Pricing', value: 'pricing' },
        { id: 4, text: '4️⃣ Help & FAQ', value: 'help' },
        { id: 5, text: '🏠 Home Menu', value: 'main menu' }
      ]);
    } else if (lowerRes.includes('sizing') && lowerRes.includes('yarn')) {
      setQuickReplies([
        { id: 1, text: '1️⃣ Cotton Yarn', value: '10kg cotton yarn' },
        { id: 2, text: '2️⃣ Polyester Yarn', value: '10kg polyester yarn' },
        { id: 3, text: '3️⃣ Silk Yarn', value: '10kg silk yarn' },
        { id: 4, text: '4️⃣ Other Options', value: 'show all yarn types' },
        { id: 5, text: '🏠 Home Menu', value: 'main menu' }
      ]);
    } else if (lowerRes.includes('weaving') && lowerRes.includes('fabric')) {
      setQuickReplies([
        { id: 1, text: '1️⃣ Cotton Fabric', value: '50 metres cotton weaving' },
        { id: 2, text: '2️⃣ Silk Fabric', value: '50 metres silk weaving' },
        { id: 3, text: '3️⃣ Polyester Fabric', value: '50 metres polyester weaving' },
        { id: 4, text: '4️⃣ Other Fabrics', value: 'show all fabric types' },
        { id: 5, text: '🏠 Home Menu', value: 'main menu' }
      ]);
    } else if (lowerRes.includes('₹') || lowerRes.includes('total')) {
      setQuickReplies([
        { id: 1, text: '1️⃣ Book This', value: 'book' },
        { id: 2, text: '2️⃣ Different Quantity', value: 'change quantity' },
        { id: 3, text: '3️⃣ Other Service', value: 'show services' },
        { id: 4, text: '4️⃣ Ask Question', value: 'I have a question' },
        { id: 5, text: '🏠 Home Menu', value: 'main menu' }
      ]);
    } else if (lowerMsg === 'pricing' || lowerMsg === 'help') {
      setQuickReplies([
        { id: 1, text: '1️⃣ Delivery Info', value: 'delivery' },
        { id: 2, text: '2️⃣ Payment Methods', value: 'payment' },
        { id: 3, text: '3️⃣ Quality Standards', value: 'quality' },
        { id: 4, text: '4️⃣ Return Policy', value: 'returns' },
        { id: 5, text: '🏠 Home Menu', value: 'main menu' }
      ]);
    } else {
      setQuickReplies([
        { id: 1, text: '1️⃣ Sizing', value: 'sizing' },
        { id: 2, text: '2️⃣ Weaving', value: 'weaving' },
        { id: 3, text: '3️⃣ Pricing', value: 'pricing' },
        { id: 4, text: '4️⃣ Help', value: 'help' },
        { id: 5, text: '🏠 Home Menu', value: 'main menu' }
      ]);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chatbot Button */}
      <button
        className="chatbot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <div className="chat-icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
            {messages.length > 0 && (
              <span className="notification-badge">{messages.length}</span>
            )}
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="header-content">
              <div className="bot-avatar-large">🤖</div>
              <div>
                <h3>CS TEX Assistant</h3>
                <span className="status-badge">● Online</span>
              </div>
            </div>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.length === 0 ? (
              <div className="empty-state">
                <p>Loading chatbot...</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  {msg.sender === 'bot' && (
                    <div className="bot-avatar">🤖</div>
                  )}
                  <div className={`message-bubble ${msg.sender}`}>
                    {msg.text.split('\n').map((line, i) => (
                      <div key={i} className="message-line">
                        {line.includes('₹') ? (
                          <span className="price-highlight">{line}</span>
                        ) : line.match(/^[•✅📋📊💰]/i) ? (
                          <span className="emoji-line">{line}</span>
                        ) : (
                          line
                        )}
                      </div>
                    ))}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="user-avatar">👤</div>
                  )}
                </div>
              ))
            )}

            {/* Quick Reply Buttons */}
            {quickReplies.length > 0 && !isLoading && (
              <div className="quick-replies">
                <p className="quick-replies-label">Quick Options:</p>
                <div className="quick-replies-grid">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply.id}
                      className="quick-reply-btn"
                      onClick={() => handleQuickReply(reply.value)}
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {isLoading && (
              <div className="message bot">
                <div className="bot-avatar">🤖</div>
                <div className="message-bubble bot loading">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="chatbot-form">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message or use quick options..."
              disabled={isLoading}
              className="chat-input"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="send-btn"
              title="Send message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
