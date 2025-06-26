import React, { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { StreamingMessage } from './StreamingMessage';
import { useAppStore } from '../../stores/appStore';
import type { Conversation } from '../../types';

interface MessageListProps {
  conversation: Conversation;
}

export const MessageList: React.FC<MessageListProps> = ({ conversation }) => {
  const { isLoading, streamingMessage } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages, streamingMessage, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {conversation.messages.length === 0 && !isLoading && !streamingMessage ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-base sm:text-lg font-bold text-gray-600 dark:text-gray-400">AI</span>
            </div>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Start the conversation! Ask me anything about product management.
            </p>
          </div>
        ) : (
          <>
            {conversation.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {streamingMessage && (
              <StreamingMessage content={streamingMessage} />
            )}
            
            {isLoading && !streamingMessage && (
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-black dark:bg-white flex items-center justify-center">
                  <span className="text-white dark:text-black font-bold text-xs sm:text-sm">AI</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs sm:text-sm">AI is thinking...</span>
                </div>
              </div>
            )}
          </>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};