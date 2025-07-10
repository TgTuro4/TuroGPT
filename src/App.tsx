import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Chat } from './components/chat/Chat';
import { ApiKeyLogin } from './components/ui/ApiKeyLogin';
import { getApiKey, setApiKey } from './services/api';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getApiKey());
  
  // Initialize theme based on user preference or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const handleApiKeySubmit = (apiKey: string) => {
    setApiKey(apiKey);
    setIsAuthenticated(true);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="app">
        <ApiKeyLogin onApiKeySubmit={handleApiKeySubmit} onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Chat onLogout={handleLogout} />} />
          <Route path="/chat/:chatId" element={<Chat onLogout={handleLogout} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
