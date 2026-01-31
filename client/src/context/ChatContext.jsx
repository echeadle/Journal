import React, { createContext, useContext, useState } from 'react';
import { sendChatMessage } from '../services/chatService';
import storageService from '../services/storageService';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState(() => {
    return storageService.getChatHistory();
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (text, journalContext = null) => {
    setIsLoading(true);
    setError(null);

    // Add user message
    const userMessage = {
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMessage]);
    storageService.addChatMessage(userMessage);

    try {
      const response = await sendChatMessage(text, journalContext);

      // Add assistant message
      const assistantMessage = {
        role: 'assistant',
        content: response.response
      };

      setMessages(prev => [...prev, assistantMessage]);
      storageService.addChatMessage(assistantMessage);

      setIsLoading(false);
      return assistantMessage;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  const clearMessages = () => {
    setMessages([]);
    storageService.clearChatHistory();
  };

  const value = {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;
