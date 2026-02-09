import { useState, useCallback } from 'react';
import type { ConversationSetting } from '../types/chat.types';

/**
 * チャット機能の状態を管理するカスタムフック
 */
export const useChat = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedSetting, setSelectedSetting] = useState<ConversationSetting | undefined>();

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const handleSettingChange = useCallback((setting: ConversationSetting) => {
    setSelectedSetting(setting);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;
    
    // TODO: メッセージ送信処理
    console.log('Sending message:', inputValue, 'with setting:', selectedSetting);
    
    // 入力をクリア
    setInputValue('');
  }, [inputValue, selectedSetting]);

  return {
    inputValue,
    selectedSetting,
    handleInputChange,
    handleSettingChange,
    handleSendMessage,
  };
};
