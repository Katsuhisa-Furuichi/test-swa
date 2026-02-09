/**
 * MSAL (Microsoft Authentication Library) 設定ファイル
 * Azure ADアプリ登録情報を記載
 */
import type { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID || "", // Azure ADで登録したアプリのクライアントID
    authority: import.meta.env.VITE_AUTHORITY || "", // テナントID
    redirectUri: import.meta.env.VITE_REDIRECT_URI || window.location.origin, // リダイレクトURI
    postLogoutRedirectUri: window.location.origin,
  },
  system: {
    loggerOptions: {
      loggerCallback: (_level: any, message: string, containsPii: boolean) => {
        if (containsPii) {
          return;
        }
        console.log(`[MSAL] ${message}`);
      },
      logLevel: import.meta.env.DEV ? 3 : 1, // 開発時は詳細ログ
    }
  },
  cache: {
    cacheLocation: "localStorage",
  },
};

// 基本スコープ（常に含まれる）
const baseScopes = ["User.Read"];

// 環境変数で追加するスコープ
const additionalScopes = import.meta.env.VITE_SCOPES 
  ? import.meta.env.VITE_SCOPES.split(",").map((s: string) => s.trim()) 
  : [];

// 基本スコープに追加スコープを結合（重複を排除）
export const allScopes = [...new Set([...baseScopes, ...additionalScopes])];

export const loginRequest = {
  scopes: allScopes,
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
