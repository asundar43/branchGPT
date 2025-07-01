export const DEFAULT_CHAT_MODEL: string = 'chat-model-gpt41';

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
    id: 'chat-model-gpt41',
    name: 'GPT-4.1',
    description: 'Most capable model for complex tasks and detailed analysis',
    category: 'General Purpose',
    freeTrialAvailable: true,
    isPremium: false,
  },
  // Research & Analysis Models
  {
    id: 'chat-model-sonar',
    name: 'Sonar',
    description: 'Balanced performance for research and analysis',
    category: 'Research & Analysis',
    freeTrialAvailable: true,
    isPremium: false,
  },
  {
    id: 'chat-model-sonar-pro',
    name: 'Sonar Pro',
    description: 'Advanced capabilities for deep research and analysis',
    category: 'Research & Analysis',
    freeTrialAvailable: false,
    isPremium: true,
  },
  // Reasoning & Logic Models
  {
    id: 'chat-model-o4-mini',
    name: 'o4-mini',
    description: 'Efficient reasoning model for logical problem-solving',
    category: 'Reasoning & Logic',
    freeTrialAvailable: false,
    isPremium: true,
  },
  {
    id: 'chat-model-o3',
    name: 'o3',
    description: 'Classic reasoning model for logical problem-solving',
    category: 'Reasoning & Logic',
    freeTrialAvailable: false,
    isPremium: true,
  },
];
