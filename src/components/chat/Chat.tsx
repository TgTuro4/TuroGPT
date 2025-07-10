import { useCallback, useState, useMemo } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage as ChatMessageComponent } from './ChatMessage';
import { ChatHistory } from './ChatHistory';
import { useChat } from '../../hooks/useChat';
import { useNavigate, useParams } from 'react-router-dom';
import { clearApiKey } from '../../services/api';
import './Chat.css';

/**
 * Main chat interface component.
 * Manages chat history, message display, and user input.
 * @param {object} props - Component props.
 * @param {() => void} [props.onLogout] - Optional callback to handle user logout.
 */
interface ChatProps {
  onLogout?: () => void;
}

export const Chat = ({ onLogout }: ChatProps = {}) => {
  const { chatId } = useParams<{ chatId?: string }>();
  const navigate = useNavigate();
  // State to force-refresh the chat list when a title is renamed.
  const [chatListVersion, setChatListVersion] = useState(0);

  const {
    messages,
    currentChatId,
    isLoading,
    error,
    sendMessage,
    startNewChat,
    deleteCurrentChat,
    getAllChats,
    loadChat,
    messagesEndRef,
    uploadFile,
  } = useChat({
    initialChatId: chatId,
    onChatChange: (newChatId) => {
      // If the chat ID changes, navigate to the new URL.
      if (newChatId !== chatId) {
        navigate(`/chat/${newChatId}`, { replace: true });
      }
      // If a new chat is created (i.e., there was no previous chatId),
      // increment the version to force a re-render of the chat list.
      if (!chatId && newChatId) {
        setChatListVersion((v) => v + 1);
      }
    },
  });

  // Get all chats for the sidebar
  // Memoize chat list fetching to avoid re-fetching on every render.
  const chats = useMemo(() => getAllChats(), [getAllChats, chatListVersion]);

  // Handle new chat
  const handleNewChat = useCallback(() => {
    startNewChat();
    navigate('/');
  }, [startNewChat, navigate]);

  // Handle chat selection
  const handleSelectChat = useCallback((chatId: string) => {
    loadChat(chatId);
  }, [loadChat]);

  // Handle chat renaming
  const handleRenameChat = useCallback(
    (chatId: string, newTitle: string) => {
      // Update in storage
      const apiKey = localStorage.getItem('openai_api_key') || '';
      if (!apiKey) return;
      // Dynamically import to avoid circular dep
      import('../../services/chatStorage').then(({ updateChatTitle }) => {
        updateChatTitle(chatId, newTitle, apiKey);
        // Force a re-render to update the chat list
        setChatListVersion((v) => v + 1);
      });
    },
    []
  );

  // Handle chat deletion
  const handleDeleteChat = useCallback(() => {
    deleteCurrentChat();
    setChatListVersion((v) => v + 1);
    navigate('/');
  }, [deleteCurrentChat, navigate]);

  return (
    <div className="chat-page">
      <ChatHistory
        currentChatId={currentChatId}
        chats={chats}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onRenameChat={handleRenameChat}
      />
      
      <div className="chat-container">
        <div className="chat-header">
          <h1>TuroGPT</h1>
          <div className="header-actions">
            {messages.length > 0 && (
              <button 
                onClick={handleDeleteChat} 
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
          </div>
        </div>
        
        <div className="messages-container">
          {messages.map((message) => (
            <ChatMessageComponent key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
          {isLoading && (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
        </div>
        
        <div className="input-container">
          <ChatInput onSend={sendMessage} onFileUpload={uploadFile} disabled={isLoading} />
          
        </div>
      </div>
    </div>
  );
};

export default Chat;
