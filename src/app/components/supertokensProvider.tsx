'use client'; // ★ここでクライアントコンポーネントとして宣言する

import SuperTokensReact, { SuperTokensWrapper } from 'supertokens-auth-react';
import { frontendConfig } from '../../config/frontend'; // パスは環境に合わせて調整してください

if (typeof window !== 'undefined') {
  SuperTokensReact.init(frontendConfig());
}

export const SuperTokensProvider = ({ children }: { children: React.ReactNode }) => {
  return <SuperTokensWrapper>{children}</SuperTokensWrapper>;
};
