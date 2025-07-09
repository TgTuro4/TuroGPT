import { useState, useEffect } from 'react';
import { Chat } from './components/chat/Chat';
import { ApiKeyLogin } from './components/ui/ApiKeyLogin';
import { getApiKey, setApiKey } from './services/api';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Initialize theme based on user preference or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
    
    // Check if API key exists
    const apiKey = getApiKey();
    if (apiKey) {
      setIsAuthenticated(true);
    }
  }, []);
  
  const handleApiKeySubmit = (apiKey: string) => {
    setApiKey(apiKey);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return isAuthenticated ? <Chat onLogout={handleLogout} /> : <ApiKeyLogin onApiKeySubmit={handleApiKeySubmit} />;
}

export default App
