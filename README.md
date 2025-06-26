# Product Manager AI

A modern AI-powered assistant for product managers, built with React, TypeScript, and Tailwind CSS.

## Features

- 🤖 AI-powered conversations with PM expertise
- 📊 Data file analysis (CSV, Excel, JSON, TXT)
- 🎯 PM-specific features and frameworks
- 🌙 Dark/Light mode support
- 📱 Fully responsive design
- 💾 Conversation persistence

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Gemini AI API key

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd product-manager-ai
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Add your Gemini API key to `.env.local`:
```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

5. Start the development server
```bash
npm run dev
```

## Environment Variables

### Required

- `VITE_GEMINI_API_KEY` - Your Gemini AI API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Deployment

### Vercel

1. Connect your repository to Vercel
2. Add environment variable: `VITE_GEMINI_API_KEY`
3. Deploy

### Netlify

1. Connect your repository to Netlify
2. Add environment variable in Site Settings: `VITE_GEMINI_API_KEY`
3. Deploy

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **AI Service**: Google Gemini AI
- **File Processing**: Papa Parse, XLSX
- **Icons**: Lucide React
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/          # React components
│   ├── chat/           # Chat-related components
│   ├── features/       # Feature components
│   ├── layout/         # Layout components
│   └── ui/             # Reusable UI components
├── data/               # Static data and configurations
├── hooks/              # Custom React hooks
├── stores/             # Zustand stores
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details