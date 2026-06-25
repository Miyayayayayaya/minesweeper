'use client';

import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import { MinesweeperGame } from './minesweeperGame';

export const HomeClientComponent = () => {
  // 画面側でログインセッション情報を取得する
  const session = useSessionContext();

  // 1. セッション情報の読み込み中（Cookieの確認中など）の表示
  if (session.loading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <p>読み込み中...</p>
      </div>
    );
  }

  // 2. 万が一セッションが存在しない（未ログイン）場合の表示
  // (middleware.ts が先に動くため基本ここには来ませんが、型安全のための保険です)
  if (session.doesSessionExist === false) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>ログインセッションがありません。ログインしてください。</p>
      </div>
    );
  }

  // 3. 無事にログインが確認できたら、マインスイーパーのゲーム画面を表示する
  return (
    <div>
      {/* ログイン中のユーザーIDを確認したい場合は、このように使えます */}
      <div style={{ padding: '10px', background: '#f0f0f0', fontSize: '12px', textAlign: 'right' }}>
        ユーザーID: {session.userId}
      </div>

      {/* ゲーム本体のコンポーネントを起動 */}
      <MinesweeperGame />
    </div>
  );
};
