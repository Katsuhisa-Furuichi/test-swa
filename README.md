# MELGIT-GAI Mallie Frontend

Microsoft Teams統合型の次世代AIアシスタントフロントエンド

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-Private-red)](./LICENSE)

## 概要

MELGIT-GAI Mallie Frontendは、Microsoft Teams環境で動作するAIアシスタントのWebインターフェースです。Azure MSAL認証、Application Insights テレメトリ、Serendie UIフレームワークを統合し、エンタープライズグレードのユーザー体験を提供します。

### 主要技術

- **React 19.2** + **TypeScript 5.9** - モダンUIフレームワーク
- **Vite 7.3** - 高速ビルドツール（SWC使用）
- **@serendie/ui 2.2.7** - Ark UIベースのデザインシステム
- **Fluent UI v9** - Microsoft UIコンポーネント
- **Azure MSAL Browser** - シングルサインオン認証

## クイックスタート

### 必要要件

- Node.js 18.x以上
- npm 9.x以上

### インストールと起動

```bash
# 依存関係のインストール
npm install

# 環境変数設定
cp .env.example .env

# 開発サーバー起動（ポート52000）
npm run dev

# ビルド
npm run build

# プレビュー（ポート3000）
npm run preview
```

### 環境変数

`.env`ファイルで以下を設定：

```env
VITE_APPINSIGHTS_KEY=<Application Insightsキー>
VITE_API_BASE_URL=<バックエンドAPIのURL>
VITE_CLIENT_ID=<Azure ADクライアントID>
VITE_AUTHORITY=<Azure ADテナントURL>
VITE_REDIRECT_URI=<認証リダイレクトURI>
VITE_SCOPES=<Microsoft Graph APIスコープ>
```

## ドキュメント

詳細な設計・開発情報は[docsフォルダ](./docs/)を参照してください：

- 📐 [アーキテクチャ設計](./docs/architecture.md) - プロジェクト構造とBulletproof Reactパターン
- 🎨 [コンポーネント設計](./docs/components.md) - Figmaベースのコンポーネント構造
- 🛠️ [セットアップガイド](./docs/setup.md) - 詳細なインストール手順
- 🔐 [認証システム](./docs/authentication.md) - Azure MSAL SSOの実装
  - iframe環境での認証対応
  - LocalStorage共有による認証状態同期
  - 別タブでのユーザー選択ダイアログ回避
- 🧪 [テストガイド](./docs/testing.md) - ユニット・統合テストの実行
- 🎭 [Serendie UI](./docs/serendie-ui.md) - Ark UIベースのデザインシステム

## 開発コマンド

## 開発コマンド

```bash
# 開発
npm run dev              # 開発サーバー起動
npm run build            # プロダクションビルド
npm run preview          # ビルド結果のプレビュー

# テスト
npm run test             # 全テスト実行（カバレッジ付き）
npm run test:unit        # ユニットテストのみ
npm run test:integration # 統合テストのみ
npm run test:watch       # ウォッチモード
npm run test:ui          # UIモード

# コード品質
npm run lint             # ESLint実行
npm run lint:fix         # ESLint自動修正
npm run lint:report      # JSONレポート出力
npm run docs             # TypeDocドキュメント生成
```

## プロジェクト構造

```
src/
├── app/                # アプリケーションエントリーポイント
├── features/           # 機能単位モジュール（features-based）
│   └── chat/           # チャット機能
├── components/         # 共通コンポーネント
│   ├── auth/           # 認証関連
│   └── layout/         # レイアウト
├── hooks/              # 共有カスタムフック
├── lib/                # 外部ライブラリラッパー
├── types/              # 型定義
├── config/             # 設定ファイル
└── styles/             # グローバルスタイル
```

詳細は[アーキテクチャドキュメント](./docs/architecture.md)を参照してください。

## ライセンス

Private - MELGIT-GAI Project

## 関連リンク

- [Serendie Design System](https://serendie.design/)
- [Fluent UI React](https://react.fluentui.dev/)
- [Bulletproof React](https://github.com/alan2207/bulletproof-react)

