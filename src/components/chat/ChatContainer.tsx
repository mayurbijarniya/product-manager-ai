import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { FeatureInterface } from './FeatureInterface';
import { useAppStore } from '../../stores/appStore';
import { Bot, Sparkles, Target, Users, BarChart3, TrendingUp } from 'lucide-react';

export const ChatContainer: React.FC = () => {
  const { getCurrentConversation, selectedFeature } = useAppStore();
  const currentConversation = getCurrentConversation();

  // Show feature interface if a feature is selected
  if (selectedFeature) {
    return <FeatureInterface featureId={selectedFeature} />;
  }

  if (!currentConversation) {
    return (
      <div className="flex-1 flex flex-col bg-white dark:bg-dark-primary overflow-hidden">
        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
            <div className="text-center max-w-4xl w-full">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-primary-600 dark:bg-primary-400 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-light-lg dark:shadow-dark-lg">
                <Bot className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white dark:text-dark-primary" />
              </div>
              
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-3 sm:mb-4 px-4">
                Welcome to Product Manager AI
              </h2>
              
              <p className="text-base sm:text-xl text-light-text-secondary dark:text-dark-text-secondary mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
                Your senior PM assistant for strategic insights, data-driven recommendations, 
                and actionable frameworks for product success.
              </p>
              
              {/* Mobile-Optimized Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4 mb-6 sm:mb-8 px-4">
                <div className="group bg-white dark:bg-dark-surface p-4 sm:p-5 rounded-xl border border-light-border dark:border-dark-border hover:shadow-light-lg dark:hover:shadow-dark-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 dark:hover:border-primary-800">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-primary-600 dark:bg-primary-400 rounded-lg flex items-center justify-center shadow-light dark:shadow-dark">
                      <Target className="w-5 h-5 text-white dark:text-dark-primary" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-light-text-primary dark:text-dark-text-primary">Strategic Planning</h3>
                  </div>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                    Competitive analysis, market positioning, roadmapping, and business model innovation
                  </p>
                </div>
                
                <div className="group bg-white dark:bg-dark-surface p-4 sm:p-5 rounded-xl border border-light-border dark:border-dark-border hover:shadow-light-lg dark:hover:shadow-dark-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 dark:hover:border-primary-800">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-primary-600 dark:bg-primary-400 rounded-lg flex items-center justify-center shadow-light dark:shadow-dark">
                      <Users className="w-5 h-5 text-white dark:text-dark-primary" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-light-text-primary dark:text-dark-text-primary">User Research</h3>
                  </div>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                    Persona development, journey mapping, interview guides, and behavioral analysis
                  </p>
                </div>
                
                <div className="group bg-white dark:bg-dark-surface p-4 sm:p-5 rounded-xl border border-light-border dark:border-dark-border hover:shadow-light-lg dark:hover:shadow-dark-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 dark:hover:border-primary-800">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-primary-600 dark:bg-primary-400 rounded-lg flex items-center justify-center shadow-light dark:shadow-dark">
                      <BarChart3 className="w-5 h-5 text-white dark:text-dark-primary" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-light-text-primary dark:text-dark-text-primary">Data Analytics</h3>
                  </div>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                    KPI frameworks, cohort analysis, A/B testing, and performance metrics
                  </p>
                </div>
                
                <div className="group bg-white dark:bg-dark-surface p-4 sm:p-5 rounded-xl border border-light-border dark:border-dark-border hover:shadow-light-lg dark:hover:shadow-dark-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 dark:hover:border-primary-800">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-primary-600 dark:bg-primary-400 rounded-lg flex items-center justify-center shadow-light dark:shadow-dark">
                      <TrendingUp className="w-5 h-5 text-white dark:text-dark-primary" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-light-text-primary dark:text-dark-text-primary">Execution</h3>
                  </div>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                    Feature prioritization, sprint planning, resource allocation, and go-to-market
                  </p>
                </div>
              </div>
              
              {/* Pro Tip Section */}
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 sm:p-6 rounded-xl border border-primary-200 dark:border-primary-800 mx-4 mb-6 shadow-light dark:shadow-dark">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <h3 className="text-base sm:text-lg font-bold text-light-text-primary dark:text-dark-text-primary">
                    Pro Tip
                  </h3>
                </div>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                  Try the PM Features in the sidebar for guided assistance, 
                  or start a conversation with specific questions about your product challenges.
                </p>
              </div>
              
              {/* Extra padding at bottom for scroll */}
              <div className="h-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-dark-primary">
      <MessageList conversation={currentConversation} />
      <MessageInput conversationId={currentConversation.id} />
    </div>
  );
};