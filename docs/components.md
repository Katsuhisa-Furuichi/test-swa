# MELGIT-GAI Mallie Frontend - コンポーネント設計書

## 改善されたディレクトリ構造

```
src/
├── App.tsx                    # ルートコンポーネント
├── main.tsx                   # エントリーポイント
├── components/                # UIコンポーネント（複数形）
│   ├── layout/               # レイアウトコンポーネント
│   │   ├── AppLayout.tsx     # アプリケーション全体レイアウト
│   │   └── index.ts
│   │
│   └── features/             # 機能特化コンポーネント
│       ├── navigation/       # ナビゲーション機能
│       │   ├── Navigation.tsx
│       │   └── index.ts
│       │
│       ├── chat/            # チャット機能
│       │   ├── ChatInput.tsx      # 入力エリア
│       │   ├── MainContent.tsx    # メインコンテンツ
│       │   └── index.ts
│       │
│       └── topbar/          # トップバー
│           ├── TopBar.tsx
│           └── index.ts
│
├── hooks/                    # カスタムフック
│   ├── useNavigation.ts     # ナビゲーション状態管理
│   ├── useChat.ts           # チャット機能
│   └── useResponsive.ts     # レスポンシブ対応
│
├── types/                    # TypeScript型定義
│   ├── navigation.ts        # ナビゲーション型
│   └── chat.ts              # チャット型
│
└── styles/                   # グローバルスタイル
    └── global.css
```

## Figmaデザインに基づくコンポーネント構造

### 1. **画面全体の構成**
```
AppLayout (レイアウトコンテナ)
├── Navigation (サイドバー/ドロワー)
│   ├── Header (Hide/Show, External Link)
│   ├── Menu Items (新しい会話、画像生成、等)
│   └── Knowledge List (一般知識リスト)
│
└── MainArea
    ├── TopBar (ドロップダウン × 2)
    └── MainContent
        ├── Welcome Section
        ├── Settings Section (会話設定)
        └── ChatInput (入力エリア + アクションボタン)
```

### 2. **コンポーネントの責務**

#### **`components/layout/AppLayout.tsx`**
- **役割**: アプリケーション全体のレイアウト管理
- **責務**:
  - ナビゲーションの開閉状態管理
  - レスポンシブ対応（モバイル: Drawer、デスクトップ: Sidebar）
  - 子コンポーネントの配置と統合

#### **`components/features/navigation/Navigation.tsx`**
- **役割**: サイドバー/ドロワーナビゲーション
- **Figma対応**:
  - Header: Hide/Show ボタン、外部リンクボタン
  - Menu Items: 5つのメニュー項目（新しい会話、画像生成、等）
  - Knowledge List: スクロール可能な「一般知識」リスト
- **使用コンポーネント**: Fluent UI Icons + Serendie IconButton

#### **`components/features/topbar/TopBar.tsx`**
- **役割**: ヘッダーバー
- **Figma対応**:
  - Dropdown 1: MELGITGAI選択
  - Dropdown 2: 言語選択（全部（例題））
- **使用コンポーネント**: Fluent UI Dropdown, Option

#### **`components/features/chat/MainContent.tsx`**
- **役割**: メインコンテンツエリア
- **Figma対応**:
  - Welcome Section: 「画面左上のリンク集から、📋[画像生成機能]を利用できます。」
  - Settings Section: 「会話設定」セレクトボックス
  - ChatInput: チャット入力エリア
- **使用コンポーネント**: Serendie Select, ChatInput

#### **`components/features/chat/ChatInput.tsx`**
- **役割**: チャット入力フォーム
- **Figma対応**:
  - Textarea: マルチライン入力
  - Action Buttons: 設定、添付、マイク（左側）
  - Send Button: 送信ボタン（右側、円形）
- **使用コンポーネント**: Fluent UI Textarea, Serendie Button/IconButton

### 3. **Reactデファクトスタンダードとの整合性**

#### **変更前の問題点**
❌ `src/component/` - 単数形（非標準）
❌ `src/pages/App.tsx` - Appはページではない
❌ 平坦なコンポーネント構造 - 機能ごとの分類がない

#### **変更後の改善**
✅ `src/components/` - 複数形（React標準）
✅ `src/App.tsx` - ルートコンポーネントは src 直下
✅ `components/layout/` - レイアウトコンポーネント分離
✅ `components/features/` - 機能ごとに分類
   - `navigation/` - ナビゲーション機能
   - `chat/` - チャット関連機能
   - `topbar/` - トップバー機能

### 4. **今後の拡張性**

将来的に追加が想定されるコンポーネント：

```
components/
├── layout/           # レイアウトコンポーネント
│   ├── AppLayout.tsx
│   └── AuthLayout.tsx (将来: 認証画面用レイアウト)
│
├── features/         # 機能特化コンポーネント
│   ├── navigation/
│   ├── chat/
│   │   ├── ChatInput.tsx
│   │   ├── MainContent.tsx
│   │   ├── MessageBubble.tsx (将来: メッセージ表示)
│   │   └── MessageList.tsx (将来: メッセージリスト)
│   ├── topbar/
│   └── settings/     (将来: 設定画面)
│
└── ui/              # 汎用UIコンポーネント（将来）
    ├── Button.tsx   (カスタムボタンが必要な場合)
    ├── Card.tsx     (カード型コンポーネント)
    └── Modal.tsx    (モーダルダイアログ)
```

### 5. **コンポーネント設計原則**

#### **Atomic Design の簡易版**
- **layout**: ページ全体のレイアウト（テンプレート層）
- **features**: 機能単位のコンポーネント（オーガニズム層）
- **ui** (将来): 再利用可能な汎用コンポーネント（アトム/モレキュール層）

#### **責務の分離**
- **レイアウト**: 配置と構造のみ担当
- **フィーチャー**: 特定の機能に特化したビジネスロジック
- **UI**: スタイルと基本的なインタラクションのみ

#### **ファイル構成パターン**
各機能フォルダ内:
```
feature-name/
├── ComponentName.tsx    # コンポーネント実装
├── index.ts             # エクスポート
├── types.ts             # ローカル型定義（必要に応じて）
└── styles.module.css    # コンポーネント専用スタイル（必要に応じて）
```

## まとめ

### 実施した改善
1. ✅ `component/` → `components/` にリネーム（React標準）
2. ✅ `pages/App.tsx` → `App.tsx` に移動（ルートコンポーネント）
3. ✅ 機能別のディレクトリ構造を実装
   - `layout/` - AppLayout
   - `features/navigation/` - Navigation
   - `features/chat/` - ChatInput, MainContent
   - `features/topbar/` - TopBar
4. ✅ 全てのインポートパスを更新
5. ✅ コンパイルエラーなし

### Figmaデザインとの対応
- **Navigation**: Header, Menu Items, Knowledge List を完全実装
- **TopBar**: 2つのDropdownを実装
- **MainContent**: Welcome, Settings, ChatInput を統合
- **ChatInput**: Textarea + Action Buttons + Send Button
- **レスポンシブ**: モバイル (<768px) でDrawer切り替え

### ベストプラクティス準拠
✅ Reactデファクトスタンダードに準拠
✅ Atomic Design の簡易版を採用
✅ 責務の明確な分離
✅ 拡張性の高い構造
✅ TypeScript型定義の適切な配置
