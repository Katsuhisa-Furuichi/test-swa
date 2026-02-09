# スタイリング戦略変更ドキュメント

**更新日**: 2026年2月3日  
**変更理由**: UI制御思想の統一化(新規開発プロジェクトのため)

## 1. 変更概要

### 変更内容
FluentUI makeStyles(Griffelエンジン) → Panda CSS完全移行

### 削除されたもの
- `@fluentui/react-components` (76パッケージ削減)
- FluentProvider
- makeStyles フック
- Griffelランタイム

### 保持されたもの
- `@fluentui/react-icons` (SerendieUIと互換性あり)

---

## 2. 新しいアーキテクチャ

### 3層構造

```
【ヘッドレスUI層】
Ark UI (@ark-ui/react)
  ↓ ロジック・アクセシビリティ・状態管理
  
【スタイル済みコンポーネント層】
Serendie UI (@serendie/ui)
  ↓ デフォルトスタイル適用
  
【カスタムスタイリング層】
Panda CSS (@pandacss/dev)
  ↓ プロジェクト固有のスタイル
```

### 利点

| 項目 | FluentUI makeStyles | Panda CSS |
|------|-------------------|-----------|
| ランタイム | ✗ 動的生成 | ✓ ゼロランタイム |
| バンドルサイズ | 大(ランタイム含む) | 小(CSS のみ) |
| Provider依存 | ✗ 必須 | ✓ 不要 |
| デザイントークン | Fluent Tokens | Panda Tokens |
| 型安全性 | ✓ | ✓ |
| パフォーマンス | 中 | 高 |

---

## 3. Panda CSS 設定

### panda.config.ts

```typescript
import { defineConfig } from '@pandacss/dev';
import { SerendiePreset } from '@serendie/ui/preset';

export default defineConfig({
  preflight: true,
  presets: [SerendiePreset],
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  jsxFramework: 'react',
  outdir: 'src/styled-system',
});
```

### 自動生成ファイル (src/styled-system/)

- `css/index.ts` - `css()`, `cva()` 関数
- `tokens/index.ts` - デザイントークン定数
- `patterns/index.ts` - レイアウトパターン
- `jsx/index.ts` - スタイル付きJSX要素

### ビルドコマンド

```json
{
  "scripts": {
    "prepare": "panda codegen",
    "dev": "panda codegen --watch & vite",
    "build": "panda codegen && tsc && vite build"
  }
}
```

### vite.config.ts パスエイリアス

```typescript
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@styled-system': path.resolve(__dirname, './src/styled-system'),
    },
  },
});
```

---

## 4. スタイリングパターン

### 4.1 基本的なスタイル

**変更前 (FluentUI makeStyles)**:
```typescript
import { makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    padding: '16px',
    gap: '12px',
    borderRadius: '8px',
  },
});

function Component() {
  const styles = useStyles(); // ランタイムで生成
  return <div className={styles.container}>...</div>;
}
```

**変更後 (Panda CSS)**:
```typescript
import { css } from '@styled-system/css';

const styles = {
  container: css({
    display: 'flex',
    padding: '4',        // トークン: 16px
    gap: '3',            // トークン: 12px
    borderRadius: 'lg',  // トークン: 12px
  }),
};

function Component() {
  return <div className={styles.container}>...</div>;
}
```

### 4.2 レスポンシブスタイル

**変更前 (FluentUI)**:
```typescript
const useStyles = makeStyles({
  container: {
    padding: '16px',
    '@media (min-width: 768px)': {
      padding: '24px',
    },
  },
});
```

**変更後 (Panda CSS)**:
```typescript
const styles = {
  container: css({
    padding: '4',
    '@media (min-width: 768px)': {
      padding: '6',
    },
  }),
};
```

**注意**: SerendiePresetは `{ base: '', md: '' }` オブジェクト記法非対応。  
メディアクエリ文字列を直接使用。

### 4.3 擬似クラス

**変更前 (FluentUI)**:
```typescript
const useStyles = makeStyles({
  button: {
    backgroundColor: '#E8E8E8',
    ':hover': {
      backgroundColor: '#D6D6D6',
    },
  },
});
```

