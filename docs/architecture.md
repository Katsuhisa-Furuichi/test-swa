# MELGIT-GAI-Teams フロントエンドアーキテクチャ設計書

## 1. 技術スタック

### コアフレームワーク・ライブラリ
- **React 18.3.1** - UIフレームワーク
- **TypeScript 5.9.3** - 型安全な開発
- **Vite 6.4.1** - 高速ビルドツール
- **React Router DOM 7.11.0** - クライアントサイドルーティング

### UIコンポーネント・スタイリング
- **@serendie/ui** (2.2.7) - Ark UIベースのUIコンポーネントライブラリ
- **@ark-ui/react** (5.30.0) - ヘッドレスUIライブラリ(アクセシビリティ・状態管理)
- **Panda CSS** (@pandacss/dev 0.53.0) - ゼロランタイムCSSフレームワーク(SerendiePreset統合)
- **Fluent UI React Icons** (2.0.316) - アイコンセット(SerendieUIと互換)
- ~~**Fluent UI v9**~~ - **完全排除済み**(2026年2月3日 - UI制御思想統一のため)

### Microsoft統合
- **Microsoft Teams JS SDK** (2.47.2) - Teams統合
- **Azure MSAL Browser** (4.27.0) - SSO認証
- **Application Insights Web** (3.3.10) - テレメトリ収集

### 開発・テストツール
- **Vitest 3.2.4** - テストフレームワーク
- **@testing-library/react** (16.3.1) - Reactコンポーネントテスト
- **ESLint 9.39.2** - コード品質管理
- **TypeDoc 0.28.15** - ドキュメント生成

### ビルド最適化
- **@vitejs/plugin-react-swc** - 高速React変換
- **jsdom** - テスト環境

---

## 2. ディレクトリ構成

```
frontend/
├── src/
│   ├── api/                    # APIクライアント層
│   │   └── client.ts          # バックエンドAPI通信の一元管理
│   │
│   ├── assets/                 # 静的リソース
│   │   └── images/            # 画像ファイル
│   │
│   ├── component/             # UIコンポーネント（再利用可能）
│   │   ├── ChatInput.tsx      # チャット入力フォーム
│   │   ├── MessageArea.tsx    # メッセージ表示エリア
│   │   ├── MessageBubble.tsx  # 個別メッセージバブル
│   │   ├── SchedulePanel.tsx  # 会議スケジュールパネル
│   │   ├── TopControls.tsx    # 上部コントロール
│   │   ├── ErrorDisplay.tsx   # エラー表示
│   │   ├── LoadingIndicator.tsx    # ローディング表示
│   │   ├── FluentProvider.tsx      # Fluent UIテーマプロバイダ
│   │   ├── LocalizationProvider.tsx # 多言語プロバイダ
│   │   └── ...                # その他UIコンポーネント
│   │
│   ├── constants/             # 定数・テキストリソース
│   │   ├── en-US.ts          # 英語テキスト
│   │   └── ja-JP.ts          # 日本語テキスト
│   │
│   ├── hooks/                 # カスタムReactフック
│   │   ├── useChat.ts        # チャット機能ロジック
│   │   ├── useMeetingData.ts # 会議データ取得
│   │   ├── useSummary.ts     # 要約生成
│   │   ├── useLocalization.ts # 多言語対応
│   │   ├── useStreamingProcessor.ts  # SSEストリーミング処理
│   │   ├── useTypingEffect.ts        # タイピングエフェクト
│   │   └── ...               # その他カスタムフック
│   │
│   ├── pages/                 # ページコンポーネント（ルーティング単位）
│   │   ├── App.tsx           # ルートコンポーネント
│   │   ├── AppMain.tsx       # メインアプリケーション
│   │   ├── AuthGate.tsx      # SSO認証ゲート
│   │   ├── AuthRedirectHandler.tsx   # 認証リダイレクト処理
│   │   ├── ConsentPopup.tsx  # OAuth同意ポップアップ
│   │   └── NotFound.tsx      # 404エラーページ
│   │
│   ├── state/                 # グローバル状態管理
│   │   └── typingEffectState.ts  # タイピングエフェクト状態
│   │
│   ├── styles/                # グローバルスタイル
│   │   ├── global.css        # グローバルCSS
│   │   └── serendie.css      # Serendieスタイル
│   │
│   ├── telemetry/             # テレメトリ・監視
│   │   └── telemetry.ts      # Application Insights統合
│   │
│   ├── types/                 # TypeScript型定義
│   │   ├── chat.ts           # チャット関連型
│   │   ├── config.ts         # 設定型
│   │   ├── localization.ts   # 多言語対応型
│   │   ├── schedule.ts       # スケジュール型
│   │   ├── summary.ts        # 要約型
│   │   ├── transcript.ts     # トランスクリプト型
│   │   └── typing.ts         # タイピング型
│   │
│   ├── utils/                 # ユーティリティ関数
│   │   ├── commonErrorHandling.ts  # エラーハンドリング
│   │   ├── copyUtils.ts           # コピー機能
│   │   ├── dateFormatter.ts       # 日付フォーマット
│   │   ├── localizationUtils.ts   # 多言語ユーティリティ
│   │   ├── meetingFormat.ts       # 会議データフォーマット
│   │   ├── messageUtils.ts        # メッセージ処理
│   │   └── safeCommonUtils.ts     # 安全な共通ユーティリティ
│   │
│   ├── main.tsx              # アプリケーションエントリポイント
│   ├── global.d.ts           # グローバル型定義
│   └── vite-env.d.ts         # Vite環境型定義
│
├── tests/                     # テストファイル
│   ├── setup/                # テスト環境セットアップ
│   ├── mocks/                # モックオブジェクト
│   ├── unit/                 # ユニットテスト
│   └── integration/          # 統合テスト
│
├── .env                       # 環境変数
├── eslint.config.js          # ESLint設定
├── index.html                # HTMLエントリポイント
├── package.json              # 依存関係
├── panda.config.mjs          # Panda CSS設定
├── postcss.config.cjs        # PostCSS設定
├── tsconfig.json             # TypeScript設定（ルート）
├── tsconfig.app.json         # アプリケーション用TypeScript設定
├── tsconfig.node.json        # Node用TypeScript設定
├── tsconfig.test.json        # テスト用TypeScript設定
├── typedoc.json              # TypeDocドキュメント設定
└── vite.config.ts            # Viteビルド設定
```

