import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useJournal } from '../../context/JournalContext';
import Button from '../common/Button';
import './ChatWindow.css';

const ChatWindow = ({ onClose }) => {
  const { messages, isLoading, error, sendMessage } = useChat();
  const { getCompletionStats } = useJournal();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const messageText = input.trim();
    setInput('');

    // Get journal context
    const stats = getCompletionStats();
    const journalContext = stats ? {
      currentDay: stats.completedDays,
      totalDays: stats.totalDays,
      completionPercentage: stats.completionPercentage,
      completedCheckIns: [],
      pendingCheckIns: []
    } : null;

    try {
      await sendMessage(messageText, journalContext);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const suggestedQuestions = [
    "What should I track in my journal?",
    "How do I use the mood selector?",
    "Did I miss any check-ins today?",
    "What's the purpose of tracking energy?"
  ];

  const handleSuggestionClick = (question) => {
    setInput(question);
  };

  return (
    <div className="chat-window">
      <div className="chat-window__header">
        <div>
          <h3 className="chat-window__title">Health Journal Assistant</h3>
          <p className="chat-window__subtitle">Ask me anything about your journal</p>
        </div>
        <button
          className="chat-window__close"
          onClick={onClose}
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>

      <div className="chat-window__messages">
        {messages.length === 0 && (
          <div className="chat-welcome">
            <div className="chat-welcome__icon">👋</div>
            <h4 className="chat-welcome__title">Hi there!</h4>
            <p className="chat-welcome__text">
              I'm here to help you with your health journal. Ask me anything!
            </p>
            <div className="chat-suggestions">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  className="chat-suggestion"
                  onClick={() => handleSuggestionClick(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message chat-message--${message.role}`}
          >
            <div className="chat-message__avatar">
              {message.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="chat-message__content">
              <div className="chat-message__text">{message.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chat-message chat-message--assistant">
            <div className="chat-message__avatar">🤖</div>
            <div className="chat-message__content">
              <div className="chat-typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="chat-error">
            <span className="chat-error__icon">⚠️</span>
            <span className="chat-error__text">{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chat-window__input" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <Button
          type="submit"
          variant="primary"
          disabled={!input.trim() || isLoading}
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;
