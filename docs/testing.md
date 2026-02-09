# テストガイド

このドキュメントでは、Vitestを使用したテストの作成・実行方法を説明します。

## テストフレームワーク

### 使用技術

- **Vitest 3.1**: Vite対応の高速テストランナー
- **React Testing Library**: Reactコンポーネントテスト
- **jsdom**: ブラウザ環境のシミュレーション
- **@testing-library/user-event**: ユーザーインタラクションのシミュレーション

## テストの種類

### ユニットテスト

個別の関数やコンポーネントをテストします。

**配置**: `tests/unit/`

**例**: フック、ユーティリティ関数、単純なコンポーネント

### 統合テスト

複数のコンポーネントやモジュールの連携をテストします。

**配置**: `tests/integration/`

**例**: ページ全体、複雑な機能フロー

## テストコマンド

```bash
# 全テスト実行（カバレッジ付き）
npm run test

# ユニットテストのみ
npm run test:unit

# 統合テストのみ
npm run test:integration

# ウォッチモード（ファイル変更を監視）
npm run test:watch

# UIモード（ブラウザでインタラクティブに実行）
npm run test:ui

# カバレッジレポート生成
npm run test -- --coverage
```

## テスト設定

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup/vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.*',
        '**/types/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### vitest.setup.ts

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// 各テスト後にクリーンアップ
afterEach(() => {
  cleanup();
});
```

## テストの書き方

### ユニットテスト例

#### 1. カスタムフックのテスト

```typescript
// tests/unit/hooks/useResponsive.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useResponsive } from '../../../src/hooks/useResponsive';

describe('useResponsive', () => {
  beforeEach(() => {
    // 初期ウィンドウサイズを設定
    global.innerWidth = 1024;
  });

  afterEach(() => {
    // クリーンアップ
    global.innerWidth = 1024;
  });

  it('デスクトップサイズでisMobileがfalseを返す', () => {
    const { result } = renderHook(() => useResponsive());
    expect(result.current.isMobile).toBe(false);
  });

  it('モバイルサイズでisMobileがtrueを返す', () => {
    global.innerWidth = 375;
    const { result } = renderHook(() => useResponsive());
    expect(result.current.isMobile).toBe(true);
  });

  it('ウィンドウリサイズ時にisMobileが更新される', () => {
    const { result } = renderHook(() => useResponsive());
    
    expect(result.current.isMobile).toBe(false);

    act(() => {
      global.innerWidth = 375;
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.isMobile).toBe(true);
  });
});
```

#### 2. コンポーネントのテスト

```typescript
// tests/unit/components/ChatInput.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChatInput } from '../../../src/features/chat/components/ChatInput';

describe('ChatInput', () => {
  it('入力フィールドが表示される', () => {
    render(<ChatInput onSend={vi.fn()} />);
    const textarea = screen.getByPlaceholderText('メッセージを入力');
    expect(textarea).toBeInTheDocument();
  });

  it('送信ボタンをクリックするとonSendが呼ばれる', () => {
    const handleSend = vi.fn();
    render(<ChatInput onSend={handleSend} />);

    const textarea = screen.getByPlaceholderText('メッセージを入力');
    const sendButton = screen.getByRole('button', { name: '送信' });

    fireEvent.change(textarea, { target: { value: 'テストメッセージ' } });
    fireEvent.click(sendButton);

    expect(handleSend).toHaveBeenCalledWith('テストメッセージ');
  });

  it('空の入力では送信ボタンが無効化される', () => {
    render(<ChatInput onSend={vi.fn()} />);
    const sendButton = screen.getByRole('button', { name: '送信' });
    expect(sendButton).toBeDisabled();
  });
});
```

#### 3. ユーティリティ関数のテスト

```typescript
// tests/unit/utils/formatDate.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from '../../../src/utils/formatDate';

describe('formatDate', () => {
  it('日付を正しくフォーマットする', () => {
    const date = new Date('2024-01-15T10:30:00');
    expect(formatDate(date)).toBe('2024/01/15 10:30');
  });

  it('不正な日付でエラーをスローする', () => {
    expect(() => formatDate(new Date('invalid'))).toThrow();
  });
});
```

### 統合テスト例

```typescript
// tests/integration/ChatFlow.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { ChatContainer } from '../../src/features/chat/components/ChatContainer';
import { AppProvider } from '../../src/app/provider';

describe('チャットフロー統合テスト', () => {
  beforeEach(() => {
    // モックAPIのセットアップ
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'AIの応答' }),
      })
    );
  });

  it('ユーザーがメッセージを送信してAIの応答を受け取る', async () => {
    const user = userEvent.setup();
    
    render(
      <AppProvider>
        <ChatContainer />
      </AppProvider>
    );

    // メッセージ入力
    const textarea = screen.getByPlaceholderText('メッセージを入力');
    await user.type(textarea, 'こんにちは');

    // 送信
    const sendButton = screen.getByRole('button', { name: '送信' });
    await user.click(sendButton);

    // ユーザーメッセージが表示される
    expect(screen.getByText('こんにちは')).toBeInTheDocument();

    // AIの応答を待つ
    await waitFor(() => {
      expect(screen.getByText('AIの応答')).toBeInTheDocument();
    });
  });
});
```

## モックの使い方

### APIモック

```typescript
import { vi } from 'vitest';

