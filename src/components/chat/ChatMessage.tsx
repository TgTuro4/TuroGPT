import type { ChatMessage as ChatMessageType } from '../../types/chat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import './ChatMessage.css';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  return (
    <div className={`chat-message ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-bubble">
        <div className="message-content">
          {message.fileData ? (
            message.fileType?.startsWith('image/') ? (
              <img src={message.fileData} alt={message.fileName} className="uploaded-image" />
            ) : (
              <a href={message.fileData} download={message.fileName} className="file-download-link">
                {message.fileName}
              </a>
            )
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};