---

## 3. アーキテクチャパターン

### 3.1 コンポーネント設計
- **Atomic Design的アプローチ**: 小さな再利用可能コンポーネントを組み合わせる
- **プレゼンテーション/コンテナ分離**: ロジックとUIを分離
- **カスタムフックによる状態管理**: ビジネスロジックをフックに抽出

### 3.2 状態管理戦略
- **React Context API**: グローバル設定・多言語情報の配布
- **状態の持ち上げ (Lifting State Up)**: 親コンポーネントで共有状態を管理
- **カスタムフック**: 複雑な状態ロジックをカプセル化
- **モジュールスコープ変数**: 認証トークン等のキャッシュ

### 3.3 データフロー
```
main.tsx (エントリポイント)
  ↓
App.tsx (ルート、Context Provider)
  ↓
AppMain.tsx (メインアプリ、状態管理の中心)
  ↓
├── SchedulePanel (会議リスト)
├── TopControls (操作コントロール)
├── MessageArea (メッセージ表示)
└── ChatInput (入力フォーム)
```

### 3.4 API通信層
- **client.ts** - 全API呼び出しを一元管理
- **SSE (Server-Sent Events)** - リアルタイムストリーミング
- **Teams SDK統合** - SSO認証、コンテキスト取得

---

## 4. 設定ファイル詳細

### 4.1 Vite設定 (`vite.config.ts`)
```typescript
- プラグイン: React SWC（高速変換）
- ビルド出力: dist/（Express公開ディレクトリ対応）
- 開発サーバー: ポート52000
- テスト: Vitest統合、カバレッジ閾値80%
- SSR無効化: global定義
```

### 4.2 TypeScript設定
- **tsconfig.json**: プロジェクトルート設定（strict mode有効）
- **tsconfig.app.json**: アプリケーションコード用（ES2020、React JSX）
- **tsconfig.node.json**: Node用
- **tsconfig.test.json**: テスト用

