import React from 'react';
import { Menu, Sun, Moon, Bot, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../stores/appStore';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { setSidebarOpen, sidebarOpen } = useAppStore();

  return (
    <header className="h-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between px-4 lg:px-6 shadow-lg sticky top-0 z-40">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          icon={Menu}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl p-2 w-10 h-10 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        />
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          </div>
          <div className="hidden xs:block sm:block">
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Product Manager AI
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
              Senior PM Assistant
            </p>
          </div>
          <div className="xs:hidden">
            <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              PM AI
            </h1>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 shadow-md hover:shadow-lg hover:scale-105"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <Sun className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>
      </div>
    </header>
  );
};