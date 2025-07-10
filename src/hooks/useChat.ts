import { useState, useCallback, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types/chat';
import { fetchChatCompletion } from '../services/api';
import { generateId } from '../utils/helpers';
import { saveChat, updateChat, getChats, getChat, deleteChat } from '../services/chatStorage';

interface UseChatProps {
  initialChatId?: string;
  onChatChange?: (chatId: string) => void;
}

export const useChat = ({ initialChatId, onChatChange }: UseChatProps = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(initialChatId || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiKey = localStorage.getItem('openai_api_key') || '';

  // Load chat if chatId is provided
  useEffect(() => {
    if (initialChatId && apiKey) {
      const chat = getChat(initialChatId, apiKey);
      if (chat) {
        setMessages(chat.messages);
        setCurrentChatId(initialChatId);
      }
    }
  }, [initialChatId, apiKey]);

  // Function to scroll to bottom of chat
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);



  // Send message to API and handle response
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !apiKey) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content,
      id: generateId(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    setError(null);

    try {
      // Save or update the chat with the user's message
      let chatId = currentChatId;
      if (chatId) {
        updateChat(chatId, updatedMessages, apiKey);
      } else {
        const newChatId = saveChat(updatedMessages, apiKey);
        setCurrentChatId(newChatId);
        if (onChatChange) onChatChange(newChatId);
        chatId = newChatId;
      }

      // Prepare messages for API call
      const apiMessages = updatedMessages.map(({ role, content }) => ({
        role,
        content,
      }));

      // Call API
      const response = await fetchChatCompletion(apiMessages);
      
      // Add assistant response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.choices[0].message.content,
        id: generateId(),
      };
      
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      
      // Update chat with assistant's response
      if (chatId) {
        updateChat(chatId, finalMessages, apiKey);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  }, [messages, apiKey, onChatChange, currentChatId]);

  // Get all chats from storage
  const getAllChats = useCallback(() => {
    if (!apiKey) return [];
    return getChats(apiKey);
  }, [apiKey]);

  // Load a specific chat
  const loadChat = useCallback((chatId: string) => {
    if (!apiKey) return;
    const chat = getChat(chatId, apiKey);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
      if (onChatChange) onChatChange(chatId);
    }
  }, [apiKey, onChatChange]);

  // Start a new chat session
  const startNewChat = useCallback(() => {
    setMessages([]);
    setCurrentChatId(null);
    if (onChatChange) onChatChange('');
  }, [onChatChange]);

  // Delete the current chat from history
  const deleteCurrentChat = useCallback(() => {
    if (currentChatId && apiKey) {
      deleteChat(currentChatId, apiKey);
    }
    setMessages([]);
    setCurrentChatId(null);
    setError(null);
  }, [currentChatId, apiKey]);


  // Upload a file as a message
  const uploadFile = useCallback((file: File) => {
    if (!apiKey) return;
    if (!file.type.startsWith('image/')) {
      setError('Only image files are supported.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const fileData = reader.result as string;
      const fileMessage: ChatMessage = {
        role: 'user',
        content: '',
        id: generateId(),
        fileData,
        fileName: file.name,
        fileType: file.type,
      };
      const updatedMessages = [...messages, fileMessage];
      setMessages(updatedMessages);
      let chatId = currentChatId;
      if (chatId) {
        updateChat(chatId, updatedMessages, apiKey);
      } else {
        chatId = saveChat(updatedMessages, apiKey);
        setCurrentChatId(chatId);
        if (onChatChange) onChatChange(chatId);
      }

      // Send image message to API
      setIsLoading(true);
      setError(null);
      try {
        const apiMessages = updatedMessages.map((msg) => ({
          role: msg.role,
          content: msg.fileData
            ? `![${msg.fileName}](${msg.fileData})`
            : msg.content,
        }));
        const response = await fetchChatCompletion(apiMessages.map(({ role, content }) => ({ role, content } as any)));
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.choices[0].message.content,
          id: generateId(),
        };
        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);
        if (chatId) {
          updateChat(chatId, finalMessages, apiKey);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error sending image message:', err);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }, [apiKey, messages, currentChatId, onChatChange]);

  return {
    messages,
    currentChatId,
    isLoading,
    error,
    sendMessage,
    uploadFile,
    getAllChats,
    loadChat,
    startNewChat,
    deleteCurrentChat,
    messagesEndRef,
  };
};
