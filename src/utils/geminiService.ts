interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason?: string;
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export class GeminiService {
  private static instance: GeminiService;
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  private constructor() {
    // Get API key from environment variable with fallback
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDgR_xkgaphQWNnF88WHvQ05u_nTluzc7I';
    
    if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      console.warn('⚠️ Using fallback API key. For production, please set VITE_GEMINI_API_KEY in your environment variables.');
    }
  }

  static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  private isPMRelatedQuestion(message: string, hasConversationHistory: boolean = false): boolean {
    const lowerMessage = message.toLowerCase().trim();
    
    // Very short messages that are clearly not PM-related
    if (lowerMessage.length < 3) {
      return false;
    }

    // Obvious non-PM single word or short questions
    const obviousNonPMQuestions = [
      'cricket', 'cricket?', 'football', 'football?', 'soccer', 'basketball', 'tennis',
      'weather', 'temperature', 'rain', 'snow', 'hello', 'hi', 'hey',
      'what is usd to inr', 'usd to inr', 'currency', 'exchange rate',
      'movie', 'film', 'music', 'song', 'game', 'sport', 'food', 'recipe'
    ];

    // Check for exact matches or very similar patterns
    for (const nonPMTopic of obviousNonPMQuestions) {
      if (lowerMessage === nonPMTopic || lowerMessage === nonPMTopic + '?') {
        return false;
      }
    }

    // If there's conversation history, be more lenient but still filter obvious non-PM topics
    if (hasConversationHistory) {
      // Check if it's obviously about sports, entertainment, etc. without any business context
      const nonPMPatterns = [
        /^(what is |tell me about )?(cricket|football|soccer|basketball|tennis|golf)/,
        /^(what is |current |today's )?weather/,
        /^(what is |current )?usd to inr/,
        /^(what is |tell me about )?(movie|film|music|song)/,
        /^(how to cook|recipe for|cooking)/
      ];

      for (const pattern of nonPMPatterns) {
        if (pattern.test(lowerMessage)) {
          return false;
        }
      }

      // Allow most other questions when there's conversation history
      return true;
    }

    // For new conversations, check for PM-related keywords
    const pmKeywords = [
      'product', 'feature', 'roadmap', 'strategy', 'user', 'customer', 'market', 'competitive',
      'analytics', 'metrics', 'kpi', 'prioritize', 'sprint', 'agile', 'stakeholder', 'requirement',
      'persona', 'journey', 'research', 'interview', 'survey', 'cohort', 'retention', 'conversion',
      'ab test', 'experiment', 'hypothesis', 'mvp', 'launch', 'go-to-market', 'gtm', 'pricing',
      'positioning', 'segmentation', 'funnel', 'acquisition', 'engagement', 'churn', 'ltv',
      'business model', 'revenue', 'growth', 'scale', 'optimization', 'framework', 'methodology',
      'backlog', 'epic', 'story', 'acceptance criteria', 'definition of done', 'velocity',
      'burndown', 'retrospective', 'planning', 'estimation', 'scope', 'timeline', 'milestone',
      'deliverable', 'outcome', 'impact', 'value', 'roi', 'success', 'goal', 'objective',
      'vision', 'mission', 'north star', 'okr', 'target', 'benchmark', 'baseline', 'competitor',
      'analysis', 'dashboard', 'app', 'software', 'platform', 'service', 'startup',
      'company', 'business', 'industry', 'build', 'create', 'develop', 'design', 'launch',
      'brand', 'smartphone', 'ecommerce', 'saas', 'b2b', 'b2c', 'startup', 'entrepreneur'
    ];

    // Check if message contains PM keywords
    const hasPMKeywords = pmKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (hasPMKeywords) {
      return true;
    }

    // Check for PM-related question patterns
    const pmQuestionPatterns = [
      /how to (build|create|develop|design|launch|analyze|measure|track|improve|optimize|prioritize)/,
      /what is (product|feature|roadmap|strategy|analytics|metrics|kpi)/,
      /(create|build|design|analyze) (a |an )?(competitive analysis|market research|user persona|feature|product)/,
      /(help me|i want to|i need to) (build|create|develop|design|launch|analyze)/
    ];

    const hasPMQuestionPattern = pmQuestionPatterns.some(pattern => pattern.test(lowerMessage));
    
    if (hasPMQuestionPattern) {
      return true;
    }

    // Default to rejecting unclear questions for new conversations
    return false;
  }

  private getSystemPrompt(): string {
    return `You are a senior Product Manager AI assistant with 10+ years of experience at top tech companies. You maintain conversation context and provide personalized, actionable advice.

PERSONALITY & APPROACH:
- Professional but approachable
- Data-driven and strategic
- Practical and actionable
- Remember previous conversation context
- Build upon earlier discussions
- Be concise but comprehensive

CORE EXPERTISE:
- Product strategy and roadmapping
- Feature prioritization (RICE, Value vs Effort, etc.)
- User research and customer insights
- Market analysis and competitive intelligence
- Product analytics and metrics
- A/B testing and experimentation
- Go-to-market strategies
- Stakeholder management
- Agile/Scrum methodologies

CONVERSATION RULES:
1. ALWAYS maintain context from previous messages
2. Reference earlier points when relevant
3. Build upon previous analysis
4. Ask clarifying questions when needed
5. Provide specific, actionable recommendations
6. Use frameworks and methodologies appropriately
7. Keep responses focused and avoid unnecessary elaboration

RESPONSE STYLE:
- Be concise but comprehensive
- Use bullet points and structured formats when helpful
- Include specific examples when helpful
- Suggest next steps or follow-up actions
- Reference industry best practices
- Avoid overly long responses unless specifically requested

CRITICAL TABLE RULES:
- When asked for tables, ALWAYS provide complete, detailed tables with real data
- Use proper markdown table format with | separators
- Include ALL columns requested (minimum 4-5 columns for competitive analysis)
- Fill every cell with meaningful, specific content - NEVER use placeholder text
- For competitive analysis: Include Competitor Name | Strengths | Weaknesses | Market Position | Key Features
- Always complete the entire table before moving to additional content
- If table is large, break into focused sections but complete each section fully

FORBIDDEN TOPICS:
If asked about non-PM topics (sports, weather, entertainment, currency exchange, etc.), respond ONLY with: "I'm a Product Manager AI assistant. Please ask me questions about product strategy, roadmapping, user research, analytics, or other product management topics."

Remember: You're having an ongoing conversation, not answering isolated questions. Build context and provide increasingly valuable insights as the conversation develops.`;
  }

  private isTableRequest(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    const tableKeywords = [
      'table', 'competitive analysis', 'comparison', 'matrix', 'framework',
      'market research', 'feature comparison', 'competitor', 'analysis',
      'in table format', 'table format', 'create table', 'show table'
    ];
    
    return tableKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  async sendMessage(
    message: string,
    conversationHistory: Array<{ role: string; content: string }> = [],
    onStream?: (chunk: string) => void,
    abortSignal?: AbortSignal
  ): Promise<string> {
    try {
      // Check if request was aborted before starting
      if (abortSignal?.aborted) {
        throw new Error('Request aborted');
      }

      const hasHistory = conversationHistory.length > 0;

      // Check if the question is PM-related
      if (!this.isPMRelatedQuestion(message, hasHistory)) {
        const rejectionMessage = "I'm a Product Manager AI assistant. Please ask me questions about product strategy, roadmapping, user research, analytics, or other product management topics.";
        
        // Simulate streaming for rejection message
        if (onStream) {
          const words = rejectionMessage.split(' ');
          let currentResponse = '';
          
          for (let i = 0; i < words.length; i++) {
            if (abortSignal?.aborted) {
              throw new Error('Request aborted');
            }
            
            currentResponse += (i > 0 ? ' ' : '') + words[i];
            onStream(currentResponse);
            await new Promise(resolve => setTimeout(resolve, 25));
          }
        }
        
        return rejectionMessage;
      }

      // Prepare the conversation context
      const contents = [];

      // Add system prompt as the first message for new conversations
      if (conversationHistory.length === 0) {
        contents.push({
          role: 'user',
          parts: [{ text: this.getSystemPrompt() }]
        });
        contents.push({
          role: 'model',
          parts: [{ text: "Hello! I'm your senior Product Manager AI assistant. I'm here to help you with product strategy, roadmapping, user research, analytics, and all aspects of product management. What product challenge can I help you tackle today?" }]
        });
      }

      // Add conversation history (last 8 messages to manage token usage and prevent context overflow)
      const recentHistory = conversationHistory.slice(-8);
      recentHistory.forEach(msg => {
        if (msg.role === 'user') {
          contents.push({
            role: 'user',
            parts: [{ text: msg.content }]
          });
        } else if (msg.role === 'assistant') {
          contents.push({
            role: 'model',
            parts: [{ text: msg.content }]
          });
        }
      });

      // Determine if this is a table request and adjust configuration accordingly
      const isTableGeneration = this.isTableRequest(message);
      
      // Enhanced message for table requests to force completion
      let enhancedMessage = message;
      if (isTableGeneration) {
        enhancedMessage = `${message}

IMPORTANT: Please provide a COMPLETE table with ALL rows filled out. Do not stop at headers or partial content. Include at least 3-5 competitors/items with detailed information in every column. Complete the entire table before adding any additional commentary.`;
      }

      // Add current message
      contents.push({
        role: 'user',
        parts: [{ text: enhancedMessage }]
      });

      console.log(`🎯 Table request detected: ${isTableGeneration}`);

      const requestBody = {
        contents: contents,
        generationConfig: {
          temperature: 2.0,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
          candidateCount: 1,
          stopSequences: [], // Remove any stop sequences that might interrupt tables
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: abortSignal,
      });

      // Check if request was aborted after fetch
      if (abortSignal?.aborted) {
        throw new Error('Request aborted');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        
        // Handle specific API errors
        if (response.status === 400) {
          throw new Error('Invalid request. Please check your message and try again.');
        } else if (response.status === 401) {
          throw new Error('API key is invalid. Please check your configuration.');
        } else if (response.status === 403) {
          throw new Error('API access forbidden. Please check your API key permissions.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        } else if (response.status >= 500) {
          throw new Error('AI service is temporarily unavailable. Please try again in a moment.');
        }
        
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from AI service. Please try again.');
      }

      let responseText = data.candidates[0].content.parts[0].text;
      const finishReason = data.candidates[0].finishReason;

      // Handle different finish reasons
      if (finishReason === 'MAX_TOKENS') {
        responseText += '\n\n*[Response truncated due to length limit. Please ask for specific details if you need more information.]*';
      } else if (finishReason === 'SAFETY') {
        throw new Error('Response was blocked due to safety concerns. Please rephrase your question.');
      } else if (finishReason === 'RECITATION') {
        throw new Error('Response was blocked due to recitation concerns. Please try a different approach.');
      } else if (finishReason === 'OTHER') {
        // Sometimes the API stops for unknown reasons - this might be the table generation issue
        console.warn('API stopped for unknown reason. Response might be incomplete.');
      }

      // Log token usage for debugging
      if (data.usageMetadata) {
        console.log(`📊 Token usage: ${data.usageMetadata.totalTokenCount} total (${data.usageMetadata.candidatesTokenCount} response)`);
      }

      // Simulate streaming if callback provided
      if (onStream) {
        const words = responseText.split(' ');
        let currentResponse = '';
        
        // Adjust streaming speed based on content length
        const streamDelay = 12;
        
        for (let i = 0; i < words.length; i++) {
          // Check if request was aborted during streaming
          if (abortSignal?.aborted) {
            console.log('Streaming aborted during word processing');
            throw new Error('Request aborted');
          }
          
          currentResponse += (i > 0 ? ' ' : '') + words[i];
          onStream(currentResponse);
          await new Promise(resolve => setTimeout(resolve, streamDelay));
        }
      }

      return responseText;
    } catch (error) {
      if (error instanceof Error && error.message === 'Request aborted') {
        console.log('Request was properly aborted');
        throw error; // Re-throw abort errors
      }
      
      console.error('AI service error:', error);
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      
      // Re-throw known errors
      if (error instanceof Error && (
        error.message.includes('Invalid request') ||
        error.message.includes('API key') ||
        error.message.includes('Rate limit') ||
        error.message.includes('temporarily unavailable') ||
        error.message.includes('safety concerns') ||
        error.message.includes('recitation concerns')
      )) {
        throw error;
      }
      
      // Generic error fallback
      throw new Error('Failed to get response from AI assistant. Please check your connection and try again.');
    }
  }
}

export const geminiService = GeminiService.getInstance();