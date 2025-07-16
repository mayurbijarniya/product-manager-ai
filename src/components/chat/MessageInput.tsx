import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Square, Sparkles, Zap, Lightbulb, Rocket } from 'lucide-react';
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
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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

  const quickSuggestions = [
    'Create a competitive analysis',
    'Help me prioritize features',
    'Design user research study',
    'Build KPI dashboard',
  ];

  // Hide suggestions when user starts typing or when there are messages
  useEffect(() => {
    const conversation = getCurrentConversation();
    if (conversation && conversation.messages.length > 0) {
      setShowSuggestions(false);
    } else {
      setShowSuggestions(true);
    }
  }, [getCurrentConversation]);

  // Continuous typing animation effect
  useEffect(() => {
    if (!showSuggestions) return;

    let typingInterval: NodeJS.Timeout;
    let suggestionTimeout: NodeJS.Timeout;

    const typeText = (text: string) => {
      setTypingText('');
      setIsTyping(true);
      let currentIndex = 0;
      
      typingInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setTypingText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          
          // Show completed text for 1 second, then move to next
          suggestionTimeout = setTimeout(() => {
            setCurrentSuggestionIndex((prev) => (prev + 1) % quickSuggestions.length);
          }, 1000);
        }
      }, 50); // Typing speed
    };

    // Start typing the current suggestion
    typeText(quickSuggestions[currentSuggestionIndex]);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(suggestionTimeout);
    };
  }, [currentSuggestionIndex, showSuggestions, quickSuggestions]);

  // Reset animation when suggestions are shown again
  useEffect(() => {
    if (showSuggestions) {
      setCurrentSuggestionIndex(0);
      setTypingText('');
      setIsTyping(false);
    }
  }, [showSuggestions]);

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

  const handleSubmit = async () => {
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
      handleSubmit();
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

  const handleFileUploadClick = () => {
    setShowFileUpload(!showFileUpload);
  };

  const handleSendClick = () => {
    if (isLoading) {
      handleStop();
    } else if (message.trim()) {
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* File Attachments - Modern AI Assistant Style */}
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
        
        {/* File Upload Modal */}
        {showFileUpload && (
          <div className="mb-4">
            <FileUpload 
              onClose={() => setShowFileUpload(false)} 
              onFileProcessed={handleFileProcessed}
            />
          </div>
        )}
        
        {/* Continuous Typing Animation Suggestions */}
        {!isLoading && showSuggestions && (
          <div className="mb-6 flex items-center justify-between">
            {/* Left side - "Try asking:" with dots */}
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <div className="flex space-x-1 mr-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              Try asking:
            </div>
            
            {/* Right side - Typing suggestion */}
            <div className="flex-1 flex justify-end">
              <div
                onClick={() => handleSuggestionClick(quickSuggestions[currentSuggestionIndex])}
                className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer border hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:text-blue-300 dark:border-blue-700"
              >
                <Sparkles className="w-3 h-3 inline mr-1.5 opacity-60" />
                <span className="typing-text">
                  {typingText}
                  {isTyping && <span className="animate-pulse">|</span>}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Input Container - NO FORM WRAPPER */}
        <div className="relative">
          {/* Single Container - Modern AI Assistant Style */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl border-2 border-blue-200 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-400 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
            
            <div className="flex items-end gap-3 p-4">
              {/* File Upload Button */}
              <div
                onClick={handleFileUploadClick}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
              >
                <Paperclip className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              </div>

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

              {/* File Upload Icon (Excel style) */}
              {uploadedFiles.length > 0 && (
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Send/Stop Button */}
              <div
                onClick={handleSendClick}
                className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md ${
                  isLoading
                    ? 'text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 focus:ring-red-500 focus:ring-offset-white dark:focus:ring-offset-gray-800'
                    : message.trim()
                    ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-gray-800'
                    : 'text-gray-400 bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                } ${!isLoading && !message.trim() ? 'pointer-events-none' : ''}`}
              >
                {isLoading ? (
                  <Square className="w-4 h-4 fill-current" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Compact Footer info */}
        <div className="flex items-center justify-center mt-3 text-xs text-gray-500 dark:text-gray-400">
          <Zap className="w-3 h-3 mr-1 opacity-60" />
          AI can make mistakes. Always verify important information and strategic decisions.
        </div>
      </div>
    </div>
  );
};