// fetchをモック
global.fetch = vi.fn((url) => {
  if (url === '/api/chat') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'モックレスポンス' }),
    });
  }
  return Promise.reject(new Error('Not found'));
});
```

### MSALモック

```typescript
// tests/mocks/msalMock.ts
import { vi } from 'vitest';

export const mockMsalInstance = {
  initialize: vi.fn().mockResolvedValue(undefined),
  getAllAccounts: vi.fn().mockReturnValue([
    {
      name: 'テストユーザー',
      username: 'test@example.com',
    },
  ]),
  acquireTokenSilent: vi.fn().mockResolvedValue({
    accessToken: 'mock-token',
  }),
  loginRedirect: vi.fn(),
  logoutRedirect: vi.fn(),
};
```

使用例：

```typescript
import { mockMsalInstance } from '../../mocks/msalMock';

vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: mockMsalInstance,
    accounts: mockMsalInstance.getAllAccounts(),
  }),
  MsalProvider: ({ children }) => children,
}));
```

## カバレッジ

### カバレッジレポートの見方

```bash
npm run test -- --coverage
```

出力例：

```
----------------------|---------|---------|---------|---------|
File                  | % Stmts | % Branch| % Funcs | % Lines |
----------------------|---------|---------|---------|---------|
All files             |   85.32 |   78.45 |   82.11 |   85.32 |
 components/          |   92.15 |   87.32 |   90.00 |   92.15 |
  ChatInput.tsx       |   95.00 |   90.00 |   100.0 |   95.00 |
  ChatContainer.tsx   |   89.30 |   84.64 |   80.00 |   89.30 |
 hooks/               |   78.00 |   69.58 |   74.22 |   78.00 |
  useAuth.ts          |   80.00 |   75.00 |   80.00 |   80.00 |
----------------------|---------|---------|---------|---------|
```

**カバレッジ指標**:
- **Statements**: 実行された文の割合
- **Branch**: 条件分岐のカバー率
- **Functions**: テストされた関数の割合
- **Lines**: 実行された行の割合

### カバレッジ目標

- **全体**: 80%以上
- **クリティカルなロジック**: 90%以上
- **UIコンポーネント**: 70%以上

### HTMLレポート

```bash
npm run test -- --coverage
```

生成された `coverage/index.html` をブラウザで開くと、詳細なカバレッジレポートが確認できます。

## ベストプラクティス

### 1. テストは独立させる

各テストは他のテストに依存せず、独立して実行できるようにしてください。

```typescript
// ❌ 悪い例：前のテストに依存
describe('Counter', () => {
  let count = 0;

  it('インクリメント', () => {
    count++;
    expect(count).toBe(1);
  });

  it('デクリメント', () => {
    count--; // 前のテストの状態に依存
    expect(count).toBe(0);
  });
});

// ✅ 良い例：独立したテスト
describe('Counter', () => {
  it('インクリメント', () => {
    let count = 0;
    count++;
    expect(count).toBe(1);
  });

  it('デクリメント', () => {
    let count = 1;
    count--;
    expect(count).toBe(0);
  });
});
```

### 2. テストの命名

テスト名は「何をテストするか」を明確に記述してください。

```typescript
// ❌ 悪い例
it('test1', () => { /* ... */ });

// ✅ 良い例
it('空の入力では送信ボタンが無効化される', () => { /* ... */ });
```

### 3. AAA パターン

- **Arrange**: テストの準備
- **Act**: 実行
- **Assert**: 検証

```typescript
it('ボタンクリックでカウンターが増える', () => {
  // Arrange
  render(<Counter />);
  const button = screen.getByRole('button', { name: '+' });

  // Act
  fireEvent.click(button);

  // Assert
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

### 4. 実装ではなく動作をテスト

内部実装ではなく、ユーザーから見た動作をテストしてください。

```typescript
// ❌ 悪い例：内部実装に依存
it('setCountが呼ばれる', () => {
  const setCount = vi.fn();
  render(<Counter setCount={setCount} />);
  fireEvent.click(screen.getByRole('button'));
  expect(setCount).toHaveBeenCalled();
});

// ✅ 良い例：ユーザーから見た動作
it('ボタンクリックで表示が更新される', () => {
  render(<Counter />);
  expect(screen.getByText('0')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '+' }));
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

### 5. エッジケースのテスト

正常系だけでなく、エッジケースもテストしてください。

```typescript
describe('ChatInput', () => {
  it('正常な入力で送信できる', () => { /* ... */ });
  it('空の入力では送信できない', () => { /* ... */ });
  it('最大文字数を超える入力は制限される', () => { /* ... */ });
  it('特殊文字を含む入力でも正しく動作する', () => { /* ... */ });
});
```

## トラブルシューティング

### テストが遅い

**原因**: 不必要な再レンダリングやAPIコール

**解決策**:
- モックを活用
- `waitFor`のタイムアウトを調整
- 並列実行を有効化（`vitest.config.ts`で`threads: true`）

### テストが不安定

**原因**: 非同期処理のタイミング問題

**解決策**:
```typescript
// ❌ 悪い例
await new Promise(resolve => setTimeout(resolve, 100));

// ✅ 良い例
await waitFor(() => {
  expect(screen.getByText('ロード完了')).toBeInTheDocument();
});
```

### モックがリセットされない

**解決策**:
```typescript
afterEach(() => {
  vi.clearAllMocks(); // 全モックをクリア
});
```

## 参考リソース

- [Vitest 公式ドキュメント](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
