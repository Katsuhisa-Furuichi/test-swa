import { useState, useCallback } from 'react';

/**
 * ナビゲーションの開閉状態を管理するカスタムフック
 * 
 * 状態管理の責務:
 * - ナビゲーションメニューの開閉状態（isOpen）
 * - 選択中のメニュー項目ID（selectedMenuId）
 * 
 * 提供する操作:
 * - toggleNavigation: 開閉を切り替え（モバイル/タブレット: ☰/→アイコン、デスクトップ: →アイコン）
 * - openNavigation: 明示的に開く（デスクトップ表示時の自動処理で使用）
 * - closeNavigation: 明示的に閉じる（モバイル/タブレット表示時の自動処理、会話選択時、オーバーレイクリック時）
 * - selectMenu: メニュー項目を選択
 * 
 * @param initialState 初期状態（デフォルト: true）
 */
export const useNavigation = (initialState = true) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [selectedMenuId, setSelectedMenuId] = useState<string | undefined>();

  const toggleNavigation = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const openNavigation = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeNavigation = useCallback(() => {
    setIsOpen(false);
  }, []);

  const selectMenu = useCallback((menuId: string) => {
    setSelectedMenuId(menuId);
  }, []);

  return {
    isOpen,
    selectedMenuId,
    toggleNavigation,
    openNavigation,
    closeNavigation,
    selectMenu,
  };
};
