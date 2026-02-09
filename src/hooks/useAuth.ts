import { useMsal, useAccount } from '@azure/msal-react';
import type { AccountInfo } from '@azure/msal-browser';
import { allScopes } from '../config/authConfig';

/**
 * 認証関連のユーティリティフック
 * 
 * サインアウト機能の呼び出し方法：
 * 
 * 1. ボタンから直接呼び出し:
 *    const { logout } = useAuth();
 *    <button onClick={() => logout()}>サインアウト</button>
 * 
 * 2. ドロップダウンリストから呼び出し:
 *    const { logout } = useAuth();
 *    const handleMenuChange = (_event, data) => {
 *      if (data.optionValue === 'logout') {
 *        logout().catch(console.error);
 *      }
 *    };
 *    <Dropdown onOptionSelect={handleMenuChange}>
 *      <Option value="logout">サインアウト</Option>
 *    </Dropdown>
 * 
 * 3. 非同期処理での呼び出し:
 *    const { logout } = useAuth();
 *    const handleAsyncLogout = async () => {
 *      try {
 *        await logout();
 *        // サインアウト成功後の処理
 *      } catch (error) {
 *        // エラーハンドリング
 *      }
 *    };
 */
export const useAuth = () => {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {}) as AccountInfo | null;

 /**
   * サインアウト処理
   * Azure ADからのリダイレクトサインアウトを実行
   * @returns Promise<void>
   * @throws {Error} サインアウト処理中のエラー
   */
  const logout = async () => {
    if (import.meta.env.DEV) {
      // 開発モードではサインアウト処理をスキップ
      return;
    }
    try {
      await instance.logoutRedirect({
        postLogoutRedirectUri: window.location.origin,
        account: account,
      });
    } catch (error) {
      console.error('サインアウトエラー:', error);
      throw error;
    }
  };

  const getAccessToken = async () => {
    if (!account) {
      throw new Error('ユーザーが認証されていません');
    }

    try {
      const response = await instance.acquireTokenSilent({
        scopes: allScopes,
        account,
      });
      return response.accessToken;
    } catch (error) {
      console.error('トークン取得エラー:', error);
      // サイレント取得に失敗した場合はリダイレクトで取得を試行
      return instance.acquireTokenRedirect({
        scopes: allScopes,
        account,
      });
    }
  };

  return {
    account,
    logout,
    getAccessToken,
    isAuthenticated: !!account,
    userName: account?.name || account?.username || '不明',
    userEmail: account?.username || '',
  };
};