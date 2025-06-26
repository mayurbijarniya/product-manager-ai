import type { PMFramework } from '../types';

export const pmFrameworks: PMFramework[] = [
  {
    id: 'rice-scoring',
    name: 'RICE Scoring',
    description: 'Prioritize features using Reach, Impact, Confidence, and Effort',
    category: 'execution',
    template: `## RICE Prioritization Analysis

### Feature: {featureName}

**Reach**: {reach} users (over {timeframe})
**Impact**: {impact}/5 - {impactDescription}
**Confidence**: {confidence}% - {confidenceReason}
**Effort**: {effort} person-months

**RICE Score**: {riceScore}

### Recommendation
{recommendation}`,
    fields: [
      {
        id: 'featureName',
        label: 'Feature Name',
        type: 'text',
        required: true,
        placeholder: 'Enter feature name',
      },
      {
        id: 'reach',
        label: 'Reach (number of users)',
        type: 'number',
        required: true,
        placeholder: '1000',
      },
      {
        id: 'timeframe',
        label: 'Time Frame',
        type: 'select',
        required: true,
        options: ['month', 'quarter', 'year'],
      },
      {
        id: 'impact',
        label: 'Impact Score (1-5)',
        type: 'select',
        required: true,
        options: ['1', '2', '3', '4', '5'],
      },
      {
        id: 'impactDescription',
        label: 'Impact Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the expected impact...',
      },
      {
        id: 'confidence',
        label: 'Confidence %',
        type: 'number',
        required: true,
        placeholder: '80',
      },
      {
        id: 'confidenceReason',
        label: 'Confidence Reasoning',
        type: 'textarea',
        required: true,
        placeholder: 'Why are you confident in these estimates?',
      },
      {
        id: 'effort',
        label: 'Effort (person-months)',
        type: 'number',
        required: true,
        placeholder: '2',
      },
    ],
  },
  {
    id: 'jobs-to-be-done',
    name: 'Jobs-to-be-Done Canvas',
    description: 'Understand what customers are trying to accomplish',
    category: 'strategy',
    template: `## Jobs-to-be-Done Analysis

### Job Statement
When {situation}, I want to {motivation}, so I can {outcome}.

**Customer**: {customer}
**Job**: {job}
**Context**: {context}

### Job Map
1. **Define** - {defineStep}
2. **Locate** - {locateStep}
3. **Prepare** - {prepareStep}
4. **Confirm** - {confirmStep}
5. **Execute** - {executeStep}
6. **Monitor** - {monitorStep}
7. **Resolve** - {resolveStep}

### Pain Points
- {painPoint1}
- {painPoint2}
- {painPoint3}

### Opportunities
- {opportunity1}
- {opportunity2}
- {opportunity3}`,
    fields: [
      {
        id: 'customer',
        label: 'Customer Segment',
        type: 'text',
        required: true,
        placeholder: 'e.g., Busy professionals',
      },
      {
        id: 'situation',
        label: 'Situation/Context',
        type: 'text',
        required: true,
        placeholder: 'When I am...',
      },
      {
        id: 'motivation',
        label: 'Motivation/Goal',
        type: 'text',
        required: true,
        placeholder: 'I want to...',
      },
      {
        id: 'outcome',
        label: 'Desired Outcome',
        type: 'text',
        required: true,
        placeholder: 'so I can...',
      },
      {
        id: 'defineStep',
        label: 'Define Step',
        type: 'textarea',
        required: true,
        placeholder: 'How do customers define their need?',
      },
      {
        id: 'locateStep',
        label: 'Locate Step',
        type: 'textarea',
        required: true,
        placeholder: 'How do customers find solutions?',
      },
      {
        id: 'prepareStep',
        label: 'Prepare Step',
        type: 'textarea',
        required: true,
        placeholder: 'How do customers prepare to use solutions?',
      },
      {
        id: 'confirmStep',
        label: 'Confirm Step',
        type: 'textarea',
        required: true,
        placeholder: 'How do customers confirm the solution will work?',
      },
      {
        id: 'executeStep',
        label: 'Execute Step',
        type: 'textarea',
        required: true,
        placeholder: 'How do customers use the solution?',
      },
      {
        id: 'monitorStep',
        label: 'Monitor Step',
        type: 'textarea',
        required: true,
        placeholder: 'How do customers monitor results?',
      },
      {
        id: 'resolveStep',
        label: 'Resolve Step',
        type: 'textarea',
        required: true,
        placeholder: 'How do customers resolve issues?',
      },
    ],
  },
];