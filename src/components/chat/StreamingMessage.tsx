import React from 'react';
import { Bot } from 'lucide-react';
import { MessageContent } from './MessageContent';

interface StreamingMessageProps {
  content: string;
}

export const StreamingMessage: React.FC<StreamingMessageProps> = ({ content }) => {
  return (
    <div className="flex items-start space-x-4">
      {/* Avatar */}
      <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-primary-600 dark:bg-primary-400 flex items-center justify-center shadow-light dark:shadow-dark">
        <Bot className="w-5 h-5 text-white dark:text-dark-primary" />
      </div>

      {/* Message Content */}
      <div className="flex-1 max-w-3xl">
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
            AI Assistant
          </span>
          <span className="text-xs text-light-text-muted dark:text-dark-text-muted flex items-center space-x-1">
            <span>typing</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-primary-600 dark:bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-1 bg-primary-600 dark:bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1 h-1 bg-primary-600 dark:bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </span>
        </div>

        <div className="bg-white dark:bg-dark-primary border border-light-border dark:border-dark-border rounded-2xl shadow-light dark:shadow-dark">
          <div className="p-6">
            <MessageContent content={content} />
            
            {/* Typing indicator */}
            <div className="flex items-center space-x-2 mt-4">
              <div className="w-2 h-4 bg-primary-600 dark:bg-primary-400 animate-pulse rounded-full" />
              <span className="text-xs text-light-text-muted dark:text-dark-text-muted">AI is thinking...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};