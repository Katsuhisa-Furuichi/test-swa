/**
 * チャット関連の型定義
 */

export interface ConversationSetting {
  id: string;
  label: string;
  value: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

export interface ChatInputAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}
