// config/backend.ts
import supertokens from 'supertokens-node';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import { appInfo } from './appInfo';

export function ensureSuperTokensInit() {
  supertokens.init({
    framework: 'custom', // ★Next.js用に指定
    supertokens: {
      connectionURI: 'https://try.supertokens.com', // SuperTokensの住所
    },
    appInfo,
    recipeList: [
      EmailPassword.init(), // メール・パスワード認証を有効化
      Session.init(), // セッション（ログイン維持）機能を有効化
    ],
    isInServerlessEnv: true, // ★Vercelのサーバーレス環境で動かすために指定
  });
}
