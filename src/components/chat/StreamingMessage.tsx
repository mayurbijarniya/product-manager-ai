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
      <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
        <Bot className="w-5 h-5 text-white" />
      </div>

      {/* Message Content */}
      <div className="flex-1 max-w-3xl">
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            AI Assistant
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
            <span>typing</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </span>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg">
          <div className="p-6">
            <MessageContent content={content} />
            
            {/* Typing indicator */}
            <div className="flex items-center space-x-2 mt-4">
              <div className="w-2 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse rounded-full" />
              <span className="text-xs text-gray-500 dark:text-gray-400">AI is thinking...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};