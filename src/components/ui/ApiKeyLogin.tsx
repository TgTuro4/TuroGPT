import { useState, type FormEvent } from 'react';
import './ApiKeyLogin.css';

interface ApiKeyLoginProps {
  onApiKeySubmit: (apiKey: string) => void;
}

export const ApiKeyLogin = ({ onApiKeySubmit }: ApiKeyLoginProps) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      setError('API key should start with \"sk-\"');
      return;
    }

    onApiKeySubmit(apiKey);
    setError(null);
  };

  return (
    <div className="api-key-login">
      <div className="api-key-container">
        <h1>Welcome to ChatGPT UI</h1>
        <p className="description">
          This application requires an OpenAI API key to function.
          Please enter your API key below to continue.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="apiKey">OpenAI API Key</label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="api-key-input"
            />
            {error && <div className="error-message">{error}</div>}
          </div>
          
          <button type="submit" className="login-button">
            Continue
          </button>
        </form>
        
        <div className="info-text">
          <p>
            Your API key is stored locally in your browser and is never sent to our servers.
            You can get an API key from the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI dashboard</a>.
          </p>
        </div>
      </div>
    </div>
  );
};
