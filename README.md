# ChatGPT UI

A sleek, responsive Chatbot UI powered by the ChatGPT API using React, TypeScript, and Vite.

## Features

- 🎨 Modern, clean UI with smooth animations
- 💬 Real-time chat interface with user and assistant messages
- 🌙 Dark/light mode toggle with system preference detection
- 📱 Fully responsive design for mobile and desktop
- ⚡ Built with React and TypeScript for type safety
- 🔄 Loading indicators while waiting for API responses

## Setup Instructions

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd chatgpt-ui
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Configure your API key

Create a `.env` file in the root directory and add your OpenAI API key:
```
VITE_OPENAI_API_KEY=your_api_key_here
```

### Development

Start the development server:
```bash
npm run dev
# or
yarn dev
```

This will start the application on http://localhost:5173 (or another port if 5173 is in use).

### Building for Production

Build the application for production:
```bash
npm run build
# or
yarn build
```

Preview the production build:
```bash
npm run preview
# or
yarn preview
```

## Implementation Details

- Built with React 18 and TypeScript
- Uses Vite for fast development and optimized builds
- Responsive design with CSS for styling
- OpenAI Chat API integration for handling messages
- Supports GPT-3.5-turbo and GPT-4o-mini models
- Theme toggle for dark/light mode with local storage persistence
