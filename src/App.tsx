import React, { useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ChatContainer } from './components/chat/ChatContainer';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    // Apply theme class to document root
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <ChatContainer />
      </div>
    </div>
  );
}

export default App;