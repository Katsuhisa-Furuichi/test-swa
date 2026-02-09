import React from 'react';
import { ChatWelcome } from './ChatWelcome';
import { ConversationSettings } from './ConversationSettings';
import { ChatInput } from './ChatInput';
import type { ConversationSetting } from '../types/chat.types';
import styles from './ChatContainer.module.css';

interface ChatContainerProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onSettingChange: (setting: ConversationSetting) => void;
}

/**
 * Chat container component
 * Integrates welcome message, conversation settings, and chat input
 */
export const ChatContainer: React.FC<ChatContainerProps> = ({
  inputValue,
  onInputChange,
  onSendMessage,
  onSettingChange,
}) => {
  return (
    <>
      <ChatWelcome />
      <ConversationSettings onSettingChange={onSettingChange} />
      <div className={styles.chatSection}>
        <ChatInput
          value={inputValue}
          onChange={onInputChange}
          onSend={onSendMessage}
        />
      </div>
    </>
  );
};
