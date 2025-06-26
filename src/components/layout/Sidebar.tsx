import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Settings,
  ChevronDown,
  ChevronRight,
  X,
  Trash2,
  Zap,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAppStore } from '../../stores/appStore';
import { quickActions } from '../../data/quickActions';
import type { PMCategory } from '../../types';
import { format } from 'date-fns';

const categoryConfig = {
  strategy: { icon: Target, label: 'Strategy', color: 'text-blue-600 dark:text-blue-400' },
  execution: { icon: TrendingUp, label: 'Execution', color: 'text-green-600 dark:text-green-400' },
  research: { icon: Users, label: 'Research', color: 'text-purple-600 dark:text-purple-400' },
  analytics: { icon: BarChart3, label: 'Analytics', color: 'text-orange-600 dark:text-orange-400' },
  technical: { icon: Settings, label: 'Technical', color: 'text-gray-600 dark:text-gray-400' },
  stakeholder: { icon: MessageSquare, label: 'Stakeholder', color: 'text-red-600 dark:text-red-400' },
};

export const Sidebar: React.FC = () => {
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    conversations, 
    createConversation, 
    setCurrentConversation, 
    currentConversationId,
    deleteConversation,
    clearAllConversations,
    setSelectedFeature,
    selectedFeature
  } = useAppStore();
  
  const [expandedCategories, setExpandedCategories] = useState<PMCategory[]>(['strategy', 'execution']);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const toggleCategory = (category: PMCategory) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleFeatureClick = (actionId: string) => {
    setSelectedFeature(actionId);
    setCurrentConversation(null); // Clear current conversation to show feature interface
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(id);
  };

  const confirmDelete = (id: string) => {
    deleteConversation(id);
    setShowDeleteConfirm(null);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all conversations? This action cannot be undone.')) {
      clearAllConversations();
    }
  };

  const handleNewConversation = () => {
    setSelectedFeature(null); // Clear selected feature
    createConversation();
  };

  if (!sidebarOpen) return null;

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed lg:relative inset-y-0 left-0 w-72 sm:w-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 z-50 flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Conversations
            </h2>
            <div className="flex items-center space-x-1">
              {conversations.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              )}
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 lg:hidden"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
          
          <button
            onClick={handleNewConversation}
            className="w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg sm:rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
            {conversations.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  No conversations yet
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Start a new one or try a feature below
                </p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div key={conversation.id} className="relative group">
                  {showDeleteConfirm === conversation.id ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-gray-900 dark:text-white mb-2 sm:mb-3 font-medium">
                        Delete this conversation?
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => confirmDelete(conversation.id)}
                          className="flex-1 py-1.5 sm:py-2 px-2 sm:px-3 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-medium rounded-md sm:rounded-lg transition-colors duration-200"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="flex-1 py-1.5 sm:py-2 px-2 sm:px-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-xs sm:text-sm font-medium rounded-md sm:rounded-lg transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedFeature(null);
                        setCurrentConversation(conversation.id);
                      }}
                      className={`w-full text-left p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-200 ${
                        currentConversationId === conversation.id && !selectedFeature
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-800 shadow-md' 
                          : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate mb-1">
                              {conversation.title}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {conversation.messages.length} messages
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                {format(new Date(conversation.updatedAt), 'MMM d')}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => handleDeleteConversation(conversation.id, e)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md sm:rounded-lg ml-1 sm:ml-2 flex-shrink-0"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* PM Features */}
          <div className="p-3 sm:p-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-md sm:rounded-lg flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                PM Features
              </h3>
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              {Object.entries(categoryConfig).map(([category, config]) => {
                const categoryActions = quickActions.filter(action => action.category === category);
                const isExpanded = expandedCategories.includes(category as PMCategory);
                
                if (categoryActions.length === 0) return null;
                
                return (
                  <div key={category}>
                    <button
                      onClick={() => toggleCategory(category as PMCategory)}
                      className="w-full flex items-center justify-between px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg sm:rounded-xl transition-all duration-200"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <config.icon className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${config.color}`} />
                        </div>
                        <span>{config.label}</span>
                      </div>
                      <div className="transition-transform duration-200">
                        {isExpanded ? (
                          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : (
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                      </div>
                    </button>
                    
                    {isExpanded && (
                      <div className="ml-6 sm:ml-9 mt-1 sm:mt-2 space-y-1">
                        {categoryActions.map((action) => (
                          <button
                            key={action.id}
                            onClick={() => handleFeatureClick(action.id)}
                            className={`w-full text-left px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg sm:rounded-xl transition-all duration-200 ${
                              selectedFeature === action.id
                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                          >
                            {action.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};