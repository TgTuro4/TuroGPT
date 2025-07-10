import type { ChatMessage } from '../types/chat';

const CHAT_STORAGE_KEY = 'turogpt_chats';

type StoredChat = {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastUpdated: number;
  apiKeyHash: string; // Store a hash of the API key for security
};

// Simple hash function for API key (not cryptographically secure, but good enough for this use case)
const hashApiKey = (apiKey: string): string => {
  return btoa(apiKey.substring(0, 8) + apiKey.substring(apiKey.length - 4));
};

export const saveChat = (messages: ChatMessage[], apiKey: string): string => {
  const chats = getChats(apiKey);
  const chatTitle = messages[0]?.content.substring(0, 30) + (messages[0]?.content.length > 30 ? '...' : '') || 'New Chat';
  const chatId = Date.now().toString();
  const apiKeyHash = hashApiKey(apiKey);
  
  const newChat: StoredChat = {
    id: chatId,
    title: chatTitle,
    messages,
    lastUpdated: Date.now(),
    apiKeyHash,
  };

  const updatedChats = [...chats, newChat];
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedChats));
  
  return chatId;
};

export const updateChat = (chatId: string, messages: ChatMessage[], apiKey: string): void => {
  const chats = getChats(apiKey);
  const chatIndex = chats.findIndex((chat) => chat.id === chatId);
  
  if (chatIndex === -1) {
    saveChat(messages, apiKey);
    return;
  }
  
  const updatedChats = [...chats];
  updatedChats[chatIndex] = {
    ...updatedChats[chatIndex],
    messages,
    lastUpdated: Date.now(),
  };
  
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedChats));
};

export const getChats = (apiKey: string): StoredChat[] => {
  const storedChats = localStorage.getItem(CHAT_STORAGE_KEY);
  if (!storedChats) return [];
  
  const allChats: StoredChat[] = JSON.parse(storedChats);
  const apiKeyHash = hashApiKey(apiKey);
  
  // Only return chats that belong to this API key
  return allChats.filter((chat) => chat.apiKeyHash === apiKeyHash);
};

export const getChat = (chatId: string, apiKey: string): StoredChat | null => {
  const chats = getChats(apiKey);
  return chats.find((chat) => chat.id === chatId) || null;
};

export const deleteChat = (chatId: string, apiKey: string): void => {
  const chats = getChats(apiKey);
  const updatedChats = chats.filter((chat) => chat.id !== chatId);
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedChats));
};

export const clearChats = (apiKey: string): void => {
  const storedChats = localStorage.getItem(CHAT_STORAGE_KEY);
  if (!storedChats) return;
  
  const allChats: StoredChat[] = JSON.parse(storedChats);
  const apiKeyHash = hashApiKey(apiKey);
  
  // Keep only chats that don't belong to this API key
  const filteredChats = allChats.filter((chat) => chat.apiKeyHash !== apiKeyHash);
  
  if (filteredChats.length === 0) {
    localStorage.removeItem(CHAT_STORAGE_KEY);
  } else {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(filteredChats));
  }
};
