// Mock AI service - replace with actual API integration
export class AIService {
  private static instance: AIService;
  private apiKey: string | null = null;

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(
    message: string,
    context?: string,
    onStream?: (chunk: string) => void
  ): Promise<string> {
    // Mock streaming response - replace with actual API call
    const mockResponse = this.generateMockResponse(message, context);
    
    if (onStream) {
      // Simulate streaming
      const words = mockResponse.split(' ');
      let currentResponse = '';
      
      for (let i = 0; i < words.length; i++) {
        currentResponse += (i > 0 ? ' ' : '') + words[i];
        onStream(currentResponse);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
    
    return mockResponse;
  }

  private generateMockResponse(message: string, context?: string): string {
    // Enhanced mock responses based on PM context
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('competitive analysis') || lowerMessage.includes('competitor')) {
      return this.getCompetitiveAnalysisResponse();
    }
    
    if (lowerMessage.includes('feature') && (lowerMessage.includes('prioritize') || lowerMessage.includes('rice'))) {
      return this.getFeaturePrioritizationResponse();
    }
    
    if (lowerMessage.includes('roadmap') || lowerMessage.includes('timeline')) {
      return this.getRoadmapResponse();
    }
    
    if (lowerMessage.includes('user') && (lowerMessage.includes('persona') || lowerMessage.includes('research'))) {
      return this.getUserResearchResponse();
    }
    
    if (lowerMessage.includes('metric') || lowerMessage.includes('kpi') || lowerMessage.includes('dashboard')) {
      return this.getMetricsResponse();
    }
    
    // Default PM response
    return this.getDefaultPMResponse(message);
  }

  private getCompetitiveAnalysisResponse(): string {
    return `## Strategic Competitive Analysis

As Marcus Chen, I'll help you conduct a comprehensive competitive analysis. Here's a structured approach:

## Market Positioning Matrix

| Competitor | Market Position | Key Strengths | Weaknesses | Market Share | Pricing Model |
|------------|-----------------|---------------|------------|---------------|---------------|
| Competitor A | Market Leader | Strong brand, wide reach | Limited innovation | 35% | Premium pricing |
| Competitor B | Fast Follower | Agile development | Smaller market presence | 20% | Competitive pricing |
| Competitor C | Niche Player | Specialized features | Limited scalability | 10% | Value pricing |

## Strategic Recommendations

### Immediate Actions (0-30 days)
1. **Competitive Intelligence**: Set up monitoring systems for competitor activities
2. **Feature Gap Analysis**: Identify key differentiators in competitor offerings
3. **Pricing Strategy Review**: Analyze competitor pricing models and value propositions

### Short-term Goals (1-3 months)
1. **Product Differentiation**: Develop unique value propositions
2. **Go-to-Market Strategy**: Position against key competitors
3. **Customer Feedback**: Gather intel on competitor switching patterns

### Long-term Vision (6-12 months)
1. **Market Disruption**: Identify opportunities to reshape the competitive landscape
2. **Strategic Partnerships**: Build alliances to strengthen market position
3. **Innovation Pipeline**: Develop next-generation features to stay ahead

## Success Metrics
- **Primary KPI**: Market share growth vs. top 3 competitors
- **Secondary KPIs**: Feature adoption rates, customer satisfaction vs. competitors
- **Leading Indicators**: Win/loss rates, competitive mentions in sales calls

What specific industry or product category would you like me to analyze in detail?`;
  }

  private getFeaturePrioritizationResponse(): string {
    return `## RICE Feature Prioritization Framework

As Marcus Chen, I'll guide you through a strategic feature prioritization using the RICE methodology:

## RICE Scoring Matrix

| Feature | Reach | Impact | Confidence | Effort | RICE Score | Priority |
|---------|-------|--------|------------|--------|------------|----------|
| Advanced Search | 8000 users | 3.0 | 90% | 3 months | 720 | High |
| Mobile App | 5000 users | 4.0 | 80% | 6 months | 267 | Medium |
| API Integration | 2000 users | 4.5 | 95% | 2 months | 1425 | High |
| Dark Mode | 10000 users | 2.0 | 100% | 1 month | 2000 | High |

## Prioritization Strategy

### Quick Wins (High RICE, Low Effort)
- **Dark Mode**: High user demand, minimal development effort
- **API Integration**: Strong business impact with manageable complexity

### Strategic Bets (High Impact, Higher Effort)
- **Mobile App**: Significant market expansion opportunity
- **Advanced Search**: Core functionality improvement

### Consider Later (Lower RICE scores)
- Features scoring below 200 should be deferred or reconsidered

## Resource Allocation Recommendations

### Q1 Focus (Next 3 months)
1. **Dark Mode** (1 month) - Quick user satisfaction win
2. **API Integration** (2 months) - Strategic business value

### Q2 Planning (Months 4-6)
1. **Advanced Search** (3 months) - Core feature enhancement
2. **Mobile App** (6 months) - Begin development for Q3 launch

## Risk Assessment
- **Technical Debt**: Ensure quick wins don't compromise architecture
- **Resource Constraints**: Monitor team capacity during execution
- **Market Changes**: Re-evaluate priorities quarterly

What specific features would you like me to help prioritize using this framework?`;
  }

  private getRoadmapResponse(): string {
    return `## Strategic Product Roadmap

As Marcus Chen, I'll help you build a comprehensive product roadmap aligned with business objectives:

## Roadmap Overview
**Vision**: Deliver industry-leading user experience while scaling business impact
**Planning Horizon**: 12 months with quarterly reviews

## Quarterly Breakdown

| Quarter | Theme | Key Initiatives | Success Metrics | Dependencies |
|---------|-------|-----------------|-----------------|--------------|
| Q1 2024 | Foundation | Core platform stability, user experience improvements | 95% uptime, 20% faster load times | Engineering team scaling |
| Q2 2024 | Growth | New user acquisition features, onboarding optimization | 30% increase in activation rate | Marketing alignment |
| Q3 2024 | Scale | Advanced features, enterprise capabilities | 50% enterprise revenue growth | Sales team training |
| Q4 2024 | Innovation | Next-gen features, market differentiation | Industry leadership position | R&D investment |

## Detailed Timeline

### Phase 1: Foundation (Months 1-3)
**Epic**: Platform Optimization
- **Week 1-4**: Performance improvements and bug fixes
- **Week 5-8**: User interface redesign
- **Week 9-12**: Advanced analytics implementation

**Key Deliverables**:
- 25% improvement in core metrics
- Redesigned user interface
- Enhanced analytics dashboard

### Phase 2: Growth (Months 4-6)
**Epic**: User Acquisition & Retention
- **Week 13-16**: Onboarding flow optimization
- **Week 17-20**: Referral program launch
- **Week 21-24**: Advanced personalization features

**Key Deliverables**:
- Streamlined onboarding (3-step process)
- Viral coefficient of 1.5+
- Personalized user experiences

### Phase 3: Scale (Months 7-9)
**Epic**: Enterprise Features
- **Week 25-28**: Advanced security and compliance
- **Week 29-32**: Enterprise integrations
- **Week 33-36**: Advanced reporting and analytics

**Key Deliverables**:
- SOC 2 compliance
- 10+ enterprise integrations
- Custom reporting capabilities

### Phase 4: Innovation (Months 10-12)
**Epic**: Next-Generation Platform
- **Week 37-40**: AI/ML feature development
- **Week 41-44**: Advanced automation capabilities
- **Week 45-48**: Future technology integration

**Key Deliverables**:
- AI-powered recommendations
- Workflow automation tools
- Technology leadership position

## Resource Requirements

| Quarter | Engineering | Design | Product | Total FTEs |
|---------|-------------|--------|---------|------------|
| Q1 | 8 | 2 | 1 | 11 |
| Q2 | 10 | 3 | 2 | 15 |
| Q3 | 12 | 3 | 2 | 17 |
| Q4 | 15 | 4 | 3 | 22 |

## Risk Mitigation

### High-Priority Risks
1. **Technical Debt**: Allocate 20% capacity for technical improvements
2. **Market Changes**: Quarterly strategy reviews and pivot capability
3. **Resource Constraints**: Cross-training and flexible team allocation

### Contingency Planning
- **Plan B**: Feature scope reduction if timeline pressure
- **Plan C**: Outsourcing options for non-core features

What specific product or initiative would you like me to create a detailed roadmap for?`;
  }

  private getUserResearchResponse(): string {
    return `## User Research Strategy & Persona Development

As Marcus Chen, I'll guide you through a comprehensive user research approach:

## Primary Persona Profile

### "Strategic Sarah" - Senior Product Manager
**Demographics**:
- Age: 32-38
- Role: Senior PM at mid-size tech company
- Experience: 5-8 years in product management
- Location: Major tech hubs (SF, NYC, Seattle)
- Income: $120K-180K

**Goals & Motivations**:
- Build products that drive business impact
- Advance career through successful product launches
- Stay current with PM best practices and tools
- Lead cross-functional teams effectively

**Pain Points**:
- Information scattered across multiple tools
- Difficulty prioritizing competing demands
- Limited time for strategic thinking
- Stakeholder alignment challenges

### "Analytical Alex" - Data-Driven PM
**Demographics**:
- Age: 28-35
- Role: Product Manager focused on growth/analytics
- Experience: 3-6 years, heavy analytics background
- Tech-savvy with engineering or data science background

**Goals & Motivations**:
- Make data-driven product decisions
- Optimize user funnels and conversion rates
- Build scalable measurement frameworks
- Prove product impact with metrics

**Pain Points**:
- Data quality and accessibility issues
- Complex analysis tools with steep learning curves
- Translating insights into actionable recommendations
- Balancing speed with analytical rigor

## User Journey Mapping

| Stage | Actions | Thoughts | Emotions | Pain Points | Opportunities |
|-------|---------|----------|----------|-------------|---------------|
| **Discovery** | Researching PM tools, reading reviews | "I need something better than spreadsheets" | Frustrated, hopeful | Tool overload, unclear differentiation | Clear value proposition |
| **Evaluation** | Free trial, feature comparison | "Will this actually save me time?" | Cautious optimism | Learning curve concerns | Guided onboarding |
| **Onboarding** | Setup, first project | "How do I get started quickly?" | Eager but overwhelmed | Complexity, unclear next steps | Quick wins, templates |
| **Adoption** | Daily usage, team collaboration | "This is becoming part of my workflow" | Confident, productive | Integration challenges | Seamless workflow |
| **Advocacy** | Recommending to peers | "This transformed how I work" | Enthusiastic | None if successful | Referral programs |

## Research Methodology

### Phase 1: Quantitative Research (2 weeks)
- **Survey**: 500+ product managers
- **Analytics**: Current user behavior analysis
- **Competitive Benchmarking**: Feature usage patterns

### Phase 2: Qualitative Research (3 weeks)
- **User Interviews**: 20 in-depth sessions (60 min each)
- **Observational Studies**: PM workflow shadowing
- **Journey Mapping**: End-to-end experience analysis

### Phase 3: Validation (2 weeks)
- **Prototype Testing**: Key feature validation
- **A/B Testing**: Message and positioning variants
- **Stakeholder Feedback**: Internal alignment sessions

## Interview Guide (Strategic Focus)

### Opening (5 minutes)
- "Tell me about your role and typical day as a PM"
- "What are your biggest challenges right now?"

### Current State (15 minutes)
- "Walk me through your product planning process"
- "What tools do you use for prioritization and roadmapping?"
- "How do you measure product success?"

### Pain Points (20 minutes)
- "Describe the last time you struggled with feature prioritization"
- "What makes stakeholder alignment difficult?"
- "Where do you spend time that doesn't add value?"

### Ideal State (15 minutes)
- "What would your ideal PM workflow look like?"
- "If you had a magic wand, what would you change?"
- "What would make you 50% more effective?"

### Wrap-up (5 minutes)
- "What questions should I have asked but didn't?"
- "Who else should I speak with?"

## Success Metrics
- **Research Quality**: 90%+ completion rate, rich insights per session
- **Actionability**: 5+ specific product improvements identified
- **Validation**: 80%+ agreement on key findings across stakeholders

What specific user research question or persona would you like me to help you explore in depth?`;
  }

  private getMetricsResponse(): string {
    return `## Product Metrics & KPI Dashboard Strategy

As Marcus Chen, I'll help you design a comprehensive metrics framework that drives actionable insights:

## North Star Metric Framework
**Primary North Star**: Monthly Active Product Managers Creating Value
- Combines user engagement with business impact
- Measurable and directly tied to product success
- Aligns team around user-centric outcomes

## Metric Hierarchy

### Tier 1: Business Impact Metrics
| Metric | Definition | Target | Current | Trend | Owner |
|--------|------------|--------|---------|--------|-------|
| **Revenue Growth** | Monthly recurring revenue increase | 20% MoM | 15% | ↗️ | VP Product |
| **Customer LTV** | Lifetime value per customer | $50,000 | $42,000 | ↗️ | Head of Growth |
| **Net Revenue Retention** | Expansion minus churn | 110% | 105% | ↗️ | Customer Success |

### Tier 2: Product Performance Metrics
| Metric | Definition | Target | Current | Trend | Owner |
|--------|------------|--------|---------|--------|-------|
| **Monthly Active Users** | Users active in past 30 days | 10,000 | 8,500 | ↗️ | Product Lead |
| **Feature Adoption Rate** | % users adopting new features | 40% | 35% | ↗️ | Product Managers |
| **User Engagement Score** | Composite engagement metric | 8.0/10 | 7.2/10 | ↗️ | UX Team |

### Tier 3: Leading Indicators
| Metric | Definition | Target | Current | Trend | Owner |
|--------|------------|--------|---------|--------|-------|
| **Weekly Active Users** | Users active in past 7 days | 6,000 | 5,200 | ↗️ | Growth PM |
| **Session Duration** | Average time per session | 25 min | 22 min | ↗️ | Product Analytics |
| **Feature Discovery Rate** | % users finding new features | 60% | 45% | ↗️ | UX Research |

## Dashboard Design

### Executive Dashboard (Monthly Review)
**Audience**: CEO, VP Product, Board
**Key Metrics**:
- Revenue and growth trends
- Customer acquisition and retention
- Market position indicators
- Strategic initiative progress

### Product Team Dashboard (Weekly Review)
**Audience**: Product Managers, Engineering Leads
**Key Metrics**:
- Feature performance and adoption
- User engagement and satisfaction
- Development velocity and quality
- Experiment results and insights

### Operational Dashboard (Daily Monitoring)
**Audience**: Product Analysts, Support Teams
**Key Metrics**:
- System performance and reliability
- User activity and behavior patterns
- Support ticket trends and resolution
- Real-time feature usage

## Measurement Framework

### Cohort Analysis Structure
- **New User Cohorts**: Monthly signup groups
- **Feature Adoption Cohorts**: Users who adopted specific features
- **Engagement Cohorts**: Users by engagement level

### A/B Testing Metrics
- **Primary**: Feature adoption rate
- **Secondary**: User engagement, satisfaction scores
- **Guardrail**: System performance, support tickets

### Customer Journey Metrics
| Stage | Metric | Target | Measurement Method |
|-------|--------|--------|--------------------|
| **Awareness** | Brand mentions, organic traffic | 20% increase | Marketing analytics |
| **Acquisition** | Signup conversion rate | 5% | Product analytics |
| **Activation** | First value achievement | 70% within 7 days | Event tracking |
| **Retention** | 30-day active users | 60% | Cohort analysis |
| **Revenue** | Conversion to paid | 15% | Billing system |
| **Referral** | Viral coefficient | 1.2 | Referral tracking |

## Action Framework

### Weekly Metric Reviews
1. **Performance vs. Targets**: Identify gaps and opportunities
2. **Trend Analysis**: Spot early warning signals
3. **Deep Dives**: Investigate anomalies or significant changes
4. **Action Planning**: Define specific improvement initiatives

### Monthly Strategic Reviews
1. **Goal Alignment**: Ensure metrics support business objectives
2. **Metric Evolution**: Add/remove metrics based on business stage
3. **Benchmarking**: Compare against industry standards
4. **Investment Priorities**: Allocate resources based on metric insights

## Data Quality Standards
- **Accuracy**: 95%+ data reliability
- **Timeliness**: Metrics updated within 24 hours
- **Consistency**: Standard definitions across teams
- **Accessibility**: Self-service analytics for all stakeholders

## Success Metrics for This Framework
- **Decision Speed**: 50% faster data-driven decisions
- **Team Alignment**: 90%+ agreement on priorities
- **Predictive Accuracy**: Early warning system effectiveness
- **ROI**: Measurable business impact from metric-driven initiatives

What specific metrics or dashboard would you like me to help you design in detail?`;
  }

  private getDefaultPMResponse(message: string): string {
    return `## Strategic Product Management Analysis

As Marcus Chen, I'll provide a comprehensive PM perspective on your question.

Based on your inquiry about "${message}", here's my strategic framework:

### Strategic Context
This touches on core product management principles around user value creation and business impact measurement.

### Key Considerations
1. **User-Centric Approach**: How does this align with user needs and pain points?
2. **Business Impact**: What metrics would indicate success?
3. **Technical Feasibility**: Resource requirements and implementation complexity
4. **Market Opportunity**: Competitive landscape and differentiation potential
5. **Timeline & Dependencies**: Critical path and potential blockers

### Recommended Framework
I suggest using a structured approach:
- **Define Success Metrics**: What specific outcomes are we targeting?
- **Validate Assumptions**: How can we test our hypotheses quickly?
- **Prioritize Actions**: What should we do first for maximum impact?
- **Monitor & Iterate**: How will we measure and improve?

### Next Steps
To provide more specific recommendations, I'd like to understand:
1. What's the business context or problem you're trying to solve?
2. Who are the primary users or stakeholders involved?
3. What constraints or requirements should I consider?

Would you like me to dive deeper into any specific aspect of product strategy, execution, research, or analytics?`;
  }
}

export const aiService = AIService.getInstance();