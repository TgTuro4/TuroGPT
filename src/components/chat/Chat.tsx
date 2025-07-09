import { useChat } from '../../hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { clearApiKey } from '../../services/api';
import './Chat.css';

interface ChatProps {
  onLogout?: () => void;
}

export const Chat = ({ onLogout }: ChatProps = {}) => {
  const { messages, isLoading, error, sendMessage, clearChat, messagesEndRef } = useChat();

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>ChatGPT UI</h1>
        <div className="header-actions">
          {messages.length > 0 && (
            <button 
              onClick={clearChat} 
              className="clear-button" 
              aria-label="Clear chat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Clear
            </button>
          )}
          <button 
            onClick={() => {
              if (onLogout) {
                clearApiKey();
                onLogout();
              }
            }} 
            className="logout-button" 
            aria-label="Logout"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
          <ThemeToggle />
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <h2>Start a conversation</h2>
            <p>Type a message below to begin chatting with the AI assistant.</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        
        {isLoading && (
          <div className="loading-container">
            <LoadingSpinner />
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        {/* Invisible div for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
};

// Theme toggle component
const ThemeToggle = () => {
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle dark mode"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    </button>
  );
};
