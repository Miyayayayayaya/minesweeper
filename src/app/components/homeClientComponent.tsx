'use client';

import Session, { useSessionContext } from 'supertokens-auth-react/recipe/session';
import { MinesweeperGame } from './minesweeperGame';

export const HomeClientComponent = () => {
  // 画面側でログインセッション情報を取得する
  const session = useSessionContext();

  const handleLogout = async () => {
    try {
      // SuperTokensのサーバーにログアウトを通知し、ブラウザのCookieを削除する
      await Session.signOut();
      // ログアウトに成功したら、自動的に /auth（ログイン画面）へリダイレクトされます
    } catch (error) {
      console.error('ログアウト中にエラーが発生しました:', error);
      alert('ログアウトに失敗しました。もう一度お試しください。');
    }
  };
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
      {/* ヘッダーエリア（ユーザー情報 ＆ ログアウトボタン） */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          background: '#f0f0f0',
          borderBottom: '1px solid #ccc',
          fontSize: '14px',
        }}
      >
        <div>
          <strong>ユーザーID:</strong>{' '}
          <code style={{ background: '#e0e0e0', padding: '2px 6px', borderRadius: '4px' }}>
            {session.userId}
          </code>
        </div>

        {/* ログアウトボタン */}
        <button
          onClick={() => {
            void handleLogout();
          }}
          style={{
            padding: '6px 12px',
            background: '#ff4d4f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '12px',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#ff7875')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#ff4d4f')}
        >
          ログアウト
        </button>
      </div>

      {/* ゲーム本体のコンポーネントを起動 */}
      <MinesweeperGame />
    </div>
  );
};
