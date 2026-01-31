import React from 'react';
import './FloatingChatButton.css';

const FloatingChatButton = ({ onClick, hasUnread = false }) => {
  return (
    <button
      className="floating-chat-button"
      onClick={onClick}
      aria-label="Open chat assistant"
    >
      <span className="floating-chat-button__icon">💬</span>
      {hasUnread && <span className="floating-chat-button__badge" />}
    </button>
  );
};

export default FloatingChatButton;
