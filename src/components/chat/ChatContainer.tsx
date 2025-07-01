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
            <div className="text-center max-w-5xl w-full">
              {/* Hero Section */}
              <div className="relative mb-8 sm:mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl transform scale-150"></div>
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <Bot className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4 sm:mb-6 px-4">
                Welcome to Product Manager AI
              </h2>
              
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
                Your senior PM assistant for strategic insights, data-driven recommendations, 
                and actionable frameworks for product success.
              </p>
              
              {/* Enhanced Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12 px-4">
                <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 sm:p-7 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 transition-all duration-500 hover:-translate-y-2 hover:border-blue-200 dark:hover:border-blue-700 cursor-pointer">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Strategic Planning</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    Competitive analysis, market positioning, roadmapping, and business model innovation
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                    <Rocket className="w-4 h-4 mr-2" />
                    Get Started
                  </div>
                </div>
                
                <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 sm:p-7 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-400/10 transition-all duration-500 hover:-translate-y-2 hover:border-purple-200 dark:hover:border-purple-700 cursor-pointer">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">User Research</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    Persona development, journey mapping, interview guides, and behavioral analysis
                  </p>
                  <div className="mt-4 flex items-center text-purple-600 dark:text-purple-400 text-sm font-medium">
                    <Rocket className="w-4 h-4 mr-2" />
                    Get Started
                  </div>
                </div>
                
                <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 sm:p-7 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-green-500/10 dark:hover:shadow-green-400/10 transition-all duration-500 hover:-translate-y-2 hover:border-green-200 dark:hover:border-green-700 cursor-pointer">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Data Analytics</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    KPI frameworks, cohort analysis, A/B testing, and performance metrics
                  </p>
                  <div className="mt-4 flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                    <Rocket className="w-4 h-4 mr-2" />
                    Get Started
                  </div>
                </div>
                
                <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 sm:p-7 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-orange-500/10 dark:hover:shadow-orange-400/10 transition-all duration-500 hover:-translate-y-2 hover:border-orange-200 dark:hover:border-orange-700 cursor-pointer">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Execution</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    Feature prioritization, sprint planning, resource allocation, and go-to-market
                  </p>
                  <div className="mt-4 flex items-center text-orange-600 dark:text-orange-400 text-sm font-medium">
                    <Rocket className="w-4 h-4 mr-2" />
                    Get Started
                  </div>
                </div>
              </div>
              
              {/* Enhanced Pro Tip Section */}
              <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 sm:p-8 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 mx-4 mb-6 shadow-xl backdrop-blur-sm">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="pt-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
                    Pro Tip
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    Try the PM Features in the sidebar for guided assistance, 
                    or start a conversation with specific questions about your product challenges.
                  </p>
                </div>
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
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
      <MessageList conversation={currentConversation} />
      <MessageInput conversationId={currentConversation.id} />
    </div>
  );
};