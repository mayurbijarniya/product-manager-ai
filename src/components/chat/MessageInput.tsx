import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Square, Sparkles, Zap, Plus } from 'lucide-react';
import { FileSpreadsheet, FileText, File as FileIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { FileUpload } from '../features/FileUpload';
import { useAppStore } from '../../stores/appStore';
import type { FileData } from '../../types';
import { geminiService } from '../../utils/geminiService';

interface MessageInputProps {
  conversationId: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ conversationId }) => {
  const [message, setMessage] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { 
    addMessage, 
    setConversationLoading, 
    setConversationStreaming, 
    setConversationAbortController,
    stopConversationAI,
    getConversationState,
    getCurrentConversation,
    uploadedFiles,
    removeFile
  } = useAppStore();
  
  // Get conversation-specific state
  const { isLoading, streamingMessage } = getConversationState(conversationId);

  // Hide suggestions when user starts typing or when there are messages
  useEffect(() => {
    const conversation = getCurrentConversation();
    if (conversation && conversation.messages.length > 0) {
      setShowSuggestions(false);
    } else {
      setShowSuggestions(true);
    }
  }, [getCurrentConversation]);

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
          setConversationStreaming(conversationId, null);
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

    // Hide suggestions when user sends a message
    setShowSuggestions(false);

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
    
    // Immediately clear streaming to stop visual output
    setConversationStreaming(conversationId, null);
    
    // Stop the AI processing
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
    
    // Hide suggestions when user starts typing
    if (e.target.value.trim() && showSuggestions) {
      setShowSuggestions(false);
    }
    
    adjustTextareaHeight();
  };

  const handleFileProcessed = (analysisPrompt: string) => {
    setShowFileUpload(false);
    // Just close the upload UI, files are now attached
  };
  const getFileIcon = (type: string) => {
    if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) {
      return FileSpreadsheet;
    }
    if (type.includes('text') || type.includes('json')) {
      return FileText;
    }
    return FileIcon;
  };

  const getFileTypeLabel = (type: string, name: string) => {
    if (type.includes('csv') || name.endsWith('.csv')) return 'Spreadsheet';
    if (type.includes('excel') || name.endsWith('.xlsx') || name.endsWith('.xls')) return 'Spreadsheet';
    if (type.includes('json') || name.endsWith('.json')) return 'File';
    if (type.includes('text') || name.endsWith('.txt')) return 'Document';
    return 'File';
  };

  const getFileIconColor = (type: string, name: string) => {
    if (type.includes('csv') || name.endsWith('.csv')) return 'bg-green-500';
    if (type.includes('excel') || name.endsWith('.xlsx') || name.endsWith('.xls')) return 'bg-green-600';
    if (type.includes('json') || name.endsWith('.json')) return 'bg-blue-500';
    if (type.includes('text') || name.endsWith('.txt')) return 'bg-red-500';
    return 'bg-gray-500';
  };

  const quickSuggestions = [
    'Create a competitive analysis',
    'Help me prioritize features',
    'Design user research study',
    'Build KPI dashboard',
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setShowSuggestions(false);
    // Focus the textarea after setting the message
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        adjustTextareaHeight();
      }
    }, 0);
  };

  return (
    <div className="border-t border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* File Attachments - ChatGPT Style */}
        {uploadedFiles.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {uploadedFiles.map((file) => {
              const IconComponent = getFileIcon(file.type);
              const typeLabel = getFileTypeLabel(file.type, file.name);
              const iconColor = getFileIconColor(file.type, file.name);
              
              return (
                <div
                  key={file.name}
                  className="flex items-center space-x-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200 group max-w-xs"
                >
                  <div className={`w-10 h-10 ${iconColor} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {typeLabel}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => removeFile(file.name)}
                    className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
        
        {showFileUpload && (
          <div className="mb-4">
            <FileUpload 
              onClose={() => setShowFileUpload(false)} 
              onFileProcessed={handleFileProcessed}
            />
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="relative">
          {/* Single Container - Modern AI Assistant Style */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
            
            <div className="flex items-end gap-3 p-4">
              {/* File Upload Button */}
              <button
                type="button"
                onClick={() => setShowFileUpload(!showFileUpload)}
                disabled={isLoading}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
              >
                <Paperclip className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              </button>

              {/* Message Input */}
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about product strategy, roadmapping, user research, or any PM topic..."
                  disabled={isLoading}
                  className="relative w-full resize-none focus:outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 transition-all duration-200 text-base leading-relaxed min-h-[24px] py-1"
                  rows={1}
                  style={{ maxHeight: '120px' }}
                />
              </div>

              {/* Send/Stop Button */}
              <button
                type={isLoading ? 'button' : 'submit'}
                onClick={isLoading ? handleStop : undefined}
                disabled={!isLoading && !message.trim()}
                className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md ${
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
        </form>

        {/* Typing Animation Suggestions - Only show for new conversations */}
        {!isLoading && showSuggestions && (
          <div className="mt-3 hidden md:flex flex-wrap gap-2">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mr-3 animate-pulse">
              <div className="flex space-x-1 mr-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              Try asking:
            </div>
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isLoading}
                className={`px-3 py-1.5 text-xs font-medium bg-gradient-to-r ${
                  index === 0 ? 'from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border-blue-200' :
                  index === 1 ? 'from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border-purple-200' :
                  index === 2 ? 'from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 border-green-200' :
                  'from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 border-orange-200'
                } dark:from-gray-800 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-600 dark:text-gray-300 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900`}
              >
                <Sparkles className="w-3 h-3 inline mr-1.5 opacity-60" />
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Compact Footer info */}
        <div className="flex items-center justify-center mt-3 text-xs text-gray-500 dark:text-gray-400">
          <Zap className="w-3 h-3 mr-1 opacity-60" />
          AI can make mistakes. Always verify important information and strategic decisions.
        </div>
      </div>
    </div>
  );
};