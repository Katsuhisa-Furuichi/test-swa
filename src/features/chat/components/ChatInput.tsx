import React from 'react';
import { TextArea, Button, IconButton } from '@serendie/ui';
import {
  Settings24Regular,
  Attach24Regular,
  Send24Filled,
  BrainCircuit24Regular,
  Search24Regular,
} from '@fluentui/react-icons';
import styles from './ChatInput.module.css';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  placeholder = 'MELGIT-GAIにメッセージを送信する',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <TextArea
          className={styles.textarea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoAdjustHeight
        />
      </div>
      <div className={styles.actions}>
        <div className={styles.leftActions}>
          <IconButton
            icon={<Attach24Regular />}
            shape="rectangle"
            styleType="outlined"
            className={styles.toolbarButton}
            onClick={() => console.log('ファイル添付')}
          />
          <IconButton
            icon={<BrainCircuit24Regular />}
            shape="rectangle"
            styleType="outlined"
            className={styles.toolbarButton}
            onClick={() => console.log('モデル選択')}
          />
          <IconButton
            icon={<Search24Regular />}
            shape="rectangle"
            styleType="outlined"
            className={styles.toolbarButton}
            onClick={() => console.log('検索')}
          />
          <IconButton
            icon={<Settings24Regular />}
            shape="rectangle"
            styleType="outlined"
            className={styles.toolbarButton}
            onClick={() => console.log('設定確認')}
          />
        </div>
        <Button
          size="medium"
          onClick={onSend}
          disabled={!value.trim()}
          className={styles.sendButton}
        >
          <Send24Filled />
        </Button>
      </div>
    </div>
  );
};
