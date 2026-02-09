# MELGIT-GAI Mallie Frontend - ドキュメント索引

このフォルダには、プロジェクトの詳細な設計・開発ドキュメントが含まれています。

## 📚 ドキュメント一覧

### 設計・アーキテクチャ

- **[architecture.md](./architecture.md)** - プロジェクト全体のアーキテクチャ設計
  - 技術スタック詳細
  - Bulletproof Reactパターンの採用理由
  - ディレクトリ構造の設計思想
  - インポートルールとベストプラクティス

- **[components.md](./components.md)** - コンポーネント設計書
  - Figmaデザインに基づくコンポーネント構造
  - 各コンポーネントの責務と役割
  - レイアウトコンポーネントの詳細
  - features固有コンポーネントの設計

- **[styling-migration.md](./styling-migration.md)** - **NEW (2026/02/03)** スタイリング戦略変更
  - FluentUI makeStyles完全排除
  - Panda CSS統合とゼロランタイム実現
  - 3層アーキテクチャ(Ark UI → Serendie UI → Panda CSS)
  - コンポーネントAPI変更とマイグレーション記録

### セットアップ・開発

- **[setup.md](./setup.md)** - 開発環境セットアップガイド
  - 必要要件とインストール手順
  - 環境変数の詳細説明
  - Azure ADアプリ登録手順
  - トラブルシューティング

- **[serendie-ui.md](./serendie-ui.md)** - Serendie UIフレームワーク使用ガイド (更新)
  - Ark UIベースのデザインシステム
  - Panda CSS統合とスタイリング実装
  - コンポーネント使用例
  - デザイントークンシステム

### 認証・セキュリティ

- **[authentication.md](./authentication.md)** - 認証システム実装ガイド
  - Azure MSAL Browser統合
  - SSO認証フロー
  - AuthGuard実装詳細
  - トークン管理とリフレッシュ

### テスト

- **[testing.md](./testing.md)** - テスト実行ガイド
  - Vitestセットアップ
  - ユニットテスト作成方法
  - 統合テスト作成方法
  - カバレッジレポートの見方

## 🎯 ドキュメントの読み方

### 初めての方
1. [setup.md](./setup.md) - 開発環境のセットアップ
2. [architecture.md](./architecture.md) - プロジェクト構造の理解
3. [components.md](./components.md) - コンポーネント設計の把握

### コンポーネント開発者
1. [components.md](./components.md) - コンポーネント設計パターン
2. [serendie-ui.md](./serendie-ui.md) - UIフレームワークの使用法
3. [testing.md](./testing.md) - テストの書き方

### 認証機能の実装者
1. [authentication.md](./authentication.md) - MSAL統合の詳細
2. [setup.md](./setup.md) - Azure AD設定手順

## 📝 ドキュメント更新ガイドライン

新しい機能や設計変更を行う際は、該当するドキュメントも更新してください：

- アーキテクチャ変更 → `architecture.md`
- 新規コンポーネント追加 → `components.md`
- 環境設定変更 → `setup.md`
- 認証フロー変更 → `authentication.md`
- テスト方針変更 → `testing.md`
- UIフレームワーク更新 → `serendie-ui.md`

## 🔗 関連リソース

- [プロジェクトルート README](../README.md)
- [Serendie Design System](https://serendie.design/)
- [Fluent UI Documentation](https://react.fluentui.dev/)
- [Bulletproof React](https://github.com/alan2207/bulletproof-react)

