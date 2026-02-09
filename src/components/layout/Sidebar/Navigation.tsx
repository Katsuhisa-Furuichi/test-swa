import React, { useState, useEffect } from 'react';
import type { ConversationItem } from '../../../types/navigation';
import { navigationMenuItems } from '../../../types/navigation';
import { SerendieSymbol } from '@serendie/symbols';
import { IconButton, DropdownMenu, List, ListItem } from '@serendie/ui';
import styles from './Navigation.module.css';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
  selectedKnowledgeId?: string;
  onKnowledgeSelect: (id: string) => void;
  isDesktop: boolean;
}

/**
 * Navigation sidebar component
 * 
 * オーバーレイ表示制御:
 * - モバイル/タブレット（〜1279px）: オーバーレイを表示（半透明の背景、クリックで閉じる）
 * - デスクトップ（1280px〜）: オーバーレイなし
 * 
 * CSS class動的適用ロジック:
 * - containerDesktop/containerMobile: デバイスタイプに応じたスタイル
 * - collapsed/collapsedMobile: 閉じている状態のスタイル
 * - overlayVisible: オーバーレイの表示状態
 * 
 * アニメーション:
 * - モバイル/タブレット: 左からスライドイン（transform: translateX、0.3秒）
 * - デスクトップ: 幅の変化（width: 0px → 240px、0.3秒）
 */
export const Navigation: React.FC<NavigationProps> = ({
  isOpen,
  onClose,
  selectedKnowledgeId,
  onKnowledgeSelect,
  isDesktop,
}) => {
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    // セッションデータのロード処理
    const timer = setTimeout(() => setLoadingComplete(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMenuAction = (itemId: string, details: { value: string }) => {
    console.log('Menu action:', details.value, 'for item:', itemId);
  };

  /**
   * 会話選択時の条件付きクローズ処理
   * 
   * デスクトップ（1280px〜）:
   * - 会話を選択してもナビゲーションメニューは開いたまま
   * - 両方のエリア（メニューとコンテンツ）を同時に操作可能
   * 
   * モバイル/タブレット（〜1279px）:
   * - 会話を選択すると自動的にナビゲーションメニューを閉じる
   * - オーバーレイ型のため、メインコンテンツに集中
   */
  const handleKnowledgeSelect = (id: string) => {
    onKnowledgeSelect(id);
    // モバイル/タブレットでは自動的に閉じる
    if (!isDesktop) {
      onClose();
    }
  };

  const conversationItems: ConversationItem[] = Array.from({ length: 7 }, (_, i) => ({
    id: `knowledge-${i + 1}`,
    title: '一般知識',
  }));

  return (
    <>
      {/**
       * オーバーレイ表示制御
       * - モバイル/タブレット（〜1279px）のみ表示
       * - 半透明の黒い背景
       * - クリックするとナビゲーションメニューを閉じる
       * - デスクトップ（1280px〜）では表示されない
       */}
      {!isDesktop && (
        <div
          className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
          onClick={onClose}
          aria-label="サイドバーを閉じる"
        />
      )}
      
      {/**
       * ナビゲーションメニューコンテナ
       * 
       * CSS class動的適用ロジック:
       * - containerDesktop: デスクトップ用スタイル（プッシュ型、幅変化）
       * - containerMobile: モバイル/タブレット用スタイル（オーバーレイ型、スライドイン）
       * - collapsed: デスクトップ閉じ状態（width: 0px）
       * - collapsedMobile: モバイル/タブレット閉じ状態（transform: translateX(-240px)）
       */}
      <div 
        className={[
          styles.container,
          isDesktop ? styles.containerDesktop : styles.containerMobile,
          !isOpen && (isDesktop ? styles.collapsed : styles.collapsedMobile)
        ].filter(Boolean).join(' ')}
      >
      {/* Header - Toolbar */}
      <div className={styles.header}>
        <IconButton
          className={styles.closeNavButton}
          icon={<SerendieSymbol name="collapse-left" width={24} height={24} />}
          shape="rectangle"
          styleType="ghost"
          onClick={onClose}
          title="サイドバーを閉じる"
        />
        {/* TODO: SerendieUI アイコンの構造的制約
          * 現在の問題点:青字のアイコン背景だとアイコンの実践が黒で見えづらい。白に変更できない
          */}
        <IconButton
          className={styles.newChatButton}
          icon={<SerendieSymbol name="compose" width={24} height={24} />}
          shape="rectangle"
          onClick={() => console.log('Compose clicked')}
          title="新しい会話を開始"
        />
      </div>

      {/* Link List */}
      <div className={styles.linkList}>
        {navigationMenuItems.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.menuItem}
          >
            <span>{item.iconName && <SerendieSymbol name={item.iconName as any} />}</span>
            <span className={styles.menuItemText}>{item.label}</span>
          </a>
        ))}
      </div>

      {/* Chat List */}
      {loadingComplete && (
        <div className={styles.chatList}>
          <div className={styles.chatListHeader}>会話履歴</div>
          
          {/* TODO: SerendieUI List/ListItemコンポーネントの構造的制約
           * 
           * 現在の問題点:
           * 1. ListItemは<li>要素を生成し、childrenを受け入れない仕様
           * 2. ListItemとDropdownMenuを横並び配置するには、以下の構造が必要:
           *    <List>
           *      <div className="container">  // 問題: ul直下のdivは無効なHTML
           *        <ListItem />                // <li>を生成
           *        <DropdownMenu />
           *      </div>
           *    </List>
           * 3. 上記は無効なHTML構造（ul > div > li）となり、CSSが正しく適用されない
           * 
           * 根本原因:
           * - ListItemコンポーネントは単純なテキスト表示専用で設計されている
           * - 複雑なレイアウト（横並び配置、内部ボタン追加）には対応していない
           * - Ark UIベースのため、<li>要素の構造変更ができない
           * 
           * 期待される表示（参考: Ref/css/ChatPane.razor.css）:
           * - テキストとDropdownMenuを横並び配置（152px + 32px幅）
           * - 未ホバー時はDropdownMenuを非表示（opacity: 0）
           * - テキストは省略表示（text-overflow: ellipsis）+ ツールチップ
           * - ホバー時のみDropdownMenuを表示（background-color: tertiary）
           * 
           * 解決策の選択肢:
           * A. カスタムHTML実装（<div>ベース）に切り替え
           * B. SerendieUIにListItem拡張機能を要求（children対応）
           * C. 別のSerendieUIコンポーネントを調査（Accordion, Menu等）
           */}
          <div className={styles.chatListItems}>
            <List className={styles.listItemWrapper}>
              {conversationItems.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.listItemContainer} ${selectedKnowledgeId === item.id ? styles.selected : ''}`}
                >
                  <ListItem
                    title={item.title}
                    selected={selectedKnowledgeId === item.id}
                    onClick={() => handleKnowledgeSelect(item.id)}
                  />
                  <div
                    className={styles.menuButton}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu
                      styleType="iconButton"
                      icon={<SerendieSymbol name="more-horizontal" />}
                      title="メニュー"
                      items={[
                        { value: 'rename', label: '名前を変更する', icon: <SerendieSymbol name="edit" /> },
                        { value: 'delete', label: '削除する', icon: <SerendieSymbol name="trash" /> },
                      ]}
                      onSelect={(details: { value: string }) => handleMenuAction(item.id, details)}
                    />
                  </div>
                </div>
              ))}
            </List>
          </div>
        </div>
      )}
      </div>
    </>
  );
};
