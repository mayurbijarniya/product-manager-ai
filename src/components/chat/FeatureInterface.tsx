import React, { useState } from 'react';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';
import { useAppStore } from '../../stores/appStore';
import { quickActions } from '../../data/quickActions';
import { Target, TrendingUp, Users, BarChart3, Lightbulb } from 'lucide-react';

interface FeatureInterfaceProps {
  featureId: string;
}

const getFeatureIcon = (category: string) => {
  switch (category) {
    case 'strategy': return Target;
    case 'execution': return TrendingUp;
    case 'research': return Users;
    case 'analytics': return BarChart3;
    default: return Lightbulb;
  }
};

const getFeatureColor = (category: string) => {
  switch (category) {
    case 'strategy': return 'text-blue-600 dark:text-blue-400';
    case 'execution': return 'text-green-600 dark:text-green-400';
    case 'research': return 'text-purple-600 dark:text-purple-400';
    case 'analytics': return 'text-orange-600 dark:text-orange-400';
    default: return 'text-gray-600 dark:text-gray-400';
  }
};

const getFeatureGradient = (category: string) => {
  switch (category) {
    case 'strategy': return 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20';
    case 'execution': return 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20';
    case 'research': return 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20';
    case 'analytics': return 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20';
    default: return 'from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20';
  }
};

export const FeatureInterface: React.FC<FeatureInterfaceProps> = ({ featureId }) => {
  const { createConversation, setCurrentConversation, getCurrentConversation } = useAppStore();
  const [hasStarted, setHasStarted] = useState(false);
  
  const feature = quickActions.find(action => action.id === featureId);
  
  if (!feature) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Feature not found</p>
      </div>
    );
  }

  const IconComponent = getFeatureIcon(feature.category);
  const iconColor = getFeatureColor(feature.category);
  const gradientColor = getFeatureGradient(feature.category);

  const handleStartChat = () => {
    // Create a new conversation for this feature
    const conversationId = createConversation(feature.title);
    setHasStarted(true);
  };

  // If chat has started, show the conversation
  const currentConversation = getCurrentConversation();
  if (hasStarted && currentConversation) {
    return (
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        <MessageList conversation={currentConversation} />
        <MessageInput conversationId={currentConversation.id} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-2xl w-full">
        <div className={`bg-gradient-to-br ${gradientColor} p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg`}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <IconComponent className={`w-8 h-8 ${iconColor}`} />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {feature.title}
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {feature.description}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
              How to Use This Feature
            </h3>
            
            {feature.id === 'feature-prioritization' && (
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <p><strong>What to provide:</strong> List your potential features and any context about your goals or constraints.</p>
                <p><strong>Example:</strong> "For a fitness app, prioritize: social sharing, new workout types, and a diet tracker."</p>
                <p><strong>You'll get:</strong> RICE scoring matrix, prioritization recommendations, and implementation roadmap.</p>
              </div>
            )}
            
            {feature.id === 'competitive-analysis' && (
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <p><strong>What to provide:</strong> Your industry, product category, or specific competitors you want to analyze.</p>
                <p><strong>Example:</strong> "Analyze the project management software market including Asana, Monday, and Notion."</p>
                <p><strong>You'll get:</strong> Competitive matrix, positioning analysis, and strategic recommendations.</p>
              </div>
            )}
            
            {feature.id === 'user-persona' && (
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <p><strong>What to provide:</strong> Your product type, target market, or existing user research data.</p>
                <p><strong>Example:</strong> "Create personas for a B2B SaaS tool targeting small business owners."</p>
                <p><strong>You'll get:</strong> Detailed personas, behavioral insights, and journey mapping.</p>
              </div>
            )}
            
            {feature.id === 'kpi-dashboard' && (
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <p><strong>What to provide:</strong> Your business type, key objectives, or current metrics you're tracking.</p>
                <p><strong>Example:</strong> "Design KPI dashboard for an e-commerce platform focused on growth."</p>
                <p><strong>You'll get:</strong> Metric hierarchy, dashboard design, and measurement framework.</p>
              </div>
            )}
            
            {!['feature-prioritization', 'competitive-analysis', 'user-persona', 'kpi-dashboard'].includes(feature.id) && (
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <p><strong>What to provide:</strong> Context about your product, business, or specific challenge you're facing.</p>
                <p><strong>You'll get:</strong> Strategic analysis, actionable recommendations, and implementation guidance.</p>
              </div>
            )}
          </div>

          <button
            onClick={handleStartChat}
            className={`w-full py-4 px-6 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
          >
            Start {feature.title} Analysis
          </button>
        </div>
      </div>
    </div>
  );
};