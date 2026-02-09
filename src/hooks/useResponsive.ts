import { useState, useEffect } from 'react';

export type BreakpointSize = 'mobile' | 'tablet' | 'desktop';

/**
 * ブレークポイント定義
 * - モバイル: 〜767px（スマートフォン）
 * - タブレット: 768px〜1279px（タブレット）
 * - デスクトップ: 1280px〜（PC）
 */
const BREAKPOINTS = {
  mobile: 768,  // モバイル/タブレットの境界
  tablet: 1280, // タブレット/デスクトップの境界
} as const;

/**
 * レスポンシブデザインのためのブレークポイントを監視するカスタムフック
 * 
 * 責務:
 * - ウィンドウ幅の変化を監視し、現在のブレークポイントを判定
 * - 768px未満: モバイル
 * - 768px以上1280px未満: タブレット
 * - 1280px以上: デスクトップ
 * 
 * 戻り値:
 * - breakpoint: 現在のブレークポイント（'mobile' | 'tablet' | 'desktop'）
 * - isMobile, isTablet, isDesktop: 各デバイスタイプの判定フラグ
 */
export const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState<BreakpointSize>('desktop');

  useEffect(() => {
    /**
     * ブレークポイント判定ロジック
     * - 768px未満: モバイル（スマートフォン向け、ハンバーガーメニュー）
     * - 768px以上1280px未満: タブレット（矢印アイコン、オーバーレイ型メニュー）
     * - 1280px以上: デスクトップ（矢印アイコン、プッシュ型メニュー）
     */
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < BREAKPOINTS.mobile) {
        setBreakpoint('mobile');
      } else if (width < BREAKPOINTS.tablet) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    // 初期化時にブレークポイントを判定
    handleResize();

    // ウィンドウリサイズイベントを監視
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
  };
};
