import React, { useEffect, useState } from 'react';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { loginRequest } from '../../config/authConfig';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  // 開発モード（npm run dev）では認証をスキップ
  const isDevelopment = import.meta.env.DEV;
  const { instance, inProgress, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [authError, setAuthError] = useState<string | null>(null);

  // 開発モードでは認証をバイパスして子コンポーネントを表示
  if (isDevelopment) {
    console.info('開発モード: 認証をスキップしています');
    return <>{children}</>;
  }

  useEffect(() => {
    const handleAuth = async () => {
      if (inProgress !== InteractionStatus.None || isAuthenticated) {
        return;
      }

      if (accounts.length === 0) {
        try {
          console.log('認証を開始します...');
          await instance.loginRedirect(loginRequest);
        } catch (error: any) {
          console.error('認証エラー:', error);
          setAuthError(error.message || '認証に失敗しました');
        }
      } else {
        // 既存のアカウントがある場合、アクティブアカウントを設定
        if (!instance.getActiveAccount()) {
          instance.setActiveAccount(accounts[0]);
        }
      }
    };

    handleAuth();
  }, [instance, inProgress, isAuthenticated, accounts]);

  if (inProgress !== InteractionStatus.None) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        認証中...
      </div>
    );
  }

  if (authError) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '16px',
        color: '#d32f2f',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '20px', fontSize: '48px' }}>⚠️</div>
        <div style={{ marginBottom: '15px', fontSize: '20px', fontWeight: 'bold' }}>
          認証エラー
        </div>
        <div style={{
          background: '#ffebee',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #f8bbd9',
          maxWidth: '400px'
        }}>
          {authError}
        </div>
        <button
          onClick={() => {
            setAuthError(null);
            window.location.reload();
          }}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          再試行
        </button>
      </div>
    );
  }

  if (isAuthenticated && accounts.length > 0) {
    // アクティブアカウントを設定
    if (!instance.getActiveAccount()) {
      instance.setActiveAccount(accounts[0]);
    }
    return <>{children}</>;
  }

  // 認証未完了時の表示
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '18px',
      color: '#666'
    }}>
      認証準備中...
    </div>
  );
};

export default AuthGuard;
