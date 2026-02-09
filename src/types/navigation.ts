/**
 * ナビゲーション関連の型定義
 */

export interface NavigationLinkItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  iconName?: string;
  url?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface ConversationItem {
  id: string;
  title: string;
  onClick?: () => void;
} 

export interface NavigationState {
  isOpen: boolean;
  selectedMenuId?: string;
}

/**
 * ナビゲーションメニュー項目の定義
 * 環境変数から読み取り、未設定の場合はデフォルト値を使用
 */
export const navigationMenuItems: Omit<NavigationLinkItem, 'icon'>[] = [
  {
    id: 'guideline',
    label: import.meta.env.VITE_NAV_GUIDELINE_LABEL || 'ガイドライン(利用時必読)',
    iconName: 'external-link',
    url: import.meta.env.VITE_NAV_GUIDELINE_URL || 'https://mitsubishielectricgroup.sharepoint.com/sites/014693/SitePages/%E3%82%AC%E3%82%A4%E3%83%89%E3%83%A9%E3%82%A4%E3%83%B3.aspx?xsdata=MDV8MDF8fGI0YjU3OTU2MmIzMzRmMTIxMGFmMDhkYjkyMmJhNzQyfGM1YTc1YjYyNGJmZjRjOTZhNzIwNjYyMWNlOTk3OGU1fDB8MHw2MzgyNjQ0ODgzOTA0MzA4OTV8VW5rbm93bnxWR1ZoYlhOVFpXTjFjbWwwZVZObGNuWnBZMlY4ZXlKV0lqb2lNQzR3TGpBd01EQWlMQ0pRSWpvaVYybHVNeklpTENKQlRpSTZJazkwYUdWeUlpd2lWMVFpT2pFeGZRPT18MXxMM1JsWVcxekx6RTVPbEpPT0ZoSWIydFNZVmc0TmxsMVRrSldSMWR3WWpneGMyMXViRE4yYUZkNlRXZDZiRFZEWW1sblVrVXhRSFJvY21WaFpDNTBZV04yTWk5amFHRnVibVZzY3k4eE9UbzRPV1E1TURWalpqYzFPRGcwTlRGbVlURm1aV0ZqT1RRNE1qZ3lPREV5TkVCMGFISmxZV1F1ZEdGamRqSXZiV1Z6YzJGblpYTXZNVFk1TURnMU1qQXpPREE0TUE9PXw5YTkxZmQyMDdjOTQ0NzAzMTBhZjA4ZGI5MjJiYTc0MnxkNDAxMjdmNmM4MmE0MDljYjJhODhkN2E4YTI0ZmE0OQ%3D%3D&sdata=dXc0d0syQzhmSEU5SWVmWXMvd0tQU2dRVjZaemIvY0srNWFxRFhKS3JGMD0%3D'
  },
  {
    id: 'tips',
    label: import.meta.env.VITE_NAV_TIPS_LABEL || '利用方法とTips',
    iconName: 'external-link',
    url: import.meta.env.VITE_NAV_TIPS_URL || 'https://mitsubishielectricgroup.sharepoint.com/sites/014693/SitePages/%E5%88%A9%E7%94%A8%E6%96%B9%E6%B3%95%E3%81%A8Tips.aspx'
  },
  {
    id: 'prompt-plaza',
    label: import.meta.env.VITE_NAV_PROMPT_PLAZA_LABEL || 'みんなのプロンプト広場',
    iconName: 'external-link',
    url: import.meta.env.VITE_NAV_PROMPT_PLAZA_URL || 'https://mitsubishielectricgroup.sharepoint.com/sites/014693/SitePages/%E3%81%BF%E3%82%93%E3%81%AA%E3%81%AE%E3%83%97%E3%83%AD%E3%83%B3%E3%83%97%E3%83%88%E5%BA%83%E5%A0%B4.aspx?csf=1&web=1&e=WuJzIA'
  },
  {
    id: 'image-gen',
    label: import.meta.env.VITE_NAV_IMAGE_GEN_LABEL || 'MELGIT-GAI(画像生成)',
    iconName: 'image',
    url: import.meta.env.VITE_NAV_IMAGE_GEN_URL || 'https://black-flower-03b155f00.3.azurestaticapps.net/'
  },
];
