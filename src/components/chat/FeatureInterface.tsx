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

export const FeatureInterface: React.FC<FeatureInterfaceProps> = ({ featureId }) => {
  const { createConversation, setCurrentConversation, getCurrentConversation } = useAppStore();
  const [hasStarted, setHasStarted] = useState(false);
  
  const feature = quickActions.find(action => action.id === featureId);
  
  if (!feature) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-dark-primary">
        <p className="text-light-text-muted dark:text-dark-text-muted">Feature not found</p>
      </div>
    );
  }

  const IconComponent = getFeatureIcon(feature.category);

  const handleStartChat = () => {
    // Create a new conversation for this feature
    const conversationId = createConversation(feature.title);
    setHasStarted(true);
  };

  // If chat has started, show the conversation
  const currentConversation = getCurrentConversation();
  if (hasStarted && currentConversation) {
    return (
      <div className="flex-1 flex flex-col bg-white dark:bg-dark-primary">
        <MessageList conversation={currentConversation} />
        <MessageInput conversationId={currentConversation.id} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-white dark:bg-dark-primary p-4 sm:p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-primary-50 dark:bg-primary-900/20 p-6 sm:p-8 rounded-2xl border border-primary-200 dark:border-primary-800 shadow-light-lg dark:shadow-dark-lg">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 bg-white dark:bg-dark-surface rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-light dark:shadow-dark">
              <IconComponent className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            
            <h1 className="text-xl sm:text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
              {feature.title}
            </h1>
            
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-base sm:text-lg">
              {feature.description}
            </p>
          </div>

          <div className="bg-white dark:bg-dark-surface p-4 sm:p-6 rounded-xl border border-light-border dark:border-dark-border mb-6 shadow-light dark:shadow-dark">
            <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-3 flex items-center">
              <Lightbulb className="w-5 h-5 text-warning-light dark:text-warning-dark mr-2" />
              How to Use This Feature
            </h3>
            
            {feature.id === 'feature-prioritization' && (
              <div className="space-y-3 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <p><strong>What to provide:</strong> List your potential features and any context about your goals or constraints.</p>
                <p><strong>Example:</strong> "For a fitness app, prioritize: social sharing, new workout types, and a diet tracker."</p>
                <p><strong>You'll get:</strong> RICE scoring matrix, prioritization recommendations, and implementation roadmap.</p>
              </div>
            )}
            
            {feature.id === 'competitive-analysis' && (
              <div className="space-y-3 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <p><strong>What to provide:</strong> Your industry, product category, or specific competitors you want to analyze.</p>
                <p><strong>Example:</strong> "Analyze the project management software market including Asana, Monday, and Notion."</p>
                <p><strong>You'll get:</strong> Competitive matrix, positioning analysis, and strategic recommendations.</p>
              </div>
            )}
            
            {feature.id === 'user-persona' && (
              <div className="space-y-3 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <p><strong>What to provide:</strong> Your product type, target market, or existing user research data.</p>
                <p><strong>Example:</strong> "Create personas for a B2B SaaS tool targeting small business owners."</p>
                <p><strong>You'll get:</strong> Detailed personas, behavioral insights, and journey mapping.</p>
              </div>
            )}
            
            {feature.id === 'kpi-dashboard' && (
              <div className="space-y-3 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <p><strong>What to provide:</strong> Your business type, key objectives, or current metrics you're tracking.</p>
                <p><strong>Example:</strong> "Design KPI dashboard for an e-commerce platform focused on growth."</p>
                <p><strong>You'll get:</strong> Metric hierarchy, dashboard design, and measurement framework.</p>
              </div>
            )}
            
            {!['feature-prioritization', 'competitive-analysis', 'user-persona', 'kpi-dashboard'].includes(feature.id) && (
              <div className="space-y-3 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <p><strong>What to provide:</strong> Context about your product, business, or specific challenge you're facing.</p>
                <p><strong>You'll get:</strong> Strategic analysis, actionable recommendations, and implementation guidance.</p>
              </div>
            )}
          </div>

          <button
            onClick={handleStartChat}
            className="w-full py-3 sm:py-4 px-6 bg-primary-600 hover:bg-primary-700 dark:bg-primary-400 dark:hover:bg-primary-300 text-white dark:text-dark-primary rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 shadow-light dark:shadow-dark hover:shadow-light-md dark:hover:shadow-dark-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-primary-50 dark:focus:ring-offset-primary-900"
          >
            Start {feature.title} Analysis
          </button>
        </div>
      </div>
    </div>
  );
};