### 4.3 ESLint設定
- **typescript-eslint**: TypeScript推奨ルール
- **eslint-plugin-react**: React推奨ルール + Hooks検証
- **eslint-plugin-import**: インポート順序・解決チェック
- **eslint-plugin-jsx-a11y**: アクセシビリティ検証
- **対象**: `src/**/*.{js,ts,jsx,tsx}`

### 4.4 環境変数 (`.env`)
```dotenv
VITE_APPINSIGHTS_KEY=xxx           # Application Insights
VITE_SHOW_TYPING_TOGGLE=false      # タイピングトグル表示
VITE_DISABLE_TYPING_OUTPUT=false   # タイピング出力制御
```

---

## 5. 主要機能モジュール

### 5.1 認証フロー (AuthGate.tsx)
1. Teams SDK初期化
2. SSOトークン取得 (`getAuthToken`)
3. OBOフロー実行（バックエンド連携）
4. 同意ポップアップ処理
5. メインアプリへ遷移

### 5.2 チャット機能 (useChat.ts)
- メッセージ履歴管理（React state）
- SSEストリーミング処理
- タイピングエフェクト統合
- エラーハンドリング・表示

### 5.3 会議データ管理
- **useMeetingData.ts**: 会議リスト取得
- **useMeetingDetails.ts**: 会議詳細・トランスクリプト
- **useSummary.ts**: 要約生成API連携

