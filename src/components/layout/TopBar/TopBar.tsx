import React from 'react';
import { IconButton, DropdownMenu } from '@serendie/ui';
import { SerendieSymbol } from '@serendie/symbols';
import { useResponsive } from '../../../hooks/useResponsive';
import { navigationMenuItems } from '../../../types/navigation';
import styles from './TopBar.module.css';

interface TopBarProps {
  isOpen: boolean;
  onNavigationToggle: () => void;
}

/**
 * TopBar component
 * 
 * UI仕様（Ref/UI_Spec/UI表示仕様.md準拠）:
 * 
 * ブレークポイント:
 * - モバイル: 〜767px
 * - タブレット: 768px〜1279px
 * - デスクトップ: 1280px〜
 * 
 * 表示要素:
 * - モバイル: ☰アイコン | 新規チャットボタン（右端）
 * - タブレット: →アイコン + 新規チャットボタン | サービス名DropdownMenu | ユーザー情報DropdownMenu
 * - デスクトップ: 
 *   - ナビゲーション閉: →アイコン + 新規チャットボタン | サービス名DropdownMenu | ユーザー情報DropdownMenu
 *   - ナビゲーション開: サービス名DropdownMenu | ユーザー情報DropdownMenu
 * 
 * アイコンサイズ: 24×24px（統一仕様、Navigation.tsx準拠）
 * ボタンサイズ: 32×32px（UI表示仕様準拠）
 * 
 * ツールチップ: title属性でArkUI標準ツールチップを使用（SerendieUI組込）
 * CSS変数: --spacing-sd-*, --colors-sd-* はSerendieUI公式トークン（node_modules/@serendie/ui/dist/styles.css由来）
 */
export const TopBar: React.FC<TopBarProps> = ({ isOpen, onNavigationToggle }) => {
  const { isMobile, isDesktop } = useResponsive();

  const handleMenuSelect = (details: { value: string }) => {
    const item = navigationMenuItems.find(m => m.id === details.value);
    if (item?.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSettingsSelect = (details: { value: string }) => {
    if (details.value === 'edit-settings') {
      // TODO: 会話設定ダイアログを表示
      console.log('会話設定編集を開く');
    }
    // logout は NOP
  };

  return (
    <div className={styles.container}>
      {/**
       * 左エリア（leftArea）の表示制御
       * 
       * 表示条件:
       * - モバイル: 常に表示（☰アイコンのみ）
       * - タブレット: 常に表示（→アイコン + 新規チャットボタン）
       * - デスクトップ: ナビゲーション閉時のみ表示（→アイコン + 新規チャットボタン）
       *               ナビゲーション開時は非表示
       */}
      {(isDesktop ? !isOpen : true) && (
        <div className={styles.leftArea}>
          <IconButton
            icon={<SerendieSymbol name={isMobile ? "menu" : "collapse-right"} width={24} height={24} />}
            shape="circle"
            styleType="ghost"
            onClick={onNavigationToggle}
            title={isMobile ? "メニューを開く" : "サイドバーを開く"}
          />
          {/**
           * 新規チャットボタンの配置
           * - モバイル: 非表示（rightAreaに配置）
           * - タブレット/デスクトップ: leftAreaに表示
           */}
          {!isMobile && (
            <IconButton
              icon={<SerendieSymbol name="compose" width={24} height={24} />}
              shape="rectangle"
              onClick={() => console.log('Compose clicked')}
              title="新しい会話を開始"
            />
          )}
        </div>
      )}

      {/**
       * 中央エリア（centerArea）: サービス名DropdownMenu
       * 
       * 表示条件:
       * - モバイル: 非表示（UI仕様：サービス名コンポーネント不要）
       * - タブレット/デスクトップ: 常に表示
       */}
      {!isMobile && (
          <div className={styles.centerArea}>
          <DropdownMenu
            title="Mallié"
            items={navigationMenuItems.map(item => ({
              value: item.id,
              label: item.label,
              icon: item.iconName ? <SerendieSymbol name={item.iconName as any} width={24} height={24} /> : undefined,
            }))}
            onSelect={handleMenuSelect}
          />
        </div>
      )}

      {/**
       * 右エリア（rightArea）: ユーザー情報 or 新規チャットボタン
       * 
       * 表示内容:
       * - モバイル: 新規チャットボタン
       * - タブレット/デスクトップ: ユーザー情報DropdownMenu
       */}
      <div className={styles.rightArea}>
        {isMobile ? (
          <IconButton
            icon={<SerendieSymbol name="compose" width={24} height={24} />}
            shape="rectangle"
            onClick={() => console.log('Compose clicked')}
            title="新しい会話を開始"
          />
        ) : (
          <DropdownMenu
            title="<未連携>ユーザー情報システムID"
            items={[
              { value: 'edit-settings', label: '会話設定編集', icon: <SerendieSymbol name="edit" width={24} height={24} /> },
              { value: 'logout', label: 'ログアウト', icon: <SerendieSymbol name="logout" width={24} height={24} /> },
            ]}
            onSelect={handleSettingsSelect}
          />
        )}
      </div>
    </div>
  );
};
