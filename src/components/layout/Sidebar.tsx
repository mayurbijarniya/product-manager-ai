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
  strategy: { icon: Target, label: 'Strategy', color: 'text-primary-600 dark:text-primary-400' },
  execution: { icon: TrendingUp, label: 'Execution', color: 'text-primary-600 dark:text-primary-400' },
  research: { icon: Users, label: 'Research', color: 'text-primary-600 dark:text-primary-400' },
  analytics: { icon: BarChart3, label: 'Analytics', color: 'text-primary-600 dark:text-primary-400' },
  technical: { icon: Settings, label: 'Technical', color: 'text-primary-600 dark:text-primary-400' },
  stakeholder: { icon: MessageSquare, label: 'Stakeholder', color: 'text-primary-600 dark:text-primary-400' },
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
      <div className="fixed lg:relative inset-y-0 left-0 w-80 sm:w-80 bg-light-surface/90 dark:bg-dark-surface/90 backdrop-blur-xl border-r border-light-border dark:border-dark-border z-50 flex flex-col shadow-light dark:shadow-dark">
        {/* Header */}
        <div className="p-4 border-b border-light-border dark:border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">
              Conversations
            </h2>
            <div className="flex items-center space-x-1">
              {conversations.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="w-8 h-8 flex items-center justify-center text-error-light dark:text-error-dark hover:text-error-light/80 dark:hover:text-error-dark/80 hover:bg-error-light/10 dark:hover:bg-error-dark/10 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-error-light dark:focus:ring-error-dark focus:ring-offset-2 focus:ring-offset-light-surface dark:focus:ring-offset-dark-surface"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-surface dark:hover:bg-dark-surface rounded-lg transition-all duration-200 lg:hidden focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-light-surface dark:focus:ring-offset-dark-surface"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <button
            onClick={handleNewConversation}
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 dark:bg-primary-400 dark:hover:bg-primary-300 text-white dark:text-dark-primary rounded-xl font-medium transition-all duration-200 shadow-light dark:shadow-dark hover:shadow-light-md dark:hover:shadow-dark-md hover:scale-[1.02] flex items-center justify-center space-x-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-light-surface dark:focus:ring-offset-dark-surface"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {conversations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-light-surface dark:bg-dark-surface rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-light dark:shadow-dark">
                  <MessageSquare className="w-8 h-8 text-light-text-muted dark:text-dark-text-muted" />
                </div>
                <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                  No conversations yet
                </p>
                <p className="text-xs text-light-text-muted dark:text-dark-text-muted">
                  Start a new one or try a feature below
                </p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div key={conversation.id} className="relative group">
                  {showDeleteConfirm === conversation.id ? (
                    <div className="bg-error-light/10 dark:bg-error-dark/10 border border-error-light/20 dark:border-error-dark/20 rounded-xl p-4">
                      <p className="text-sm text-light-text-primary dark:text-dark-text-primary mb-3 font-medium">
                        Delete this conversation?
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => confirmDelete(conversation.id)}
                          className="flex-1 py-2 px-3 bg-error-light hover:bg-error-light/90 dark:bg-error-dark dark:hover:bg-error-dark/90 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-error-light dark:focus:ring-error-dark focus:ring-offset-2 focus:ring-offset-light-surface dark:focus:ring-offset-dark-surface"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="flex-1 py-2 px-3 bg-light-surface dark:bg-dark-surface hover:bg-primary-100 dark:hover:bg-primary-900 text-light-text-primary dark:text-dark-text-primary text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-light-surface dark:focus:ring-offset-dark-surface"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleConversationSelect(conversation.id)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-light-surface dark:focus:ring-offset-dark-surface ${
                        currentConversationId === conversation.id && !selectedFeature
                          ? 'bg-primary-100 dark:bg-primary-900 border-2 border-primary-200 dark:border-primary-800 shadow-light dark:shadow-dark' 
                          : 'bg-white dark:bg-dark-primary hover:bg-light-surface dark:hover:bg-dark-surface border border-light-border dark:border-dark-border hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-light dark:hover:shadow-dark'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          <div className="w-8 h-8 bg-light-surface dark:bg-dark-surface rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-light dark:shadow-dark">
                            <MessageSquare className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate mb-1">
                              {conversation.title}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                                {conversation.messages.length} messages
                              </p>
                              <p className="text-xs text-light-text-muted dark:text-dark-text-muted">
                                {format(new Date(conversation.updatedAt), 'MMM d')}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => handleDeleteConversation(conversation.id, e)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 flex items-center justify-center text-error-light dark:text-error-dark hover:text-error-light/80 dark:hover:text-error-dark/80 hover:bg-error-light/10 dark:hover:bg-error-dark/10 rounded-lg ml-2 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-error-light dark:focus:ring-error-dark focus:ring-offset-2 focus:ring-offset-light-surface dark:focus:ring-offset-dark-surface"
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
          <div className="p-4 border-t border-light-border dark:border-dark-border">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-primary-600 dark:bg-primary-400 rounded-lg flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white dark:text-dark-primary" />
              </div>
              <h3 className="text-sm font-bold text-light-text-primary dark:text-dark-text-primary">
                PM Features
              </h3>
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
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-surface dark:hover:bg-dark-surface hover:text-light-text-primary dark:hover:text-dark-text-primary rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-light-surface dark:focus:ring-offset-dark-surface"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-lg bg-light-surface dark:bg-dark-surface flex items-center justify-center shadow-light dark:shadow-dark">
                          <config.icon className={`w-3 h-3 ${config.color}`} />
                        </div>
                        <span>{config.label}</span>
                      </div>
                      <div className="transition-transform duration-200">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                    
                    {isExpanded && (
                      <div className="ml-9 mt-2 space-y-1">
                        {categoryActions.map((action) => (
                          <button
                            key={action.id}
                            onClick={() => handleFeatureClick(action.id)}
                            className={`w-full text-left px-3 py-2.5 text-sm rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-light-surface dark:focus:ring-offset-dark-surface ${
                              selectedFeature === action.id
                                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 shadow-light dark:shadow-dark'
                                : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-surface dark:hover:bg-dark-surface hover:text-light-text-primary dark:hover:text-dark-text-primary'
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