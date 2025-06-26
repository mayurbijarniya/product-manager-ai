import type { QuickAction } from '../types';

export const quickActions: QuickAction[] = [
  // Strategy
  {
    id: 'competitive-analysis',
    title: 'Competitive Analysis',
    description: 'Analyze competitors and market positioning with strategic recommendations',
    category: 'strategy',
    prompt: `I need you to help me create a comprehensive competitive analysis. Please provide:

## Strategic Assessment
Analyze the competitive landscape and market dynamics

## Competitive Matrix
Create a detailed comparison table with:
- Key competitors and their market positions
- Strengths and weaknesses analysis
- Pricing models and market share
- Product differentiation factors

## Positioning Analysis
- Strategic positioning map
- Market gaps and opportunities
- Competitive advantages to leverage

## Strategic Recommendations
1. **Immediate Actions** (0-30 days)
2. **Short-term Goals** (1-3 months)  
3. **Long-term Vision** (6-12 months)

## Success Metrics
- Primary KPIs for competitive tracking
- Market share targets
- Differentiation metrics

Please ask me about the specific industry, product, or market you'd like me to analyze.`,
    icon: 'Target',
    color: '#2563EB',
  },
  {
    id: 'market-opportunity',
    title: 'Market Opportunity Assessment',
    description: 'Evaluate market size, growth potential, and entry strategies',
    category: 'strategy',
    prompt: `I'll help you conduct a comprehensive market opportunity assessment. I'll analyze:

## Market Landscape
- Total Addressable Market (TAM) analysis
- Serviceable Available Market (SAM) sizing
- Serviceable Obtainable Market (SOM) calculation
- Growth trends and market drivers

## Opportunity Matrix
Evaluate opportunities across multiple dimensions:
- Market size and growth potential
- Competition level and barriers to entry
- ROI potential and timeline to profitability
- Strategic fit with current capabilities

## Strategic Entry Points
- Market entry strategies with risk assessment
- Go-to-market approach recommendations
- Resource requirements and investment needs

## Success Framework
- Key performance indicators
- Milestone tracking
- Risk mitigation strategies

What market or industry would you like me to analyze for opportunities?`,
    icon: 'TrendingUp',
    color: '#059669',
  },
  {
    id: 'business-model-canvas',
    title: 'Business Model Canvas',
    description: 'Design and validate your business model using proven frameworks',
    category: 'strategy',
    prompt: `I'll guide you through creating a comprehensive Business Model Canvas. We'll cover:

## Value Propositions
- Unique value delivered to customers
- Problem-solution fit analysis
- Competitive differentiation

## Customer Segments
- Target customer identification
- Customer persona development
- Market segmentation strategy

## Revenue Streams & Cost Structure
- Revenue model design
- Pricing strategy recommendations
- Cost optimization opportunities

## Key Resources & Activities
- Critical capabilities needed
- Core business processes
- Strategic asset requirements

## Partnerships & Channels
- Key partner ecosystem
- Distribution channel strategy
- Customer acquisition channels

## Validation Framework
- Hypothesis testing approach
- Metrics for model validation
- Iteration and optimization plan

Please describe your business concept or product idea to get started.`,
    icon: 'Grid3X3',
    color: '#7C3AED',
  },
  
  // Execution
  {
    id: 'feature-prioritization',
    title: 'Feature Prioritization',
    description: 'Decide what to build next using proven frameworks like RICE',
    category: 'execution',
    prompt: `I'll help you prioritize features using the RICE framework and other proven methodologies:

## RICE Prioritization Matrix
I'll create a comprehensive scoring system evaluating:
- **Reach**: How many users will this impact?
- **Impact**: How much will this improve key metrics?
- **Confidence**: How confident are we in our estimates?
- **Effort**: What's the development complexity and time?

## Prioritization Framework
- Feature scoring and ranking
- Resource allocation recommendations
- Timeline and dependency mapping
- Risk assessment for each feature

## Strategic Alignment
- Business objective alignment
- User value assessment
- Technical feasibility analysis
- Market timing considerations

## Implementation Roadmap
- Quick wins identification
- Strategic bets evaluation
- Long-term vision alignment
- Success metrics definition

Please provide your list of features or product ideas that need prioritization, along with any business context or constraints.`,
    icon: 'ListOrdered',
    color: '#DC2626',
  },
  {
    id: 'roadmap-timeline',
    title: 'Product Roadmap',
    description: 'Create strategic timelines with dependencies and milestones',
    category: 'execution',
    prompt: `I'll help you build a strategic product roadmap with clear timelines and dependencies:

## Roadmap Strategy
- Vision and strategic objectives
- Key themes and initiatives
- Success criteria definition

## Timeline Planning
Quarterly breakdown with:
- Major milestones and deliverables
- Resource requirements and team allocation
- Dependencies and critical path analysis
- Risk factors and mitigation strategies

## Execution Framework
- Sprint planning integration
- Stakeholder communication plan
- Progress tracking mechanisms
- Adaptation and iteration process

## Success Metrics
- Leading and lagging indicators
- Milestone achievement tracking
- Business impact measurement
- Team velocity and capacity planning

## Risk Management
- Potential blockers identification
- Contingency planning
- Resource constraint management
- Market timing considerations

What product, feature set, or initiative would you like me to help you roadmap?`,
    icon: 'Map',
    color: '#059669',
  },
  {
    id: 'sprint-planning',
    title: 'Sprint Planning',
    description: 'Optimize agile sprints with capacity planning and story estimation',
    category: 'execution',
    prompt: `I'll help you optimize your sprint planning with data-driven capacity planning:

## Sprint Strategy
- Sprint goal definition and alignment
- Success criteria and acceptance criteria
- Stakeholder expectation management

## Capacity Planning
- Team velocity analysis
- Available capacity calculation
- Skill set and workload distribution
- Buffer time for unknowns

## Story Breakdown
- User story refinement
- Story point estimation
- Dependency identification
- Acceptance criteria definition

## Risk Assessment
- Sprint risks and mitigation strategies
- Scope adjustment recommendations
- Quality assurance planning
- Technical debt considerations

## Success Framework
- Sprint metrics and tracking
- Daily standup optimization
- Retrospective planning
- Continuous improvement process

What's your current sprint goal, team composition, and any specific challenges you're facing?`,
    icon: 'Clock',
    color: '#F59E0B',
  },
  
  // Research
  {
    id: 'user-persona',
    title: 'User Persona Development',
    description: 'Create detailed user personas with behavioral insights and needs analysis',
    category: 'research',
    prompt: `I'll help you create comprehensive user personas based on research and behavioral insights:

## Persona Development Framework
- Demographics and psychographics
- Goals, motivations, and pain points
- Behavioral patterns and preferences
- Technology adoption and usage patterns

## Research-Based Insights
- User interview synthesis
- Survey data analysis
- Behavioral analytics interpretation
- Market research integration

## Journey Mapping
- Touchpoint identification
- Emotional journey analysis
- Pain point and opportunity mapping
- Experience optimization recommendations

## Persona Validation
- Research methodology recommendations
- Validation metrics and criteria
- Continuous persona refinement
- Stakeholder alignment strategies

## Product Implications
- Feature prioritization impact
- Design and UX considerations
- Marketing and messaging alignment
- Success metrics definition

What product, user base, or market segment would you like me to help you research and develop personas for?`,
    icon: 'Users',
    color: '#8B5CF6',
  },
  {
    id: 'customer-journey',
    title: 'Customer Journey Mapping',
    description: 'Map touchpoints and identify optimization opportunities across the user experience',
    category: 'research',
    prompt: `I'll help you map the complete customer journey to identify optimization opportunities:

## Journey Framework
- End-to-end experience mapping
- Touchpoint identification and analysis
- Emotional journey tracking
- Pain point and friction analysis

## Multi-Channel Analysis
- Digital and physical touchpoints
- Cross-channel experience consistency
- Channel preference and behavior
- Omnichannel optimization opportunities

## Moment of Truth Identification
- Critical decision points
- High-impact interactions
- Emotional peaks and valleys
- Conversion and retention drivers

## Optimization Strategy
- Quick wins and immediate improvements
- Medium-term experience enhancements
- Long-term strategic initiatives
- Resource allocation recommendations

## Success Measurement
- Journey metrics and KPIs
- Customer satisfaction tracking
- Conversion and retention analysis
- ROI of experience improvements

What customer journey, product experience, or service interaction would you like me to help you analyze and optimize?`,
    icon: 'Route',
    color: '#06B6D4',
  },
  {
    id: 'interview-guide',
    title: 'User Research Interview Guide',
    description: 'Generate structured questions for effective user research and insights gathering',
    category: 'research',
    prompt: `I'll help you create a comprehensive user interview guide to gather actionable insights:

## Research Objectives
- Primary research questions definition
- Success criteria and outcomes
- Hypothesis validation framework
- Insight synthesis planning

## Interview Structure
- Opening and rapport building
- Background and context gathering
- Core research exploration
- Wrap-up and next steps

## Question Framework
- Behavioral questions ("Tell me about the last time...")
- Contextual inquiries ("Walk me through your process...")
- Evaluative questions ("How do you currently...")
- Hypothetical scenarios and reactions

## Research Best Practices
- Bias avoidance techniques
- Active listening strategies
- Follow-up question guidance
- Note-taking and recording tips

## Analysis Planning
- Data synthesis methodology
- Insight categorization framework
- Actionable recommendation development
- Stakeholder communication strategy

What research topic, product area, or user behavior would you like me to help you investigate through user interviews?`,
    icon: 'MessageSquare',
    color: '#EF4444',
  },
  
  // Analytics
  {
    id: 'kpi-dashboard',
    title: 'KPI Dashboard Design',
    description: 'Design metrics dashboards with leading and lagging indicators for data-driven decisions',
    category: 'analytics',
    prompt: `I'll help you design a comprehensive KPI dashboard that drives actionable insights:

## Dashboard Strategy
- Business objectives alignment
- Key questions the dashboard answers
- Audience and use case definition
- Success criteria for the dashboard

## Metric Hierarchy
- North Star metric identification
- Primary KPI selection and definition
- Secondary metrics and context
- Leading indicator identification

## Dashboard Design
- Layout and visualization recommendations
- Real-time vs. batch data considerations
- Mobile and desktop optimization
- User experience and accessibility

## Action Framework
- Alert and notification systems
- Drill-down capabilities
- Comparative analysis features
- Trend identification and forecasting

## Implementation Plan
- Data source integration
- Technical requirements
- Rollout and training strategy
- Maintenance and iteration process

What business area, product metrics, or team performance would you like me to help you track and measure?`,
    icon: 'BarChart3',
    color: '#059669',
  },
  {
    id: 'cohort-analysis',
    title: 'Cohort Analysis',
    description: 'Analyze user retention and behavior patterns over time for growth insights',
    category: 'analytics',
    prompt: `I'll help you build a cohort analysis to understand user retention and behavior patterns:

## Cohort Framework
- Cohort definition and segmentation
- Time period and granularity selection
- Behavioral event identification
- Retention metric definition

## Analysis Structure
- Cohort table creation and interpretation
- Retention curve analysis
- Behavioral pattern identification
- Seasonal and trend analysis

## Insight Generation
- Power user characteristic identification
- Churn prediction and early warning signals
- Feature adoption impact analysis
- Product-market fit indicators

## Action Planning
- Retention optimization strategies
- Re-engagement campaign design
- Product improvement recommendations
- Growth lever identification

## Success Measurement
- Cohort health monitoring
- Improvement tracking over time
- Benchmark comparison
- ROI of retention initiatives

What user behavior, product feature, or retention challenge would you like me to help you analyze through cohort analysis?`,
    icon: 'TrendingUp',
    color: '#7C3AED',
  },
  {
    id: 'ab-test-planner',
    title: 'A/B Test Planning',
    description: 'Design statistically significant experiments with clear hypotheses and success criteria',
    category: 'analytics',
    prompt: `I'll help you design a robust A/B test with clear hypotheses and statistical rigor:

## Experiment Design
- Hypothesis formulation and validation
- Success criteria definition
- Test variant design and rationale
- Expected outcome prediction

## Statistical Framework
- Sample size calculation
- Statistical significance requirements
- Test duration and timing
- Minimum detectable effect sizing

## Implementation Planning
- Test setup and configuration
- Audience segmentation and targeting
- Quality assurance and validation
- Monitoring and alert systems

## Analysis Strategy
- Primary and secondary metrics
- Guardrail metrics and safety checks
- Statistical analysis methodology
- Result interpretation framework

## Risk Management
- Downside protection measures
- Early stopping criteria
- Rollback procedures
- Stakeholder communication plan

What feature, experience, or hypothesis would you like me to help you test through A/B experimentation?`,
    icon: 'FlaskConical',
    color: '#F59E0B',
  },
];