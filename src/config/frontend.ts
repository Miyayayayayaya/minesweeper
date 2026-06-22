// config/frontend.ts
import EmailPasswordReact from 'supertokens-auth-react/recipe/emailpassword';
import SessionReact from 'supertokens-auth-react/recipe/session';
import { appInfo } from './appInfo';

export const frontendConfig = () => {
  return {
    appInfo,
    recipeList: [
      EmailPasswordReact.init(), // 画面側にメール・パスワードのUIを準備
      SessionReact.init(), // 画面側でクッキーの監視を準備
    ],
  };
};
