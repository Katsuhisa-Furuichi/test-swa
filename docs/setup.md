# セットアップガイド

このドキュメントでは、MELGIT-GAI Mallie Frontendの開発環境構築手順を詳しく説明します。

## 必要要件

### システム要件

- **Node.js**: 18.x以上（推奨: 20.x LTS）
- **npm**: 9.x以上
- **Git**: 最新バージョン
- **OS**: Windows 10/11, macOS, Linux

### 推奨開発ツール

- **VS Code**: TypeScript/React開発に最適化
- **VS Code Extensions**:
  - ESLint
  - Prettier
  - TypeScript Vue Plugin (Volar)
  - GitLens
  - Error Lens

## インストール手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd MELGIT-GAI_Mallie-Frontend
```

### 2. 依存関係のインストール

```bash
npm install
```

**注意**: `package-lock.json`が存在する場合は、`npm ci`を使用することで、より確実なインストールが可能です。

```bash
npm ci
```

### 3. 環境変数の設定

`.env.example`を`.env`にコピーします。

```bash
cp .env.example .env
```

`.env`ファイルを編集し、以下の環境変数を設定してください。

#### 環境変数の詳細

```env
# Application Insights（テレメトリ収集）
VITE_APPINSIGHTS_KEY=<Your-Application-Insights-Connection-String>

# バックエンドAPI
VITE_API_BASE_URL=https://your-backend-api.azurewebsites.net

# Azure AD認証設定
VITE_CLIENT_ID=<Your-Azure-AD-Client-ID>
VITE_AUTHORITY=https://login.microsoftonline.com/<Your-Tenant-ID>
VITE_REDIRECT_URI=http://localhost:52000
VITE_SCOPES=api://<Your-API-App-ID>/.default
```

#### 環境変数の取得方法

1. **Application Insights接続キー**:
   - Azure Portalで Application Insightsリソースを開く
   - 「概要」→「接続文字列」をコピー

2. **Azure ADクライアントID**:
   - Azure Portal → Azure Active Directory → アプリの登録
   - 対象アプリを選択 → 「概要」→「アプリケーション（クライアント）ID」をコピー

3. **テナントID**:
   - Azure Portal → Azure Active Directory → 「概要」
   - 「テナントID」をコピー

## Azure ADアプリの登録

### 1. アプリケーションの登録

1. [Azure Portal](https://portal.azure.com/) にアクセス
2. **Azure Active Directory** → **アプリの登録** → **新規登録**
3. 以下を入力：
   - **名前**: `MELGIT-GAI Mallie Frontend`
   - **サポートされているアカウントの種類**: 「この組織ディレクトリのみのアカウント」
   - **リダイレクトURI**: 
     - 種類: `シングルページアプリケーション (SPA)`
     - URI: `http://localhost:52000`

### 2. APIアクセス許可の設定

1. 登録したアプリを開く
2. **APIのアクセス許可** → **アクセス許可の追加**
3. **Microsoft Graph** を選択
4. **委任されたアクセス許可** を選択
5. 以下のスコープを追加：
   - `User.Read`
   - `openid`
   - `profile`
   - `email`
6. **管理者の同意を与える** をクリック

### 3. 認証設定

1. **認証** タブを開く
2. **暗黙的な許可およびハイブリッド フロー** で以下を有効化：
   - ✅ アクセス トークン
   - ✅ ID トークン
3. **詳細設定** → **パブリッククライアントフローを許可する**: `はい`

### 4. リダイレクトURIの追加（本番環境用）

本番環境にデプロイする際は、リダイレクトURIを追加してください。

```
https://your-production-domain.com
```

## 開発サーバーの起動

### ローカル開発サーバー

```bash
npm run dev
```

ブラウザで [http://localhost:52000](http://localhost:52000) にアクセスしてください。

### プロダクションビルド

```bash
npm run build
```

ビルド結果は `dist/` フォルダに出力されます。

### ビルド結果のプレビュー

```bash
npm run preview
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスしてください。

## トラブルシューティング

### 認証エラー: AADSTS7000218

**症状**: ログイン時に「AADSTS7000218: Invalid client secret」エラーが発生

**原因**: リダイレクトURIが正しく設定されていない

**解決策**:
1. Azure Portalでアプリの登録を開く
2. **認証** → **リダイレクトURI** を確認
3. `http://localhost:52000` が「シングルページアプリケーション (SPA)」として登録されているか確認
4. `.env`ファイルの`VITE_REDIRECT_URI`が一致しているか確認

### CORS エラー

**症状**: APIリクエストで CORS エラーが発生

**原因**: バックエンドAPIのCORS設定が不足

**解決策**:
1. バックエンドAPIのCORS設定で `http://localhost:52000` を許可
2. Azure App Serviceの場合: 「CORS」設定でオリジンを追加

### ビルドエラー: TypeScript型エラー

**症状**: `npm run build` で型エラーが発生

**解決策**:
```bash
# 型定義を再インストール
npm install @types/react@latest @types/react-dom@latest

# キャッシュをクリア
npm cache clean --force
rm -rf node_modules
npm install
```

### 依存関係の競合

**症状**: `npm install` でピア依存関係の警告

**解決策**:
```bash
# レガシーピア依存関係を許可
npm install --legacy-peer-deps
```

### Application Insightsが動作しない

**症状**: テレメトリデータがAzure Portalに表示されない

**解決策**:
1. `.env`ファイルの `VITE_APPINSIGHTS_KEY` が正しいか確認
2. ブラウザのコンソールでエラーメッセージを確認
3. Application Insightsの「ライブメトリック」でリアルタイム接続を確認

### ポート52000が既に使用中

**症状**: `npm run dev` で「Port 52000 is already in use」エラー

**解決策**:
```bash
# Windows
netstat -ano | findstr :52000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:52000 | xargs kill -9
```

または、`vite.config.ts`でポートを変更：

```typescript
export default defineConfig({
  server: {
    port: 52001, // 別のポートを指定
  },
});
```

## 開発のヒント

### ホットリロード

Viteはファイル変更を検知して自動的にブラウザをリロードします。

### TypeScript型チェック

開発中に型チェックを実行：

```bash
npx tsc --noEmit
```

### ESLint自動修正

保存時に自動修正する場合、VS Codeの `.vscode/settings.json` に追加：

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### デバッグ

VS Codeのデバッグ設定（`.vscode/launch.json`）:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:52000",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

## 次のステップ

- [アーキテクチャ設計](./architecture.md) - プロジェクト構造を理解
- [コンポーネント設計](./components.md) - Figmaベースのコンポーネント構造を確認
- [認証システム](./authentication.md) - MSAL認証の詳細を学習
- [テストガイド](./testing.md) - テストの書き方を習得
