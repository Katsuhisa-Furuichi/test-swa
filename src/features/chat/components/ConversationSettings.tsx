import React, { useState } from 'react';
import { Button } from '@serendie/ui';
import { Edit24Regular } from '@fluentui/react-icons';
import type { ConversationSetting } from '../types/chat.types';
import styles from './ConversationSettings.module.css';

interface ConversationSettingsProps {
  onSettingChange: (setting: ConversationSetting) => void;
}

/**
 * Conversation settings component
 * Allows users to select conversation mode
 */
export const ConversationSettings: React.FC<ConversationSettingsProps> = () => {
  const conversationSettings = [
    { id: 'general', label: '一般的なチャット', value: 'general' },
    { id: 'professional', label: '専門的な相談', value: 'professional' },
    { id: 'creative', label: 'クリエイティブ', value: 'creative' },
  ];

  const [currentSetting] = useState(conversationSettings[0]);

  const handleEdit = () => {
    // TODO: ダイアログを開いて設定を編集
    console.log('会話設定を編集');
  };

  return (
    <div className={styles.settingsSection}>
      <div className={styles.reference}>
        <div>
          <span className={styles.label}>会話設定: </span>
          <span className={styles.value}>{currentSetting.label}</span>
        </div>
        <Button
          className={styles.editButton}
          styleType="ghost"
          onClick={handleEdit}
        >
          <Edit24Regular />
          <span>編集</span>
        </Button>
      </div>
    </div>
  );
};
