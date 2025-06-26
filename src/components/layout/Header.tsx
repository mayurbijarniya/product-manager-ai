import React from 'react';
import { Menu, Sun, Moon, Bot } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../stores/appStore';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { setSidebarOpen, sidebarOpen } = useAppStore();

  return (
    <header className="h-14 sm:h-16 bg-white/90 dark:bg-dark-primary/90 backdrop-blur-xl border-b border-light-border dark:border-dark-border flex items-center justify-between px-4 lg:px-6 shadow-light dark:shadow-dark sticky top-0 z-40">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          icon={Menu}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden hover:bg-light-surface dark:hover:bg-dark-surface rounded-lg p-2 w-9 h-9 text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400"
        />
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary-600 dark:bg-primary-400 rounded-lg sm:rounded-xl flex items-center justify-center shadow-light dark:shadow-dark">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-dark-primary" />
          </div>
          <div className="hidden xs:block sm:block">
            <h1 className="text-sm sm:text-lg font-bold text-light-text-primary dark:text-dark-text-primary">
              Product Manager AI
            </h1>
          </div>
          <div className="xs:hidden">
            <h1 className="text-sm font-bold text-light-text-primary dark:text-dark-text-primary">
              PM AI
            </h1>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl bg-light-surface dark:bg-dark-surface hover:bg-primary-100 dark:hover:bg-primary-900 transition-all duration-200 text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-primary"
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