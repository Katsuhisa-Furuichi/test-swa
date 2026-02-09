import React, { useState } from 'react';
import { Dialog } from '@ark-ui/react';
import { Button, TextField, TextArea, Select } from '@serendie/ui';
import { apiClient } from '../../../lib/api-client';
import styles from './ChatWelcome.module.css';

/**
 * Welcome message component
 * Displays welcome text and feature hints
 */
export const ChatWelcome: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [conversationName, setConversationName] = useState('命名ロボット');
  const [conversationRule, setConversationRule] = useState(
    'あなたはプロのネーミングコンサルタントです。私が製品開発を担当している新製品の名称について、以下の情報に基づいて最適な提案をしてください。提案は、それぞれの名称に対する簡単な説明と、それが製品のどのような側面を表現しているかを添えて複数（例：5〜10案）提示してください。\n\n---\n[製品・補記]'
  );
  const [defaultQuestion, setDefaultQuestion] = useState('');

  const conversationOptions = [
    { value: 'naming-bot', label: '命名ロボット' },
    { value: 'general', label: '一般的なチャット' },
    { value: 'professional', label: '専門的な相談' },
  ];

  const handleSave = async () => {
    try {
      const settings = {
        conversationName,
        conversationRule,
        defaultQuestion,
      };
      
      // プロト実装：Console.logで確認
      console.log('保存するデータ:', settings);
      
      // API呼び出し（プロト版）
      await apiClient.post('/conversation-settings', settings);
      
      setOpen(false);
    } catch (error) {
      console.error('保存に失敗しました:', error);
    }
  };

  return (
    <div className={styles.welcomeSection}>
      <div className={styles.welcomeText}>
        画面左上のリンク集から、
      </div>
      <div className={styles.welcomeText}>
        <span className={styles.highlight}>
          📋[画像生成機能]
        </span>
        を利用できます。
      </div>
      <Button onClick={() => setOpen(true)}>会話設定編集</Button>

      <Dialog.Root open={open} onOpenChange={(details) => setOpen(details.open)}>
        <Dialog.Backdrop className={styles.dialogBackdrop} />
        <Dialog.Positioner className={styles.dialogPositioner}>
          <Dialog.Content className={styles.dialogContent}>
            <Dialog.Title className={styles.dialogTitle}>
              会話設定編集
            </Dialog.Title>
            
            <div className={styles.formSection}>
              <Select
                label="会話一覧"
                placeholder="会話を選択"
                items={conversationOptions}
                defaultValue={['naming-bot']}
              />
              
              <TextField
                label="会話名"
                value={conversationName}
                onChange={(e) => setConversationName(e.target.value)}
                fullWidth
                required
              />
              
              <TextArea
                label="AIとの会話ルール"
                value={conversationRule}
                onChange={(e) => setConversationRule(e.target.value)}
                fullWidth
                required
                autoAdjustHeight
              />
              
              <TextArea
                label="デフォルトの質問内容"
                placeholder="最大入力可能文字数は40000文字です。"
                value={defaultQuestion}
                onChange={(e) => setDefaultQuestion(e.target.value)}
                fullWidth
                autoAdjustHeight
              />
            </div>

            <div className={styles.dialogActions}>
              <Dialog.CloseTrigger asChild>
                <Button>キャンセル</Button>
              </Dialog.CloseTrigger>
              <Button onClick={handleSave}>保存</Button>
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </div>
  );
};
