import React from 'react';
import { Menu, Sun, Moon, Bot } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../stores/appStore';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { setSidebarOpen, sidebarOpen } = useAppStore();

  return (
    <header className="h-14 sm:h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between px-4 lg:px-6 shadow-sm sticky top-0 z-40">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          icon={Menu}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 w-9 h-9"
        />
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="hidden xs:block sm:block">
            <h1 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Product Manager AI
            </h1>
          </div>
          <div className="xs:hidden">
            <h1 className="text-sm font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              PM AI
            </h1>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>
    </header>
  );
};