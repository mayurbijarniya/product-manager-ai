import React, { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { StreamingMessage } from './StreamingMessage';
import { useAppStore } from '../../stores/appStore';
import type { Conversation } from '../../types';

interface MessageListProps {
  conversation: Conversation;
}

export const MessageList: React.FC<MessageListProps> = ({ conversation }) => {
  const { getConversationState } = useAppStore();
  const { isLoading, streamingMessage } = getConversationState(conversation.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages, streamingMessage, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-dark-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {conversation.messages.length === 0 && !isLoading && !streamingMessage ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-light-surface dark:bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-4 shadow-light dark:shadow-dark">
              <span className="text-base sm:text-lg font-bold text-primary-600 dark:text-primary-400">AI</span>
            </div>
            <p className="text-sm sm:text-base text-light-text-secondary dark:text-dark-text-secondary">
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
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-primary-600 dark:bg-primary-400 flex items-center justify-center shadow-light dark:shadow-dark">
                  <span className="text-white dark:text-dark-primary font-bold text-xs sm:text-sm">AI</span>
                </div>
                <div className="flex items-center space-x-2 text-light-text-muted dark:text-dark-text-muted">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-600 dark:bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-600 dark:bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-600 dark:bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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