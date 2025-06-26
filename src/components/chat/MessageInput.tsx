import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Square } from 'lucide-react';
import { Button } from '../ui/Button';
import { FileUpload } from '../features/FileUpload';
import { useAppStore } from '../../stores/appStore';
import { geminiService } from '../../utils/geminiService';

interface MessageInputProps {
  conversationId: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ conversationId }) => {
  const [message, setMessage] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const { addMessage, setIsLoading, setStreamingMessage, isLoading, getCurrentConversation } = useAppStore();

  // Auto-trigger AI response when loading state changes and there's a new user message
  useEffect(() => {
    const handleAIResponse = async () => {
      if (!isLoading) return;
      
      const conversation = getCurrentConversation();
      if (!conversation || conversation.messages.length === 0) return;
      
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      if (lastMessage.role !== 'user') return;

      // Create abort controller for this request
      abortControllerRef.current = new AbortController();

      try {
        // Get conversation history for context (excluding the last message since it's the current one)
        const conversationHistory = conversation.messages.slice(0, -1).map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        // Stream AI response
        const response = await geminiService.sendMessage(
          lastMessage.content,
          conversationHistory,
          (streamContent) => {
            // Check if request was aborted
            if (abortControllerRef.current?.signal.aborted) return;
            setStreamingMessage(streamContent);
          },
          abortControllerRef.current.signal // Pass abort signal
        );

        // Check if request was aborted before adding final message
        if (abortControllerRef.current?.signal.aborted) return;

        // Clear streaming and add final message
        setStreamingMessage(null);
        addMessage(conversationId, {
          content: response,
          role: 'assistant',
          metadata: {
            model: 'AI Assistant',
            tokens: response.length,
            context: 'general',
          },
        });
      } catch (error) {
        // Don't show error if request was aborted
        if (error instanceof Error && error.message === 'Request aborted') {
          console.log('Request was aborted by user');
          return;
        }
        
        console.error('Error sending message:', error);
        setStreamingMessage(null);
        addMessage(conversationId, {
          content: 'I apologize, but I encountered an error processing your request. Please check your connection and try again.',
          role: 'assistant',
        });
      } finally {
        setIsLoading(false);
        setStreamingMessage(null);
        abortControllerRef.current = null;
      }
    };

    handleAIResponse();
  }, [isLoading, conversationId, getCurrentConversation, addMessage, setIsLoading, setStreamingMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    // Add user message
    addMessage(conversationId, {
      content: userMessage,
      role: 'user',
    });

    // Set loading state (this will trigger the AI response via useEffect)
    setIsLoading(true);
  };

  const handleStop = () => {
    console.log('Stop button clicked - stopping AI response');
    
    // Abort the current request
    if (abortControllerRef.current) {
      console.log('Aborting current request');
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Immediately clear loading and streaming states
    setIsLoading(false);
    setStreamingMessage(null);
    
    console.log('AI response stopped successfully');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustTextareaHeight();
  };

  const handleFileProcessed = (analysisPrompt: string) => {
    setMessage(analysisPrompt);
    setShowFileUpload(false);
    // Auto-focus the textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const quickSuggestions = [
    'Create a competitive analysis',
    'Help me prioritize features',
    'Design user research study',
    'Build KPI dashboard',
  ];

  return (
    <div className="border-t border-light-border dark:border-dark-border bg-white/90 dark:bg-dark-primary/90 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-6 py-4 sm:py-6">
        {showFileUpload && (
          <div className="mb-4">
            <FileUpload 
              onClose={() => setShowFileUpload(false)} 
              onFileProcessed={handleFileProcessed}
            />
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-2 sm:gap-3">
            {/* File Upload Button */}
            <button
              type="button"
              onClick={() => setShowFileUpload(!showFileUpload)}
              disabled={isLoading}
              className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-light-text-muted hover:text-primary-600 dark:text-dark-text-muted dark:hover:text-primary-400 hover:bg-light-surface dark:hover:bg-dark-surface rounded-xl sm:rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-primary"
            >
              <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>

            {/* Message Input Container */}
            <div className="flex-1 relative">
              <div className="relative bg-white dark:bg-dark-surface rounded-xl sm:rounded-2xl border border-light-border dark:border-dark-border shadow-light dark:shadow-dark hover:shadow-light-md dark:hover:shadow-dark-md transition-all duration-200 focus-within:ring-2 focus-within:ring-primary-600 dark:focus-within:ring-primary-400 focus-within:border-transparent">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about product strategy, roadmapping, user research, or any PM topic..."
                  disabled={isLoading}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 pr-12 sm:pr-16 resize-none focus:outline-none bg-transparent text-light-text-primary dark:text-dark-text-primary placeholder-light-text-muted dark:placeholder-dark-text-muted disabled:opacity-50 transition-all duration-200 text-sm sm:text-base"
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                
                {/* Send/Stop Button */}
                <button
                  type={isLoading ? 'button' : 'submit'}
                  onClick={isLoading ? handleStop : undefined}
                  disabled={!isLoading && !message.trim()}
                  className={`absolute right-2 sm:right-3 bottom-2 sm:bottom-3 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isLoading
                      ? 'text-white bg-error-light hover:bg-error-light/90 dark:bg-error-dark dark:hover:bg-error-dark/90 shadow-light dark:shadow-dark hover:shadow-light-md dark:hover:shadow-dark-md focus:ring-error-light dark:focus:ring-error-dark focus:ring-offset-white dark:focus:ring-offset-dark-surface'
                      : message.trim()
                      ? 'text-white dark:text-dark-primary bg-primary-600 hover:bg-primary-700 dark:bg-primary-400 dark:hover:bg-primary-300 shadow-light dark:shadow-dark hover:shadow-light-md dark:hover:shadow-dark-md hover:scale-105 focus:ring-primary-600 dark:focus:ring-primary-400 focus:ring-offset-white dark:focus:ring-offset-dark-surface'
                      : 'text-light-text-muted bg-light-surface dark:bg-dark-surface cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <Square className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                  ) : (
                    <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Quick suggestions - Mobile optimized */}
        {!isLoading && (
          <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setMessage(suggestion)}
                disabled={isLoading}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-light-surface dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary rounded-full hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-light-border dark:border-dark-border hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-light dark:hover:shadow-dark focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-primary"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Footer info */}
        <p className="text-xs text-light-text-muted dark:text-dark-text-muted mt-3 sm:mt-4 text-center">
          AI can make mistakes. Always verify important information and strategic decisions.
        </p>
      </div>
    </div>
  );
};