import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { JournalProvider } from './context/JournalContext';
import { ChatProvider } from './context/ChatContext';
import FloatingChatButton from './components/chatbot/FloatingChatButton';
import ChatWindow from './components/chatbot/ChatWindow';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import DailyCheckIn from './pages/DailyCheckIn';
import Review from './pages/Review';
import Export from './pages/Export';
import './styles/globals.css';

function App() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <Router>
      <JournalProvider>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checkin/:dayNumber" element={<DailyCheckIn />} />
            <Route path="/review" element={<Review />} />
            <Route path="/export" element={<Export />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <FloatingChatButton onClick={() => setChatOpen(!chatOpen)} />
          {chatOpen && <ChatWindow onClose={() => setChatOpen(false)} />}
        </ChatProvider>
      </JournalProvider>
    </Router>
  );
}

export default App;
