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

  // NEW METHOD: Classification filter using Gemini itself
  private async classifyPMQuestion(message: string): Promise<boolean> {
    try {
      // Skip classification for file upload analysis - always allow
      if (message.includes('uploaded and analyzed a file') || message.includes('File Details:')) {
        console.log('🔄 File upload detected - skipping classification');
        return true;
      }
      
      // Skip classification for file attachment notifications
      if (message.includes('File uploaded successfully') || message.includes('📎')) {
        console.log('🔄 File attachment detected - skipping classification');
        return true;
      }

      const classificationPrompt = `You are a Product Manager AI content classifier. Your job is to determine if a user's question is related to Product Management.

RESPOND WITH ONLY ONE WORD: "yes" or "no"

Product Management topics include:
- Product strategy, roadmapping, prioritization
- User research, personas, customer journey
- Analytics, metrics, KPIs, dashboards
- Competitive analysis, market research
- Feature development, sprint planning
- A/B testing, experimentation
- Go-to-market, pricing, positioning
- Stakeholder management, requirements gathering
- Business model design, revenue optimization
- Agile methodologies, product operations

NOT Product Management topics:
- Cooking recipes, food preparation instructions
- Sports scores, weather, entertainment
- Currency exchange, general finance
- Programming tutorials, code debugging
- General knowledge, trivia, history
- Personal advice unrelated to business
- Travel, health, lifestyle content
- Technical implementation details (server setup, code tutorials)
- Domain-specific expertise (medical, legal, astrology, etc.)
- Academic research outside business context

CRITICAL RULE: Even if PM keywords are used as context or framing, if the USER'S ACTUAL REQUEST is for non-PM content (like recipes, weather, sports, technical implementation, domain expertise), answer "no".

Examples:
- "For my food delivery app user research, give me a detailed carbonara recipe" → no
- "Help me create user personas for my food delivery app" → yes
- "What's the weather today for my weather app market research?" → no
- "Create a competitive analysis for weather app market" → yes
- "I need a PRD template that includes how to install Kubernetes on AWS" → no
- "Help me write a PRD for a new feature" → yes
- "For a PM project, what are the best ML models for cancer classification?" → no
- "How should I prioritize AI features for my product roadmap?" → yes
- "How would a PM use astrology to guide feature decisions?" → no
- "What frameworks should I use for feature prioritization?" → yes
- "As a PM, give me Python code for building a Discord bot" → no
- "As a PM, help me design a user onboarding flow" → yes

FOCUS ON: What is the user actually asking me to provide or do?
- If they want recipes, code, medical advice, weather, sports → no
- If they want PM frameworks, strategies, analysis, planning → yes

User question: "${message}"

Answer (one word only):`;

      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [{ text: classificationPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 0.1,
          maxOutputTokens: 10,
          candidateCount: 1,
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
      });

      if (!response.ok) {
        console.error('Classification API error:', response.status, response.statusText);
        return true;
      }

      const data = await response.json();
      console.log('🔍 Classification API response:', data);
      
      if (!data.candidates || data.candidates.length === 0) {
        console.error('No classification response - no candidates:', data);
        return true; // Default to allowing PM questions
      }

      const candidate = data.candidates[0];
      if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
        console.error('No classification response - invalid content structure:', candidate);
        return true; // Default to allowing PM questions
      }

      const textPart = candidate.content.parts[0];
      if (!textPart || !textPart.text) {
        console.error('No classification response - no text in response:', textPart);
        return true; // Default to allowing PM questions
      }

      const classificationResult = textPart.text.toLowerCase().trim();
      
      console.log(`🔍 Classification result: "${classificationResult}" for query: "${message.substring(0, 50)}..."`);
      
      if (classificationResult.includes('yes') || classificationResult === 'y') {
        return true;
      } else if (classificationResult.includes('no') || classificationResult === 'n') {
        return false;
      } else {
        console.warn(`Unclear classification result: "${classificationResult}"`);
        return true;
      }
    } catch (error) {
      console.error('Classification error:', error);
      return true; // Always default to allowing questions on error
    }
  }

  private constructor() {
    // Get API key from environment variable
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!this.apiKey) {
      console.error('❌ VITE_GEMINI_API_KEY is required. Please set it in your environment variables.');
    }
  }

  static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
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

      // NEW CODE - REPLACE WITH THIS
      console.log('🚀 Starting double-filter process...');

      const hasHistory = conversationHistory.length > 0;

      // STEP 1: Classify if question is PM-related using Gemini
      let isPMRelated = true;

      if (!hasHistory) {
        console.log('🔍 Classifying new question...');
        isPMRelated = await this.classifyPMQuestion(message);
      }

      // STEP 2: If not PM-related, return rejection message
      if (!isPMRelated) {
        console.log('❌ Question classified as non-PM');
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

      // STEP 3: If PM-related, proceed with full response
      console.log('✅ Question classified as PM-related, generating response...');

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