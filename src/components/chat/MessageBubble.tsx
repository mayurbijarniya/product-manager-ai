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
      <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-light dark:shadow-dark ${
        isUser 
          ? 'bg-light-surface dark:bg-dark-surface' 
          : 'bg-primary-600 dark:bg-primary-400'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-light-text-secondary dark:text-dark-text-secondary" />
        ) : (
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-dark-primary" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-full sm:max-w-3xl ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className={`flex items-center space-x-2 mb-2 sm:mb-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <span className="text-xs sm:text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
            {isUser ? 'You' : 'AI Assistant'}
          </span>
          <span className="text-xs text-light-text-muted dark:text-dark-text-muted">
            {format(message.timestamp, 'HH:mm')}
          </span>
        </div>

        <div className={`rounded-xl sm:rounded-2xl border transition-all duration-200 shadow-light dark:shadow-dark hover:shadow-light-md dark:hover:shadow-dark-md w-full ${
          isUser 
            ? 'bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border' 
            : 'bg-white dark:bg-dark-primary border-light-border dark:border-dark-border'
        }`}>
          <div className="p-4 sm:p-6">
            <MessageContent content={message.content} />
          </div>
          
          {/* Message metadata */}
          {message.metadata && (message.metadata.tokens || message.metadata.context) && (
            <div className="px-4 sm:px-6 pb-3 sm:pb-4 border-t border-light-border dark:border-dark-border">
              <div className="flex items-center justify-between text-xs text-light-text-muted dark:text-dark-text-muted pt-2 sm:pt-3">
                {message.metadata.tokens && (
                  <span className="bg-light-surface dark:bg-dark-surface px-2 py-1 rounded-full border border-light-border dark:border-dark-border">
                    {message.metadata.tokens} tokens
                  </span>
                )}
                {message.metadata.context && (
                  <span className="capitalize bg-light-surface dark:bg-dark-surface px-2 py-1 rounded-full border border-light-border dark:border-dark-border">
                    {message.metadata.context}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Message Actions - Mobile optimized */}
        {!isUser && (
          <div className="flex items-center space-x-1 mt-2 sm:mt-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button
              onClick={handleCopy}
              className={`p-2 rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-primary ${
                copied 
                  ? 'text-success-light dark:text-success-dark bg-success-light/10 dark:bg-success-dark/10' 
                  : 'text-light-text-muted hover:text-light-text-secondary dark:text-dark-text-muted dark:hover:text-dark-text-secondary hover:bg-light-surface dark:hover:bg-dark-surface'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleRegenerate}
              className="p-2 rounded-lg sm:rounded-xl text-light-text-muted hover:text-light-text-secondary dark:text-dark-text-muted dark:hover:text-dark-text-secondary hover:bg-light-surface dark:hover:bg-dark-surface transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-primary"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-primary ${
                bookmarked 
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900' 
                  : 'text-light-text-muted hover:text-light-text-secondary dark:text-dark-text-muted dark:hover:text-dark-text-secondary hover:bg-light-surface dark:hover:bg-dark-surface'
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};