**変更後 (Panda CSS)**:
```typescript
const styles = {
  button: css({
    backgroundColor: '#E8E8E8',
    _hover: {
      backgroundColor: '#D6D6D6',
    },
  }),
};
```

### 4.4 条件付きスタイル (バリアント)

**変更前 (FluentUI - 手動)**:
```typescript
const useStyles = makeStyles({
  item: { /* base */ },
  itemSelected: { /* selected */ },
});

<div className={`${styles.item} ${isSelected ? styles.itemSelected : ''}`} />
```

**変更後 (Panda CSS - cva)**:
```typescript
import { cva } from '@styled-system/css';

const chatItemStyle = cva({
  base: {
    padding: '3',
    borderRadius: 'md',
    _hover: { backgroundColor: '#E8E8E8' },
  },
  variants: {
    selected: {
      true: {
        backgroundColor: '#D6E3FF',
        _hover: { backgroundColor: '#C5D7FF' },
      },
    },
  },
});

<div className={chatItemStyle({ selected: isSelected })} />
```

---

## 5. デザイントークン

### スペーシング (spacing)

```typescript
padding: '1'  // 4px
padding: '2'  // 8px
padding: '3'  // 12px
padding: '4'  // 16px
padding: '5'  // 20px
padding: '6'  // 24px
```

### ボーダー半径 (borderRadius)

```typescript
borderRadius: 'sm'  // 4px
borderRadius: 'md'  // 6px
borderRadius: 'lg'  // 12px
borderRadius: 'xl'  // 16px
```

### z-index階層

```typescript
zIndex: 'deepDive'   // -1000 (背景要素)
zIndex: 'base'       // 0     (通常フロー)
zIndex: 'docked'     // 10    (固定ヘッダー・フッター)
zIndex: 'dropdown'   // 500   (ドロップダウンメニュー)
zIndex: 'modal'      // 1000  (モーダルダイアログ)
zIndex: 'toast'      // 2000  (トースト通知)
```

### カラー

```typescript
color: 'gray.600'  // #424242相当
color: 'blue.500'  // プライマリーカラー
// その他はPanda CSSデフォルトパレット
```

---

## 6. コンポーネントAPI変更

### 6.1 TextArea

| 項目 | FluentUI | Serendie UI |
|------|----------|-------------|
| コンポーネント名 | `Textarea` | `TextArea` |
| onChange | `(_, data) => setValue(data.value)` | `(e) => setValue(e.target.value)` |
| キーイベント | `onKeyPress` | `onKeyDown` |
| リサイズ | `resize="vertical"` | `autoAdjustHeight` |

**変更例**:
```typescript
// 変更前
<Textarea
  value={value}
  onChange={(_, data) => onChange(data.value)}
  onKeyPress={handleKeyPress}
  resize="vertical"
/>

// 変更後
<TextArea
  value={value}
  onChange={(e) => onChange(e.target.value)}
  onKeyDown={handleKeyDown}
  autoAdjustHeight
/>
```

### 6.2 Select (Dropdown)

| 項目 | FluentUI | Serendie UI |
|------|----------|-------------|
| コンポーネント | `<Dropdown>` + `<Option>` | `<Select>` |
| アイテム定義 | JSX children | `items` prop |
| 選択イベント | `onOptionSelect` | `onValueChange` |
| 選択値 | `data.optionValue` | `details.value` |

**変更例**:
```typescript
// 変更前
<Dropdown onOptionSelect={(_, data) => handleChange(data.optionValue)}>
  <Option value="ja">日本語</Option>
  <Option value="en">English</Option>
</Dropdown>

// 変更後
const items = [
  { value: 'ja', label: '日本語' },
  { value: 'en', label: 'English' },
];

<Select
  items={items}
  onValueChange={(details) => handleChange(details.value[0])}
/>
```

### 6.3 Dialog

