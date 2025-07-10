import { useCallback, useState } from 'react';

interface ChatHistoryProps {
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  chats: Array<{
    id: string;
    title: string;
    lastUpdated: number;
  }>;
  onRenameChat: (chatId: string, newTitle: string) => void;
}

export const ChatHistory = ({
  currentChatId,
  onSelectChat,
  onNewChat,
  chats,
  onRenameChat,
}: ChatHistoryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

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
              onClick={() => {
                if (editingId !== chat.id) onSelectChat(chat.id);
              }}
            >
              <div className="chat-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {editingId === chat.id ? (
                  <input
                    type="text"
                    value={editValue}
                    autoFocus
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={() => {
                      if (editValue.trim() && editValue !== chat.title) {
                        onRenameChat(chat.id, editValue.trim());
                      }
                      setEditingId(null);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        (e.target as HTMLInputElement).blur();
                      } else if (e.key === 'Escape') {
                        setEditingId(null);
                        setEditValue(chat.title);
                      }
                    }}
                    style={{ flex: 1, minWidth: 0 }}
                  />
                ) : (
                  <>
                    <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chat.title}</span>
                    <button
                      className="edit-chat-title"
                      title="Rename chat"
                      onClick={e => {
                        e.stopPropagation();
                        setEditingId(chat.id);
                        setEditValue(chat.title);
                      }}
                      style={{ marginLeft: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                    >
                      ✏️
                    </button>
                  </>
                )}
              </div>
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
