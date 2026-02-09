# Serendie UIフレームワーク使用ガイド

このドキュメントでは、[@serendie/ui](https://github.com/serendie/serendie)の使用方法を説明します。

## Serendie UIとは

Serendie UIは、[Ark UI](https://ark-ui.com/)をベースにした独自のデザインシステムです。

### 主要な特徴

- **Ark UIベース**: ヘッドレスUIライブラリによる高度なカスタマイズ性
- **Panda CSS統合**: ゼロランタイムCSSフレームワーク
- **TypeScript完全対応**: 型安全な開発体験
- **アクセシビリティ**: WAI-ARIA準拠のコンポーネント
- **Portal機能**: ドロップダウンメニュー等で自動的にPortalを使用

### 本プロジェクトの設計思想(2026年2月3日更新)

**FluentUI完全排除 → Serendie UI/Ark UI/Panda CSS統一**

本プロジェクトは新規開発であるため、UI制御思想の統一を最優先とし、以下のアーキテクチャを採用:

```
【3層アーキテクチャ】
Ark UI (ヘッドレス)     → ロジック・アクセシビリティ・状態管理
    ↓
Serendie UI (ラッパー)  → スタイル付きコンポーネント
    ↓
Panda CSS (カスタム)    → プロジェクト固有のスタイリング
```

**統一の利点**:
- 単一のデザイントークンシステム
- ゼロランタイムCSS(ビルド時生成)
- makeStyles(Griffel)の削除による依存関係簡素化
- TypeScript型安全なスタイリング

## インストール

```bash
npm install @serendie/ui @serendie/symbols
```

- `@serendie/ui`: UIコンポーネントライブラリ
- `@serendie/symbols`: アイコンライブラリ

## Phase 4完了時点での使用コンポーネント

### 1. IconButton

アイコンボタンを表示します。

```tsx
import { IconButton } from '@serendie/ui';
import { Add24Regular } from '@fluentui/react-icons';

function MyComponent() {
  return (
    <IconButton
      icon={<Add24Regular />}
      title="新しい会話"
      onClick={() => console.log('クリック')}
    />
  );
}
```

**Props**:
- `icon`: アイコン要素
- `title`: ツールチップテキスト
- `onClick`: クリックハンドラー

### 2. Drawer

モバイル用のサイドバードロワーです。

```tsx
import { Drawer } from '@serendie/ui';

function AppLayout() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer
      open={open}
      onOpenChange={(details) => setOpen(details.open)}
    >
      <DrawerContent>
        <Navigation />
      </DrawerContent>
    </Drawer>
  );
}
```

**Props**:
- `open`: 開閉状態
- `onOpenChange`: 状態変更ハンドラー

### 3. DropdownMenu（Phase 4で導入）

三点リーダーメニューなどのドロップダウンメニューを表示します。

```tsx
import { DropdownMenu } from '@serendie/ui';
import { MoreHorizontal24Regular } from '@fluentui/react-icons';

function ChatListItem() {
  const items = [
    { value: 'rename', label: '名前を変更' },
    { value: 'delete', label: '削除' },
  ];

  const handleSelect = (details) => {
    console.log('選択:', details.value);
  };

  return (
    <DropdownMenu
      styleType="iconButton"
      icon={<MoreHorizontal24Regular />}
      title="メニュー"
      items={items}
      onSelect={handleSelect}
    />
  );
}
```

**Props**:
- `styleType`: ボタンスタイル（`"iconButton"` | `"default"`）
- `icon`: アイコン要素
- `title`: ツールチップテキスト
- `items`: メニューアイテム配列
  - `value`: アイテムの値
  - `label`: 表示テキスト
- `onSelect`: 選択時のハンドラー
- `portalled`: Portal使用の有無（デフォルト: `true`）

**Ark UI Menuの内部実装**:

Serendie UIのDropdownMenuは、内部的にArk UIのMenuコンポーネントを使用しています。これにより、以下の機能が自動的に提供されます：

- **Portal**: メニューがドキュメント末尾にレンダリングされ、z-indexの問題を回避
- **キーボード操作**: 矢印キーでのナビゲーション、Escapeで閉じる
- **アクセシビリティ**: ARIA属性による支援技術サポート
- **フォーカス管理**: メニュー開閉時の適切なフォーカス制御

## Ark UIとPortal

### Portalとは

Portalは、Reactコンポーネントを親コンポーネントのDOM階層外にレンダリングする機能です。

```tsx
// React標準のPortal
import { createPortal } from 'react-dom';

function Modal({ children }) {
  return createPortal(
    <div className="modal">{children}</div>,
    document.body // body直下にレンダリング
  );
}
```

### Ark UIのPortal機能

Ark UIのコンポーネント（Menu, Tooltip, Popoverなど）は、自動的にPortalを使用します。

**メリット**:
1. **z-indexの問題を回避**: 親要素のz-indexに影響されない
2. **スクロール対応**: スクロール可能エリア内でも正しく表示
3. **オーバーフロー対応**: `overflow: hidden`の親要素でも見切れない

**デフォルト動作**:

```tsx
// Ark UIのMenuは自動的にPortalを使用
<Menu.Root>
  <Menu.Trigger>メニュー</Menu.Trigger>
  <Menu.Positioner> {/* これがPortalでbody直下にレンダリング */}
    <Menu.Content>
      <Menu.Item value="1">アイテム1</Menu.Item>
    </Menu.Content>
  </Menu.Positioner>
</Menu.Root>
```

**Portal無効化**:

必要に応じて`portalled={false}`で無効化できます。

```tsx
<DropdownMenu
  portalled={false} // Portalを無効化
  items={items}
  onSelect={handleSelect}
/>
```

## スタイリング

### グローバルスタイルのインポート

```css
/* src/styles/global.css */
@import '@serendie/ui/styles.css';
```

### Panda CSS

Serendie UIはPanda CSSを内包しており、ユーティリティクラスやスタイル関数が使用できます。

```tsx
import { css } from '@serendie/ui/css';

const className = css({
  backgroundColor: 'blue.500',
  padding: '4',
  borderRadius: 'md',
});

<div className={className}>スタイル適用</div>
```

### デザイントークン

Serendieは標準のデザイントークンを提供します。

```tsx
import { token } from '@serendie/ui/tokens';

const primaryColor = token('colors.blue.500');
const spacing = token('spacing.4');
```

## アイコンライブラリ

### @serendie/symbols

Serendie専用のアイコンライブラリです。

```tsx
import { AddIcon, CloseIcon } from '@serendie/symbols';

<AddIcon size={24} />
<CloseIcon size={24} />
```

### @fluentui/react-icons

Microsoft Fluent UIのアイコンも併用できます。

```tsx
import { Navigation24Regular, Settings24Regular } from '@fluentui/react-icons';

<Navigation24Regular />
<Settings24Regular />
```

## コンポーネント例

### フルカスタムボタン

```tsx
import { Button } from '@serendie/ui';
import { css } from '@serendie/ui/css';

const customButtonStyle = css({
  backgroundColor: 'purple.500',
  '&:hover': {
    backgroundColor: 'purple.600',
  },
});

<Button className={customButtonStyle}>
  カスタムボタン
</Button>
```

### モーダルダイアログ

```tsx
import { Dialog } from '@serendie/ui';

function ConfirmDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger>削除</Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Title>確認</Dialog.Title>
          <Dialog.Description>
            本当に削除しますか？
          </Dialog.Description>
          <Dialog.CloseTrigger>キャンセル</Dialog.CloseTrigger>
          <Button onClick={() => handleDelete()}>削除</Button>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
```

### セレクトボックス

```tsx
import { Select } from '@serendie/ui';

function LanguageSelector() {
  const languages = [
    { value: 'ja', label: '日本語' },
    { value: 'en', label: 'English' },
  ];

  return (
    <Select
      items={languages}
      defaultValue="ja"
      onValueChange={(details) => console.log(details.value)}
    />
  );
}
```

## Phase 4での変更点

### 変更前（手動Portal実装）

```tsx
// 60+行のコード
const [menuOpen, setMenuOpen] = useState(false);
const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
const menuButtonRef = useRef<HTMLButtonElement>(null);

useEffect(() => {
  // 外部クリック検知
  // 位置計算
}, [menuOpen]);

{createPortal(
  menuOpen && (
    <div style={{ position: 'absolute', top: menuPosition.top, left: menuPosition.left }}>
      {/* メニュー内容 */}
    </div>
  ),
  document.body
)}
```

### 変更後（Serendie DropdownMenu）

```tsx
// 5行のコード
<DropdownMenu
  styleType="iconButton"
  icon={<MoreHorizontal24Regular />}
  items={[
    { value: 'rename', label: '名前を変更' },
    { value: 'delete', label: '削除' },
  ]}
  onSelect={(details) => handleMenuAction(item.id, details)}
/>
```

**削減されたコード**:
- useState（menuOpen, menuPosition）
- useRef（menuButtonRef）
- useEffect（外部クリック検知、位置計算）
- createPortal
- ポジション計算ロジック
- 合計60+行のコード削除

## ベストプラクティス

### 1. アクセシビリティ

Ark UIはWAI-ARIA準拠ですが、適切な`aria-label`や`title`を設定してください。

```tsx
<IconButton
  icon={<AddIcon />}
  title="新しい会話を作成" // スクリーンリーダー用
  aria-label="新しい会話を作成"
/>
```

### 2. Portalの適切な使用

ドロップダウンやモーダルには自動的にPortalが使用されますが、z-indexで解決できる場合はPortalを無効化することも検討してください。

```tsx
// z-indexで十分な場合
<DropdownMenu portalled={false} items={items} />
```

### 3. 型安全性

TypeScriptの型定義を活用してください。

```tsx
import { ButtonProps } from '@serendie/ui';

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

## トラブルシューティング

### スタイルが適用されない

**原因**: `styles.css`がインポートされていない

**解決策**:
```css
/* src/styles/global.css */
@import '@serendie/ui/styles.css';
```

### Portalが動作しない

**原因**: `document.body`が存在しないタイミングでレンダリング

**解決策**: コンポーネントがマウントされてから開くようにする

```tsx
useEffect(() => {
  setOpen(true);
}, []);
```

### z-indexの競合

**原因**: Portalを無効化している場合、親要素のz-indexに影響される

**解決策**: `portalled={true}`（デフォルト）を使用

## 参考リソース

- [Serendie UI GitHub](https://github.com/serendie/serendie)
- [Ark UI 公式ドキュメント](https://ark-ui.com/)
- [Panda CSS 公式ドキュメント](https://panda-css.com/)
