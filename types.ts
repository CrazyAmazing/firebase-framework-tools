export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export enum ModelType {
  CODING = 'gemini-3-pro-preview',
}

export interface TargetConfig {
  ip: string;
  name: string;
  os: 'linux' | 'windows';
}

export type ActiveView = 'landing' | 'tactical' | 'securitybot' | 'enterprise' | 'sentinel' | 'pricing' | 'checkout' | 'data-flow';
