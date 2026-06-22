'use client';

import { useEffect, useState } from 'react';
import { redirectToAuth } from 'supertokens-auth-react';
import { EmailPasswordPreBuiltUI } from 'supertokens-auth-react/recipe/emailpassword/prebuiltui';
import SuperTokens from 'supertokens-auth-react/ui';

export default function AuthPage() {
  // 画面がブラウザ側で完全に読み込まれた（マウントされた）か管理するステート
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setInitialized(true);

    // もしすでにログインしている場合や、変なURL（例: /auth/invalid-url）にアクセスされた場合は、
    // 自動的に適切な画面、またはログイン画面の初期状態にリダイレクトさせる保険の処理
    if (SuperTokens.canHandleRoute([EmailPasswordPreBuiltUI]) === false) {
      void redirectToAuth();
    }
  }, []);

  // サーバーサイドレンダリング（SSR）時のチラつきやエラーを防ぐため、
  // ブラウザ側での準備が整うまでは真っ白な画面（null）を返します
  if (!initialized) {
    return null;
  }

  // SuperTokensが用意してくれている、完成済みのログイン/新規登録の見た目（UI）をドカンと表示します
  return SuperTokens.getRoutingComponent([EmailPasswordPreBuiltUI]);
}
