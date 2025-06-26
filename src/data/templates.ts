import type { Template } from '../types';

export const templates: Template[] = [
  {
    id: 'market-entry-analysis',
    name: 'Market Entry Analysis',
    description: 'Comprehensive analysis for entering a new market',
    category: 'strategy',
    prompt: `As Marcus Chen, analyze the market entry opportunity for {PRODUCT} in the {INDUSTRY} industry.

## Executive Summary
Provide a strategic overview of the market entry opportunity.

## Market Analysis
### Market Size & Growth
- Total Addressable Market (TAM): {TAM}
- Serviceable Available Market (SAM): {SAM}
- Growth Rate: {GROWTH_RATE}% annually

### Competitive Landscape
| Competitor | Market Share | Strengths | Weaknesses | Positioning |
|------------|--------------|-----------|------------|-------------|
[Generate competitive analysis]

## Entry Strategy
### Recommended Approach
1. **Phase 1** (Months 1-6): {PHASE_1_STRATEGY}
2. **Phase 2** (Months 7-12): {PHASE_2_STRATEGY}
3. **Phase 3** (Year 2): {PHASE_3_STRATEGY}

### Resource Requirements
- **Investment**: ${INVESTMENT_REQUIRED}
- **Team Size**: {TEAM_SIZE} people
- **Timeline**: {TIMELINE} months to break-even

## Risk Assessment
| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|-------------------|
[Generate risk matrix]

## Success Metrics
- **Primary KPI**: {PRIMARY_KPI}
- **Secondary KPIs**: {SECONDARY_KPIS}
- **Milestones**: {KEY_MILESTONES}`,
    variables: ['PRODUCT', 'INDUSTRY', 'TAM', 'SAM', 'GROWTH_RATE', 'PHASE_1_STRATEGY', 'PHASE_2_STRATEGY', 'PHASE_3_STRATEGY', 'INVESTMENT_REQUIRED', 'TEAM_SIZE', 'TIMELINE', 'PRIMARY_KPI', 'SECONDARY_KPIS', 'KEY_MILESTONES'],
    example: 'Analyze market entry for AI-powered customer service platform in the SaaS industry',
  },
  {
    id: 'product-requirements-document',
    name: 'Product Requirements Document (PRD)',
    description: 'Comprehensive PRD template for new features',
    category: 'execution',
    prompt: `As Marcus Chen, create a comprehensive PRD for {FEATURE_NAME}.

## 1. Executive Summary
**Problem**: {PROBLEM_STATEMENT}
**Solution**: {SOLUTION_OVERVIEW}
**Success Metrics**: {SUCCESS_METRICS}

## 2. Background & Context
### Current State
{CURRENT_STATE_DESCRIPTION}

### Market Opportunity
{MARKET_OPPORTUNITY}

## 3. User Stories & Requirements
### Primary User Stories
- As a {USER_TYPE}, I want to {USER_GOAL} so that {USER_BENEFIT}
- As a {USER_TYPE_2}, I want to {USER_GOAL_2} so that {USER_BENEFIT_2}

### Functional Requirements
| Requirement | Priority | Complexity | Notes |
|-------------|----------|------------|-------|
[Generate requirements table]

### Non-Functional Requirements
- **Performance**: {PERFORMANCE_REQUIREMENTS}
- **Security**: {SECURITY_REQUIREMENTS}
- **Scalability**: {SCALABILITY_REQUIREMENTS}

## 4. Technical Considerations
### Architecture Impact
{ARCHITECTURE_IMPACT}

### Dependencies
{TECHNICAL_DEPENDENCIES}

## 5. Go-to-Market
### Launch Strategy
{LAUNCH_STRATEGY}

### Success Metrics
- **Primary**: {PRIMARY_METRIC}
- **Secondary**: {SECONDARY_METRICS}
- **Leading Indicators**: {LEADING_INDICATORS}

## 6. Timeline & Resources
### Development Timeline
| Phase | Duration | Team | Deliverables |
|-------|----------|------|--------------|
[Generate timeline]

### Resource Requirements
{RESOURCE_REQUIREMENTS}`,
    variables: ['FEATURE_NAME', 'PROBLEM_STATEMENT', 'SOLUTION_OVERVIEW', 'SUCCESS_METRICS', 'CURRENT_STATE_DESCRIPTION', 'MARKET_OPPORTUNITY', 'USER_TYPE', 'USER_GOAL', 'USER_BENEFIT', 'USER_TYPE_2', 'USER_GOAL_2', 'USER_BENEFIT_2', 'PERFORMANCE_REQUIREMENTS', 'SECURITY_REQUIREMENTS', 'SCALABILITY_REQUIREMENTS', 'ARCHITECTURE_IMPACT', 'TECHNICAL_DEPENDENCIES', 'LAUNCH_STRATEGY', 'PRIMARY_METRIC', 'SECONDARY_METRICS', 'LEADING_INDICATORS', 'RESOURCE_REQUIREMENTS'],
    example: 'Create PRD for real-time collaboration feature in project management tool',
  },
  {
    id: 'user-research-study',
    name: 'User Research Study Design',
    description: 'Design comprehensive user research studies',
    category: 'research',
    prompt: `As Marcus Chen, design a user research study for {RESEARCH_TOPIC}.

## Research Objectives
### Primary Questions
1. {PRIMARY_QUESTION_1}
2. {PRIMARY_QUESTION_2}
3. {PRIMARY_QUESTION_3}

### Secondary Questions
- {SECONDARY_QUESTION_1}
- {SECONDARY_QUESTION_2}

## Methodology
### Research Method: {RESEARCH_METHOD}
**Rationale**: {METHOD_RATIONALE}

### Participant Criteria
- **Target Audience**: {TARGET_AUDIENCE}
- **Sample Size**: {SAMPLE_SIZE} participants
- **Screening Criteria**: {SCREENING_CRITERIA}

## Study Design
### Session Structure ({SESSION_DURATION} minutes)
1. **Introduction** (5 min): Welcome, consent, objectives
2. **Background** (10 min): Participant context and current behavior
3. **Core Research** (30 min): {CORE_RESEARCH_ACTIVITIES}
4. **Wrap-up** (10 min): Additional insights and next steps

### Discussion Guide
#### Opening Questions
- {OPENING_QUESTION_1}
- {OPENING_QUESTION_2}

#### Core Questions
- {CORE_QUESTION_1}
- {CORE_QUESTION_2}
- {CORE_QUESTION_3}

#### Closing Questions
- {CLOSING_QUESTION_1}
- {CLOSING_QUESTION_2}

## Analysis Plan
### Data Collection
- Session recordings and transcripts
- Behavioral observations
- Post-session surveys

### Analysis Framework
{ANALYSIS_FRAMEWORK}

### Expected Outputs
- Key findings summary
- User journey insights
- Actionable recommendations
- Design implications

## Timeline & Resources
| Phase | Duration | Activities | Deliverables |
|-------|----------|------------|--------------|
| Planning | 1 week | Finalize guide, recruit participants | Research plan |
| Execution | 2 weeks | Conduct sessions | Raw data |
| Analysis | 1 week | Synthesize findings | Research report |
| Sharing | 1 week | Present to stakeholders | Action plan |

## Success Metrics
- **Participation Rate**: {PARTICIPATION_TARGET}%
- **Data Quality**: Rich insights per session
- **Actionability**: Specific recommendations for product team`,
    variables: ['RESEARCH_TOPIC', 'PRIMARY_QUESTION_1', 'PRIMARY_QUESTION_2', 'PRIMARY_QUESTION_3', 'SECONDARY_QUESTION_1', 'SECONDARY_QUESTION_2', 'RESEARCH_METHOD', 'METHOD_RATIONALE', 'TARGET_AUDIENCE', 'SAMPLE_SIZE', 'SCREENING_CRITERIA', 'SESSION_DURATION', 'CORE_RESEARCH_ACTIVITIES', 'OPENING_QUESTION_1', 'OPENING_QUESTION_2', 'CORE_QUESTION_1', 'CORE_QUESTION_2', 'CORE_QUESTION_3', 'CLOSING_QUESTION_1', 'CLOSING_QUESTION_2', 'ANALYSIS_FRAMEWORK', 'PARTICIPATION_TARGET'],
    example: 'Design user research study for mobile app onboarding optimization',
  },
];