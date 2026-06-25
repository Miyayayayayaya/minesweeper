'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SuperTokens from 'supertokens-auth-react';
import Session from 'supertokens-auth-react/recipe/session';

export const TryRefreshComponent = () => {
  const router = useRouter();
  const [didError, setDidError] = useState(false);

  useEffect(() => {
    // セッションの自動延長（リフレッシュ）を試みる非同期関数
    const attemptRefresh = async () => {
      try {
        // 裏鍵（リフレッシュトークン）を使って通信
        const hasSession = await Session.attemptRefreshingSession();

        if (hasSession) {
          // 延長に成功したら、画面を最新状態に更新してゲームを続行
          router.refresh();
        } else {
          // 完全に有効期限が切れていたら、ログイン画面へ誘導
          void SuperTokens.redirectToAuth();
        }
      } catch (error) {
        // ネットワークエラーなど予期せぬトラブル時はエラー状態にする
        setDidError(true);
      }
    };

    void attemptRefresh();
  }, [router]);

  // エラー発生時の表示
  if (didError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        セッションの更新に失敗しました。ページを再読み込みしてください。
      </div>
    );
  }

  // 通信中の待機表示
  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
    >
      <p>セッションを再確認中...</p>
    </div>
  );
};
