export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  metadata?: {
    tokens?: number;
    model?: string;
    context?: string;
    charts?: ChartData[];
    tables?: TableData[];
    framework?: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  category?: PMCategory;
}

export type PMCategory = 
  | 'strategy'
  | 'execution'
  | 'research'
  | 'analytics'
  | 'technical'
  | 'stakeholder';

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  category: PMCategory;
  prompt: string;
  icon: string;
  color: string;
}

export interface PMFramework {
  id: string;
  name: string;
  description: string;
  category: PMCategory;
  template: string;
  fields: FrameworkField[];
}

export interface FrameworkField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'textarea';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface ChartData {
  type: 'line' | 'bar' | 'area' | 'pie' | 'scatter' | 'radar' | 'funnel';
  title: string;
  data: any[];
  config: ChartConfig;
}

export interface ChartConfig {
  xAxis?: string;
  yAxis?: string;
  colors?: string[];
  legend?: boolean;
  grid?: boolean;
  tooltip?: boolean;
}

export interface TableData {
  title: string;
  headers: string[];
  rows: string[][];
  sortable?: boolean;
  filterable?: boolean;
}

export interface FileData {
  name: string;
  size: number;
  type: string;
  content: any[];
  processed: boolean;
}

export interface Theme {
  mode: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    accent: string;
    border: string;
    shadow: string;
  };
}

export interface AIResponse {
  content: string;
  metadata?: {
    model: string;
    tokens: number;
    confidence: number;
    context: string;
    suggestions?: string[];
  };
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: PMCategory;
  prompt: string;
  variables: string[];
  example?: string;
}