### 5.4 多言語対応 (Localization)
- **LocalizationProvider.tsx**: Context Provider
- **useLocalization.ts**: カスタムフック
- **constants/**: 言語別テキストリソース
- **Teams locale自動検出**

### 5.5 テレメトリ (telemetry.ts)
- Application Insights初期化
- イベント追跡 (`trackEvent`)
- 例外追跡 (`trackException`)
- 自動ルート追跡

---

## 6. スタイリング戦略

### 6.1 Fluent UI v9 makeStyles
```typescript
const useStyles = makeStyles({
  root: {
    display: 'flex',
    backgroundColor: tokens.colorNeutralBackground1,
  }
});
```

### 6.2 Panda CSS（Serendieプリセット）
- デザインシステム統合
- `styled-system/` 自動生成
- グローバルCSS (`global.css`)

### 6.3 レスポンシブデザイン
- Fluent UI Tokens使用
- フレックスボックスレイアウト
- Teams環境対応

---

## 7. テスト戦略

### 7.1 テスト構成
- **Vitest**: テストランナー
- **Testing Library**: React コンポーネントテスト
- **jsdom**: ブラウザ環境シミュレーション
- **カバレッジ閾値**: 80%（lines, functions, branches, statements）

### 7.2 モック戦略
```typescript
tests/mocks/
├── apiMocks.ts          # API呼び出しモック
├── msalMocks.ts         # MSAL認証モック
├── teamsMocks.ts        # Teams SDKモック
├── fluentUIMocks.ts     # Fluent UIモック
└── appInsightsMocks.ts  # Application Insightsモック
```

### 7.3 テストコマンド
```bash
npm run test              # 全テスト実行
npm run test:unit         # ユニットテストのみ
npm run test:integration  # 統合テストのみ
npm run test:watch        # ウォッチモード
npm run test:coverage     # カバレッジレポート生成
```

---

## 8. ビルド・デプロイ

### 8.1 開発モード
```bash
npm run dev               # 開発サーバー起動（ポート52000）
```

### 8.2 本番ビルド
```bash
npm run build             # TypeScriptコンパイル + Viteビルド
npm run preview           # ビルド結果のプレビュー
```

### 8.3 コード品質
```bash
npm run lint              # ESLint実行
npm run lint:fix          # ESLint自動修正
npm run lint:report       # JSON形式レポート出力
npm run docs              # TypeDocドキュメント生成
```

---

## 9. 設計原則・ベストプラクティス

### 9.1 コード品質
- **TypeScript Strict Mode**: 型安全性の最大化
- **ESLint**: コーディング規約の自動チェック
- **JSDoc**: 全モジュール・関数にドキュメント
- **テストカバレッジ**: 80%以上維持

### 9.2 パフォーマンス
- **React.memo**: 不要な再レンダリング防止
- **useCallback/useMemo**: メモ化による最適化
- **Code Splitting**: React Router + Lazy Loading
- **Vite SWC**: 高速ビルド

### 9.3 セキュリティ
- **MSAL Browser**: Microsoft推奨認証ライブラリ
- **トークンキャッシュ**: メモリ内のみ（セッションストレージ不使用）
- **環境変数**: 機密情報の外部化

### 9.4 アクセシビリティ
- **ARIA属性**: 適切なセマンティクス
- **eslint-plugin-jsx-a11y**: 自動検証
- **Fluent UI**: アクセシブルなコンポーネント

---

## 10. 依存関係バージョン管理

### 10.1 主要依存関係の固定
- **React 18.3.1**: 最新安定版
- **TypeScript 5.9.x**: 最新マイナーバージョン
- **Fluent UI v9**: v9系列の最新
- **Teams JS SDK 2.47.2**: Teams統合

### 10.2 更新戦略
- **パッチバージョン**: 自動更新可
- **マイナーバージョン**: 定期的にレビュー
- **メジャーバージョン**: 慎重に検証後更新

---

## 11. 新規プロジェクト作成時のセットアップ手順

### 11.1 初期セットアップ
```bash
# Vite + React + TypeScript プロジェクト作成
npm create vite@latest project-name -- --template react-swc-ts

# プロジェクトディレクトリに移動
cd project-name

# 依存関係インストール
npm install
```

### 11.2 必須パッケージのインストール
```bash
# UIコンポーネント・スタイリング
npm install @fluentui/react-components @fluentui/react-icons
npm install @serendie/ui

# Microsoft統合
npm install @microsoft/teams-js @azure/msal-browser
npm install @microsoft/applicationinsights-web

# ルーティング
npm install react-router-dom

# Panda CSS
npm install -D @pandacss/dev
```

### 11.3 開発ツールのインストール
```bash
# テスト
npm install -D vitest @vitest/ui @vitest/coverage-v8
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event jsdom

# ESLint
npm install -D eslint @eslint/js typescript-eslint
npm install -D eslint-plugin-react eslint-plugin-react-hooks
npm install -D eslint-plugin-import eslint-plugin-jsx-a11y
npm install -D eslint-plugin-promise

# その他
npm install -D typedoc globals
```

### 11.4 ディレクトリ構造の作成
```bash
# src配下のディレクトリ作成
mkdir -p src/{api,assets/images,component,constants,hooks,pages,state,styles,telemetry,types,utils}

# tests配下のディレクトリ作成
mkdir -p tests/{setup,mocks,unit,integration}
```

### 11.5 設定ファイルのコピー
以下のファイルを既存プロジェクトからコピー：
- `vite.config.ts`
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.test.json`
- `eslint.config.js`
- `panda.config.mjs`
- `.env.example` (テンプレートとして)
- `typedoc.json`

### 11.6 package.jsonスクリプトの追加
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -p tsconfig.app.json && vite build",
    "preview": "vite preview",
    "lint": "eslint --config eslint.config.js .",
    "lint:fix": "eslint --config eslint.config.js . --fix",
    "test": "vitest run --coverage",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "docs": "typedoc"
  }
}
```

---

## 12. まとめ

このアーキテクチャは以下の特徴を持ちます：

1. **モダンReact開発**: 関数コンポーネント + フック + TypeScript
2. **Microsoft統合**: Teams SDK、MSAL、Application Insights
3. **スケーラブル設計**: 明確なディレクトリ構造、カスタムフック分離
4. **高品質コード**: ESLint、TypeScript strict、80%テストカバレッジ
5. **高速開発体験**: Vite + SWC、HMR対応
6. **企業レベル対応**: セキュリティ、アクセシビリティ、テレメトリ

新しいフロントエンドプロジェクトを同じ構想で作成する際は、この設計をテンプレートとして活用できます。各セクションの詳細を参照し、プロジェクト要件に応じて適宜カスタマイズしてください。

---

**作成日**: 2026年1月29日  
**対象プロジェクト**: MELGIT-GAI-Teams  
**バージョン**: 1.0.0
