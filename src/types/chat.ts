export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: MessageRole;
  content: string;
  id: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: {
    role: MessageRole;
    content: string;
  }[];
  temperature?: number;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: MessageRole;
      content: string;
    };
    finish_reason: string;
  }[];
}
