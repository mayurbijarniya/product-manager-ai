import React, { useState } from 'react';
import { User, Bot, Copy, RotateCcw, Bookmark, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MessageContent } from './MessageContent';
import type { Message } from '../../types';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleRegenerate = () => {
    // TODO: Implement regenerate functionality
    console.log('Regenerate message:', message.id);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // TODO: Implement bookmark functionality
    console.log('Bookmark message:', message.id);
  };

  return (
    <div className={`group flex items-start space-x-3 sm:space-x-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg ${
        isUser 
          ? 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600' 
          : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-3xl ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className={`flex items-center space-x-2 mb-2 sm:mb-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
            {isUser ? 'You' : 'AI Assistant'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {format(message.timestamp, 'HH:mm')}
          </span>
        </div>

        <div className={`rounded-xl sm:rounded-2xl border transition-all duration-200 shadow-lg hover:shadow-xl ${
          isUser 
            ? 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-600' 
            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
        }`}>
          <div className="p-4 sm:p-6">
            <MessageContent content={message.content} />
          </div>
          
          {/* Message metadata */}
          {message.metadata && (message.metadata.tokens || message.metadata.context) && (
            <div className="px-4 sm:px-6 pb-3 sm:pb-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 sm:pt-3">
                {message.metadata.tokens && (
                  <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                    {message.metadata.tokens} tokens
                  </span>
                )}
                {message.metadata.context && (
                  <span className="capitalize bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                    {message.metadata.context}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Message Actions */}
        {!isUser && (
          <div className="flex items-center space-x-1 mt-2 sm:mt-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button
              onClick={handleCopy}
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-200 ${
                copied 
                  ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {copied ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
            </button>
            <button
              onClick={handleRegenerate}
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={handleBookmark}
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-200 ${
                bookmarked 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};