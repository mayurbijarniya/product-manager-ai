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
  Sparkles,
  Rocket
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAppStore } from '../../stores/appStore';
import { quickActions } from '../../data/quickActions';
import type { PMCategory } from '../../types';
import { format } from 'date-fns';

const categoryConfig = {
  strategy: { icon: Target, label: 'Strategy', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  execution: { icon: TrendingUp, label: 'Execution', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  research: { icon: Users, label: 'Research', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  analytics: { icon: BarChart3, label: 'Analytics', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  technical: { icon: Settings, label: 'Technical', color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-900/30' },
  stakeholder: { icon: MessageSquare, label: 'Stakeholder', color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' },
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
    setCurrentConversation(null);
    // Auto-close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
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
    setSelectedFeature(null);
    createConversation();
    // Auto-close sidebar on mobile after creating conversation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleConversationSelect = (conversationId: string) => {
    setSelectedFeature(null);
    setCurrentConversation(conversationId);
    // Auto-close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
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
      <div className="fixed lg:relative inset-y-0 left-0 w-80 sm:w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Conversations
            </h2>
            <div className="flex items-center space-x-1">
              {conversations.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 lg:hidden focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <Button
            onClick={handleNewConversation}
            variant="primary"
            size="md"
            icon={Plus}
            fullWidth
            className="shadow-lg hover:shadow-xl"
          >
            New Conversation
          </Button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {conversations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-500" />
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
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                      <p className="text-sm text-gray-900 dark:text-white mb-3 font-medium">
                        Delete this conversation?
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => confirmDelete(conversation.id)}
                          variant="danger"
                          size="sm"
                          className="flex-1"
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={() => setShowDeleteConfirm(null)}
                          variant="secondary"
                          size="sm"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleConversationSelect(conversation.id)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 ${
                        currentConversationId === conversation.id && !selectedFeature
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-2 border-blue-200 dark:border-blue-700 shadow-lg transform scale-[1.02]' 
                          : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-lg hover:transform hover:scale-[1.01]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                            <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">
                              {conversation.title}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {conversation.messages.length} messages
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                {format(new Date(conversation.updatedAt), 'MMM d')}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => handleDeleteConversation(conversation.id, e)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg ml-2 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* PM Features */}
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-purple-50/30 to-pink-50/30 dark:from-purple-900/10 dark:to-pink-900/10">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                PM Features
              </h3>
              <div className="flex-1 flex justify-end">
                <div className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-md">
                  <Zap className="w-3 h-3 inline mr-1" />
                  AI
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {Object.entries(categoryConfig).map(([category, config]) => {
                const categoryActions = quickActions.filter(action => action.category === category);
                const isExpanded = expandedCategories.includes(category as PMCategory);
                
                if (categoryActions.length === 0) return null;
                
                return (
                  <div key={category}>
                    <button
                      onClick={() => toggleCategory(category as PMCategory)}
                      className="w-full flex items-center justify-between px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-xl ${config.bgColor} flex items-center justify-center shadow-md`}>
                          <config.icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <span className="font-semibold">{config.label}</span>
                      </div>
                      <div className="transition-transform duration-300">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                    
                    {isExpanded && (
                      <div className="ml-11 mt-2 space-y-1">
                        {categoryActions.map((action) => (
                          <button
                            key={action.id}
                            onClick={() => handleFeatureClick(action.id)}
                            className={`w-full text-left px-3 py-3 text-sm rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 ${
                              selectedFeature === action.id
                                ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 shadow-lg font-medium'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-center">
                              <Rocket className="w-3 h-3 mr-2 opacity-60" />
                              {action.title}
                            </div>
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