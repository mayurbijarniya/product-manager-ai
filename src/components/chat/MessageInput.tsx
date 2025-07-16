import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Square } from 'lucide-react';
import { FileSpreadsheet, FileText, File as FileIcon } from 'lucide-react';
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
    getCurrentConversation,
    uploadedFiles,
    removeFile
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
  }, [isLoading, conversationId]);

  const handleSubmit = async () => {
    const hasContent = message.trim() || uploadedFiles.length > 0;
    if (!hasContent || isLoading) return;

    console.log("Submit triggered", { message: message.trim(), uploadedFiles: uploadedFiles.length, isLoading });

    const userMessage = message.trim() || "I've uploaded files for analysis. Please analyze the data and provide insights.";
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
      textarea.style.height = `${Math.min(textarea.scrollHeight, 80)}px`; // Reduced max height
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
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

  const handleFileUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("File upload button clicked", { showFileUpload });
    setShowFileUpload(!showFileUpload);
  };

  const handleSendClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Send button clicked", { message: message.trim(), isLoading, uploadedFiles: uploadedFiles.length });
    
    if (isLoading) {
      handleStop();
    } else {
      handleSubmit();
    }
  };

  // Button enable condition - works with files OR message
  const hasContent = message.trim() || uploadedFiles.length > 0;
  const canSend = hasContent && !isLoading;

  return (
    <div className="border-t border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        {/* File Attachments - Compact Mobile Style */}
        {uploadedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {uploadedFiles.map((file) => {
              const IconComponent = getFileIcon(file.type);
              const typeLabel = getFileTypeLabel(file.type, file.name);
              const iconColor = getFileIconColor(file.type, file.name);
              
              return (
                <div
                  key={file.name}
                  className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200 group max-w-xs"
                >
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 ${iconColor} rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {typeLabel}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => removeFile(file.name)}
                    className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="mb-3">
            <FileUpload 
              onClose={() => setShowFileUpload(false)} 
              onFileProcessed={handleFileProcessed}
            />
          </div>
        )}
        
        {/* Compact Input Container */}
        <div className="relative">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl border-2 border-blue-200 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-400 overflow-hidden">
            
            {/* Message Input - Compact */}
            <div className="flex items-end gap-2 sm:gap-3 p-3 sm:p-4">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about product strategy, roadmapping, user research, or any PM topic..."
                  disabled={isLoading}
                  className="relative w-full resize-none focus:outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 transition-all duration-200 text-sm sm:text-base leading-relaxed min-h-[20px] py-1 z-10"
                  rows={1}
                  style={{ maxHeight: '80px' }}
                />
              </div>
            </div>

            {/* Action Buttons Row - Below Input */}
            <div className="flex items-center justify-between px-3 sm:px-4 pb-3 sm:pb-4 relative z-20">
              {/* Left side - File upload */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleFileUploadClick}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 relative z-30"
                  type="button"
                >
                  <Paperclip className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-200" />
                </button>

                {/* File Upload Icon - Show when files attached */}
                {uploadedFiles.length > 0 && (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <FileSpreadsheet className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Right side - Send button */}
              <button
                onClick={handleSendClick}
                disabled={!canSend}
                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md relative z-30 ${
                  isLoading
                    ? 'text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 focus:ring-red-500 focus:ring-offset-white dark:focus:ring-offset-gray-800'
                    : canSend
                    ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-gray-800'
                    : 'text-gray-400 bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                }`}
                type="button"
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

        {/* Compact Footer - Reduced spacing */}
        <div className="flex items-center justify-center mt-2 text-xs text-gray-500 dark:text-gray-400">
          AI can make mistakes. Always verify important information and strategic decisions.
        </div>
      </div>
    </div>
  );
};