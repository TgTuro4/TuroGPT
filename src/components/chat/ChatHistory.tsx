import { useCallback, useEffect, useState } from 'react';

interface ChatHistoryProps {
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  chats: Array<{
    id: string;
    title: string;
    lastUpdated: number;
  }>;
}

export const ChatHistory = ({
  currentChatId,
  onSelectChat,
  onNewChat,
  chats,
}: ChatHistoryProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  // Sort chats by lastUpdated (newest first)
  const sortedChats = [...chats].sort((a, b) => b.lastUpdated - a.lastUpdated);

  return (
    <div className={`chat-history ${isOpen ? 'open' : ''}`}>
      <button className="toggle-sidebar" onClick={toggleSidebar}>
        {isOpen ? '×' : '☰'}
      </button>
      
      <div className="chat-history-content">
        <button className="new-chat-button" onClick={onNewChat}>
          + New Chat
        </button>
        
        <div className="chat-list">
          {sortedChats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="chat-title">{chat.title}</div>
              <div className="chat-date">
                {new Date(chat.lastUpdated).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
