import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { FeatureInterface } from './FeatureInterface';
import { useAppStore } from '../../stores/appStore';
import { Bot, Sparkles, Target, Users, BarChart3, TrendingUp, Zap, Lightbulb, Rocket } from 'lucide-react';

export const ChatContainer: React.FC = () => {
  const { getCurrentConversation, selectedFeature } = useAppStore();
  const currentConversation = getCurrentConversation();

  // Show feature interface if a feature is selected
  if (selectedFeature) {
    return <FeatureInterface featureId={selectedFeature} />;
  }

  if (!currentConversation) {
    return (
      <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/10 overflow-hidden">
        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
            <div className="text-center max-w-6xl w-full">
              {/* Smaller Hero Section */}
              <div className="relative mb-6 sm:mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-2xl transform scale-125"></div>
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <Bot className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Zap className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              </div>
              
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3 sm:mb-4 px-4">
                Welcome to Product Manager AI
              </h2>
              
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
                Your senior PM assistant for strategic insights, data-driven recommendations, 
                and actionable frameworks for product success.
              </p>
              
              {/* Compact Feature Grid - Optimized for single view */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 px-4 max-w-4xl mx-auto">
                <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-700 cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Strategic Planning</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                    Competitive analysis, market positioning, roadmapping, and business model innovation
                  </p>
                  {/*<div className="flex items-center text-blue-600 dark:text-blue-400 text-xs font-medium">
                    <Rocket className="w-3 h-3 mr-1.5" />
                    Get Started
                  </div>*/}
                </div>
                
                <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-purple-400/10 transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 dark:hover:border-purple-700 cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">User Research</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                    Persona development, journey mapping, interview guides, and behavioral analysis
                  </p>
                  {/*<div className="flex items-center text-purple-600 dark:text-purple-400 text-xs font-medium">
                    <Rocket className="w-3 h-3 mr-1.5" />
                    Get Started
                  </div>*/}
                </div>
                
                <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:shadow-green-500/10 dark:hover:shadow-green-400/10 transition-all duration-300 hover:-translate-y-1 hover:border-green-200 dark:hover:border-green-700 cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Data Analytics</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                    KPI frameworks, cohort analysis, A/B testing, and performance metrics
                  </p>
                  {/*<div className="flex items-center text-green-600 dark:text-green-400 text-xs font-medium">
                    <Rocket className="w-3 h-3 mr-1.5" />
                    Get Started
                  </div>*/}
                </div>
                
                <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:shadow-orange-500/10 dark:hover:shadow-orange-400/10 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 dark:hover:border-orange-700 cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Execution</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                    Feature prioritization, sprint planning, resource allocation, and go-to-market
                  </p>
                  {/*<div className="flex items-center text-orange-600 dark:text-orange-400 text-xs font-medium">
                    <Rocket className="w-3 h-3 mr-1.5" />
                    Get Started
                  </div>*/}
                </div>
              </div>
              
              {/* Compact Pro Tip Section */}
              <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 sm:p-6 rounded-xl border border-blue-200/50 dark:border-blue-800/50 mx-4 mb-4 shadow-lg backdrop-blur-sm max-w-3xl mx-auto">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md mr-3">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center">
                    <Sparkles className="w-4 h-4 text-yellow-500 mr-2" />
                    Pro Tip
                  </h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-center">
                  Try the PM Features in the sidebar for guided assistance, 
                  or start a conversation with specific questions about your product challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
      <MessageList conversation={currentConversation} />
      <MessageInput conversationId={currentConversation.id} />
    </div>
  );
};