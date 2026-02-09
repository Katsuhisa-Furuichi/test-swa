import React, { useEffect } from 'react';
import { Navigation } from './Sidebar/Navigation';
import { TopBar } from './TopBar/TopBar';
import { MainFrame } from './MainFrame/MainFrame';
import { ChatContainer } from '../../features/chat/components/ChatContainer';
import { useNavigation } from '../../hooks/useNavigation';
import { useChat } from '../../features/chat/hooks/useChat';
import { useResponsive } from '../../hooks/useResponsive';
import styles from './AppLayout.module.css';

/**
 * Application layout component
 * Manages navigation sidebar, top bar, and main content area
 * Supports responsive design with drawer for mobile devices
 * 
 * レスポンシブ動作:
 * - デスクトップ（1280px〜）: ナビゲーションメニューを自動的に開く（プッシュ型）
 * - モバイル/タブレット（〜1279px）: ナビゲーションメニューを自動的に閉じる（オーバーレイ型）
 */
export const AppLayout: React.FC = () => {
  const { isOpen, toggleNavigation, openNavigation, closeNavigation } = useNavigation();
  const {
    inputValue,
    handleInputChange,
    handleSettingChange,
    handleSendMessage,
  } = useChat();
  const { isDesktop } = useResponsive();
  const [selectedKnowledgeId, setSelectedKnowledgeId] = React.useState<string>();

  /**
   * ブレークポイント切替時の自動開閉処理
   * 
   * デスクトップへの切替（1280px以上）:
   * - ナビゲーションメニューを自動的に開く
   * - プッシュ型レイアウトに切り替わる（メインコンテンツがプッシュされる）
   * - オーバーレイは表示されない
   * 
   * モバイル/タブレットへの切替（〜1279px）:
   * - ナビゲーションメニューを自動的に閉じる
   * - オーバーレイ型レイアウトに切り替わる
   */
  useEffect(() => {
    if (isDesktop) {
      // デスクトップ表示時は自動的に開く
      openNavigation();
    } else {
      // モバイル/タブレット表示時は自動的に閉じる
      closeNavigation();
    }
  }, [isDesktop, openNavigation, closeNavigation]);

  const handleKnowledgeSelect = (id: string) => {
    console.log('Knowledge selected:', id);
    setSelectedKnowledgeId(id);
  };

  return (
    <div className={styles.container}>
      {/* Sidebar Navigation */}
      <Navigation
        isOpen={isOpen}
        onClose={closeNavigation}
        selectedKnowledgeId={selectedKnowledgeId}
        onKnowledgeSelect={handleKnowledgeSelect}
        isDesktop={isDesktop}
      />

      {/* Main Area */}
      <div className={styles.mainArea}>
        <TopBar isOpen={isOpen} onNavigationToggle={toggleNavigation} />
        <MainFrame>
          <ChatContainer
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onSendMessage={handleSendMessage}
            onSettingChange={handleSettingChange}
          />
        </MainFrame>
      </div>
    </div>
  );
};
