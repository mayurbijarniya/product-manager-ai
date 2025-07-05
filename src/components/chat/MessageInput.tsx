import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Square, Sparkles, Zap } from 'lucide-react';
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
  
  const { 
    addMessage, 
    setConversationLoading, 
    setConversationStreaming, 
    setConversationAbortController,
    stopConversationAI,
    getConversationState,
    getCurrentConversation 
  } = useAppStore();
  
  // Get conversation-specific state
  const { isLoading, streamingMessage } = getConversationState(conversationId);

  // Auto-trigger AI response when loading state changes and there's a new user message
  useEffect(() => {
    const handleAIResponse = async () => {
      // Only proceed if this conversation is loading
      if (!isLoading) return;
      
      const conversation = getCurrentConversation();
      // Ensure we're working with the correct conversation
      if (!conversation || conversation.id !== conversationId) return;
      
      // Check if there are messages and the last one is from user
      if (conversation.messages.length === 0) return;
      
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      
      // Only respond to user messages, and avoid duplicate responses
      if (lastMessage.role !== 'user') return;
      
      // Check if the last user message already has an assistant response
      // Look for the next message after the last user message
      const lastUserMessageIndex = conversation.messages.length - 1;
      const nextMessage = conversation.messages[lastUserMessageIndex + 1];
      const hasAssistantResponse = nextMessage && nextMessage.role === 'assistant';
      
      if (hasAssistantResponse) {
        // Clear loading state if there's already a response
        setConversationLoading(conversationId, false);
        return;
      }

      // Create abort controller for this request
      const abortController = new AbortController();
      setConversationAbortController(conversationId, abortController);

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
            if (abortController.signal.aborted) return;
            setConversationStreaming(conversationId, streamContent);
          },
          abortController.signal // Pass abort signal
        );

        // Check if request was aborted before adding final message
        if (abortController.signal.aborted) return;

        // Clear streaming and add final message
        setConversationStreaming(conversationId, null);
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
        setConversationStreaming(conversationId, null);
        addMessage(conversationId, {
          content: 'I apologize, but I encountered an error processing your request. Please check your connection and try again.',
          role: 'assistant',
        });
      } finally {
        setConversationLoading(conversationId, false);
        setConversationStreaming(conversationId, null);
        setConversationAbortController(conversationId, null);
      }
    };

    handleAIResponse();
  }, [isLoading, conversationId]); // Simplified dependencies to prevent unnecessary re-runs

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
    setConversationLoading(conversationId, true);
  };

  const handleStop = () => {
    console.log(`Stop button clicked for conversation ${conversationId}`);
    stopConversationAI(conversationId);
    console.log(`AI response stopped for conversation ${conversationId}`);
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
    <div className="border-t border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
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
          <div className="flex items-center gap-3">
            {/* File Upload Button - Same height as input, centered */}
            <button
              type="button"
              onClick={() => setShowFileUpload(!showFileUpload)}
              disabled={isLoading}
              className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 shadow-md hover:shadow-lg hover:scale-105 border border-gray-200 dark:border-gray-700"
            >
              <Paperclip className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            </button>

            {/* Message Input Container */}
            <div className="flex-1 relative">
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about product strategy, roadmapping, user research, or any PM topic..."
                  disabled={isLoading}
                  className="relative w-full px-6 py-3 pr-14 resize-none focus:outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 transition-all duration-200 text-base leading-relaxed min-h-[48px]"
                  rows={1}
                  style={{ maxHeight: '120px' }}
                />
                
                {/* Send/Stop Button - Same size as paperclip */}
                <button
                  type={isLoading ? 'button' : 'submit'}
                  onClick={isLoading ? handleStop : undefined}
                  disabled={!isLoading && !message.trim()}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md ${
                    isLoading
                      ? 'text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 focus:ring-red-500 focus:ring-offset-white dark:focus:ring-offset-gray-800'
                      : message.trim()
                      ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-gray-800'
                      : 'text-gray-400 bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <Square className="w-4 h-4 fill-current" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Quick suggestions - HIDDEN on mobile (sm and below), visible on tablet+ */}
        {!isLoading && (
          <div className="mt-3 hidden md:flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                onClick={() => setMessage(suggestion)}
                disabled={isLoading}
                className={`px-3 py-1.5 text-xs font-medium bg-gradient-to-r ${
                  index === 0 ? 'from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border-blue-200' :
                  index === 1 ? 'from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border-purple-200' :
                  index === 2 ? 'from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 border-green-200' :
                  'from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 border-orange-200'
                } dark:from-gray-800 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-600 dark:text-gray-300 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900`}
              >
                <Sparkles className="w-3 h-3 inline mr-1.5" />
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Compact Footer info */}
        <div className="flex items-center justify-center mt-3 text-xs text-gray-500 dark:text-gray-400">
          <Zap className="w-3 h-3 mr-1" />
          AI can make mistakes. Always verify important information and strategic decisions.
        </div>
      </div>
    </div>
  );
};