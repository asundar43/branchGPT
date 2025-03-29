export const DEFAULT_CHAT_MODEL: string = 'chat-model-small';

interface ChatModel {
  id: string;
  name: string;
  description: string;
  category?: string;
  freeTrialAvailable?: boolean;
  isPremium?: boolean;
}

export const chatModels: Array<ChatModel> = [
  // General Purpose Models
  {
    id: 'chat-model-small',
    name: 'GPT-4o Mini',
    description: 'Fast and efficient for everyday tasks and quick responses',
    category: 'General Purpose',
    freeTrialAvailable: true,
    isPremium: false,
  },
  {
    id: 'chat-model-large',
    name: 'GPT-4o',
    description: 'Most capable model for complex tasks and detailed analysis',
    category: 'General Purpose',
    freeTrialAvailable: true,
    isPremium: false,
  },
  {
    id: 'chat-model-gpt45',
    name: 'GPT-4.5 Preview',
    description: 'Enhanced capabilities with improved performance and reasoning',
    category: 'General Purpose',
    freeTrialAvailable: false,
    isPremium: true,
  },
  // Research & Analysis Models
  {
    id: 'chat-model-sonar',
    name: 'Sonar',
    description: 'Balanced performance for research and analysis',
    category: 'Research & Analysis',
    freeTrialAvailable: false,
    isPremium: true,
  },
  {
    id: 'chat-model-sonar-pro',
    name: 'Sonar Pro',
    description: 'Advanced capabilities for deep research and analysis',
    category: 'Research & Analysis',
    freeTrialAvailable: false,
    isPremium: true,
  },
  {
    id: 'chat-model-sonar-deep',
    name: 'Sonar Deep Research',
    description: 'Specialized for in-depth research and comprehensive analysis',
    category: 'Research & Analysis',
    freeTrialAvailable: false,
    isPremium: true,
  },
  // Reasoning & Logic Models
  {
    id: 'chat-model-reasoning',
    name: 'o3-mini-high',
    description: 'Enhanced reasoning capabilities for logical problem-solving',
    category: 'Reasoning & Logic',
    freeTrialAvailable: true,
    isPremium: false,
  },
  {
    id: 'chat-model-grok2',
    name: 'Grok 2',
    description: 'Advanced reasoning and analytical capabilities for complex problem-solving',
    category: 'Reasoning & Logic',
    freeTrialAvailable: false,
    isPremium: true,
  },
];
