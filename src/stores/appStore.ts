import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Conversation, Message, FileData, Theme } from '../types';

interface AppState {
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  selectedFeature: string | null;
  
  // Conversations
  conversations: Conversation[];
  currentConversationId: string | null;
  
  // Per-conversation AI state
  conversationStates: Record<string, {
    isLoading: boolean;
    streamingMessage: string | null;
    abortController: AbortController | null;
  }>;
  
  // Files
  uploadedFiles: FileData[];
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setSelectedFeature: (feature: string | null) => void;
  
  // Conversation actions
  createConversation: (title?: string) => string;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  clearAllConversations: () => void;
  setCurrentConversation: (id: string | null) => void;
  
  // Message actions
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  
  // Per-conversation AI state actions
  setConversationLoading: (conversationId: string, loading: boolean) => void;
  setConversationStreaming: (conversationId: string, content: string | null) => void;
  setConversationAbortController: (conversationId: string, controller: AbortController | null) => void;
  stopConversationAI: (conversationId: string) => void;
  getConversationState: (conversationId: string) => { isLoading: boolean; streamingMessage: string | null; };
  
  // File actions
  addFile: (file: FileData) => void;
  removeFile: (fileName: string) => void;
  updateFile: (fileName: string, updates: Partial<FileData>) => void;
  
  // Utility
  getCurrentConversation: () => Conversation | null;
}

// Custom storage with Date object handling
const customStorage = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    
    try {
      return JSON.parse(str, (key, value) => {
        // Convert timestamp, createdAt, and updatedAt strings back to Date objects
        if ((key === 'timestamp' || key === 'createdAt' || key === 'updatedAt') && typeof value === 'string') {
          const date = new Date(value);
          return isNaN(date.getTime()) ? new Date() : date;
        }
        return value;
      });
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarOpen: true,
      theme: 'light',
      selectedFeature: null,
      conversations: [],
      currentConversationId: null,
      conversationStates: {},
      uploadedFiles: [],
      
      // Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTheme: (theme) => set({ theme }),
      setSelectedFeature: (feature) => set({ selectedFeature: feature }),
      
      createConversation: (title = 'New Conversation') => {
        const id = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newConversation: Conversation = {
          id,
          title,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: id,
          selectedFeature: null, // Clear selected feature when creating new conversation
          // Initialize conversation state
          conversationStates: {
            ...state.conversationStates,
            [id]: {
              isLoading: false,
              streamingMessage: null,
              abortController: null,
            }
          }
        }));
        
        return id;
      },
      
      updateConversation: (id, updates) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id 
              ? { ...conv, ...updates, updatedAt: new Date() }
              : conv
          ),
        }));
      },
      
      deleteConversation: (id) => {
        set((state) => ({
          // Clean up conversation state
          const newConversationStates = { ...state.conversationStates };
          if (newConversationStates[id]?.abortController) {
            newConversationStates[id].abortController.abort();
          }
          delete newConversationStates[id];
          
          return {
            conversations: state.conversations.filter((conv) => conv.id !== id),
            currentConversationId: state.currentConversationId === id ? null : state.currentConversationId,
            conversationStates: newConversationStates,
          };
        });
      },

      clearAllConversations: () => {
          conversations: [],
          currentConversationId: null,
          conversationStates: {},
        }));
      },
      
      setCurrentConversation: (id) => set({ currentConversationId: id }),
      
      addMessage: (conversationId, message) => {
        const newMessage: Message = {
          ...message,
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        };
        
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, newMessage],
                  updatedAt: new Date(),
                  // Update title based on first user message
                  title: conv.messages.length === 0 && message.role === 'user' 
                    ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
                    : conv.title
                }
              : conv
          ),
        }));
      },
      
      updateMessage: (conversationId, messageId, updates) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, ...updates } : msg
                  ),
                  updatedAt: new Date(),
                }
              : conv
          ),
        }));
      },
      
      // Per-conversation AI state management
      setConversationLoading: (conversationId, loading) => {
        set((state) => ({
          conversationStates: {
            ...state.conversationStates,
            [conversationId]: {
              ...state.conversationStates[conversationId],
              isLoading: loading,
            }
          }
        }));
      },
      
      setConversationStreaming: (conversationId, content) => {
        set((state) => ({
          conversationStates: {
            ...state.conversationStates,
            [conversationId]: {
              ...state.conversationStates[conversationId],
              streamingMessage: content,
            }
          }
        }));
      },
      
      setConversationAbortController: (conversationId, controller) => {
        set((state) => ({
          conversationStates: {
            ...state.conversationStates,
            [conversationId]: {
              ...state.conversationStates[conversationId],
              abortController: controller,
            }
          }
        }));
      },
      
      stopConversationAI: (conversationId) => {
        set((state) => {
          const conversationState = state.conversationStates[conversationId];
          if (conversationState?.abortController) {
            conversationState.abortController.abort();
          }
          
          return {
            conversationStates: {
              ...state.conversationStates,
              [conversationId]: {
                ...conversationState,
                isLoading: false,
                streamingMessage: null,
                abortController: null,
              }
            }
          };
        });
      },
      
      getConversationState: (conversationId) => {
        const state = get();
        const conversationState = state.conversationStates[conversationId];
        return {
          isLoading: conversationState?.isLoading || false,
          streamingMessage: conversationState?.streamingMessage || null,
        };
      },
      
      addFile: (file) => {
        set((state) => ({
          uploadedFiles: [...state.uploadedFiles, file],
        }));
      },
      
      removeFile: (fileName) => {
        set((state) => ({
          uploadedFiles: state.uploadedFiles.filter((file) => file.name !== fileName),
        }));
      },
      
      updateFile: (fileName, updates) => {
        set((state) => ({
          uploadedFiles: state.uploadedFiles.map((file) =>
            file.name === fileName ? { ...file, ...updates } : file
          ),
        }));
      },
      
      getCurrentConversation: () => {
        const state = get();
        return state.conversations.find((conv) => conv.id === state.currentConversationId) || null;
      },
    }),
    {
      name: 'pm-ai-chat-storage',
      storage: customStorage,
      partialize: (state) => ({
        conversations: state.conversations,
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        // Don't persist conversation states (they should reset on app restart)
      }),
    }
  )
);