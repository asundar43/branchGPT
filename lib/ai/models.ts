export const DEFAULT_CHAT_MODEL: string = 'chat-model-small';

interface ChatModel {
  id: string;
  name: string;
  description: string;
  category?: string;
}

export const chatModels: Array<ChatModel> = [
  // General Purpose Models
  {
    id: 'chat-model-small',
    name: 'GPT-4 Mini',
    description: 'Fast and efficient for everyday tasks and quick responses',
    category: 'General Purpose',
  },
  {
    id: 'chat-model-large',
    name: 'GPT-4',
    description: 'Most capable model for complex tasks and detailed analysis',
    category: 'General Purpose',
  },
  // Research & Analysis Models
  {
    id: 'chat-model-sonar',
    name: 'Sonar',
    description: 'Balanced performance for research and analysis',
    category: 'Research & Analysis',
  },
  {
    id: 'chat-model-sonar-pro',
    name: 'Sonar Pro',
    description: 'Advanced capabilities for deep research and analysis',
    category: 'Research & Analysis',
  },
  {
    id: 'chat-model-sonar-deep',
    name: 'Sonar Deep Research',
    description: 'Specialized for in-depth research and comprehensive analysis',
    category: 'Research & Analysis',
  },
  // Reasoning & Logic Models
  {
    id: 'chat-model-reasoning',
    name: 'O3 Mini with Reasoning',
    description: 'Enhanced reasoning capabilities for logical problem-solving',
    category: 'Reasoning & Logic',
  },
  {
    id: 'chat-model-grok2',
    name: 'Grok 2',
    description: 'Advanced reasoning and analytical capabilities for complex problem-solving',
    category: 'Reasoning & Logic',
  },
];
