import type { ChatCompletionRequest, ChatCompletionResponse } from '../types/chat';

const API_URL = 'https://api.openai.com/v1/chat/completions';

// Store API key in memory during the session
let currentApiKey: string | null = null;

// Function to set the API key
export const setApiKey = (apiKey: string) => {
  currentApiKey = apiKey;
  // Also store in localStorage for persistence between sessions
  localStorage.setItem('openai_api_key', apiKey);
};

// Function to get the API key
export const getApiKey = (): string | null => {
  // If we have a key in memory, use it
  if (currentApiKey) {
    return currentApiKey;
  }
  
  // Otherwise try to get from localStorage
  const storedKey = localStorage.getItem('openai_api_key');
  if (storedKey) {
    currentApiKey = storedKey;
    return storedKey;
  }
  
  return null;
};

// Function to clear the API key
export const clearApiKey = () => {
  currentApiKey = null;
  localStorage.removeItem('openai_api_key');
};

export const fetchChatCompletion = async (
  messages: ChatCompletionRequest['messages']
): Promise<ChatCompletionResponse> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('OpenAI API key is not set. Please provide your API key.');
  }

  const requestBody: ChatCompletionRequest = {
    model: 'gpt-4o-mini',
    messages,
    temperature: 0.7,
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch response from OpenAI API');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching chat completion:', error);
    throw error;
  }
};