| 項目 | FluentUI | Ark UI |
|------|----------|---------|
| ルート | `<Dialog>` | `<Dialog.Root>` |
| サーフェス | `<DialogSurface>` | `<Dialog.Content>` |
| タイトル | `<DialogTitle>` | `<Dialog.Title>` |
| 本文 | `<DialogBody>`, `<DialogContent>` | 直接配置 |
| アクション | `<DialogActions>` | 直接配置 |
| 閉じるボタン | `<DialogTrigger>` | `<Dialog.CloseTrigger>` |
| バックドロップ | なし | `<Dialog.Backdrop>` |
| Positioner | なし | `<Dialog.Positioner>` |

**変更例**:
```typescript
// 変更前
<Dialog open={open} onOpenChange={(_, data) => setOpen(data.open)}>
  <DialogSurface>
    <DialogTitle>タイトル</DialogTitle>
    <DialogBody>
      <DialogContent>内容</DialogContent>
    </DialogBody>
    <DialogActions>
      <DialogTrigger>
        <Button>キャンセル</Button>
      </DialogTrigger>
      <Button onClick={handleSave}>保存</Button>
    </DialogActions>
  </DialogSurface>
</Dialog>

// 変更後
<Dialog.Root open={open} onOpenChange={(details) => setOpen(details.open)}>
  <Dialog.Backdrop className={css({ backgroundColor: 'rgba(0, 0, 0, 0.5)' })} />
  <Dialog.Positioner>
    <Dialog.Content>
      <Dialog.Title>タイトル</Dialog.Title>
      内容
      <Dialog.CloseTrigger asChild>
        <Button>キャンセル</Button>
      </Dialog.CloseTrigger>
      <Button onClick={handleSave}>保存</Button>
    </Dialog.Content>
  </Dialog.Positioner>
</Dialog.Root>
```

---

## 7. 移行完了コンポーネント一覧

**Phase 1-5 完了 (2026年2月3日)**

| ファイル | 変更内容 | 難易度 |
|---------|---------|-------|
| `provider.tsx` | FluentProvider削除 | ★☆☆ |
| `MainFrame.tsx` | makeStyles → css() | ★☆☆ |
| `ConversationSettings.tsx` | makeStyles → css() | ★☆☆ |
| `ChatContainer.tsx` | makeStyles → css() | ★☆☆ |
| `ChatInput.tsx` | makeStyles → css() + Textarea → TextArea | ★★☆ |
| `ChatWelcome.tsx` | makeStyles → css() + Dialog API変更 | ★★★ |
| `Navigation.tsx` | makeStyles → css() + cva | ★★☆ |
| `TopBar.tsx` | makeStyles → css() + Dropdown → Select | ★★☆ |
| `AppLayout.tsx` | makeStyles → css() | ★☆☆ |
| `vite.config.ts` | パスエイリアス追加 | ★☆☆ |

**削除されたパッケージ**: `@fluentui/react-components` (-76パッケージ)

---

## 8. ビルド結果

### ビルドサイズ

```
dist/assets/index.css   97.22 kB │ gzip:  12.77 kB
dist/assets/index.js   738.64 kB │ gzip: 217.76 kB
```

### パフォーマンス向上

- ゼロランタイムCSS (makeStyles削除)
- Griffelエンジン削除
- FluentProvider削除により初期化コスト削減

---

## 9. まとめ

### 達成したこと

✅ UI制御思想の完全統一  
✅ ゼロランタイムスタイリング実現  
✅ 76パッケージ削減  
✅ 単一デザイントークンシステム  
✅ TypeScript型安全性維持  
✅ ビルド成功 (738.64 kB)  

### 設計原則

1. **ヘッドレスUI** - Ark UIによるロジック分離
2. **ゼロランタイム** - ビルド時CSS生成
3. **型安全** - TypeScriptフル活用
4. **トークン駆動** - 統一デザインシステム
5. **拡張性** - SerendieUIとPanda CSSの組み合わせ

---

**作成日**: 2026年2月3日  
**対象プロジェクト**: MELGIT-GAI Mallie Frontend  
**バージョン**: 1.0.0
