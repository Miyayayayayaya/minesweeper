// src/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { withSession } from 'supertokens-node/nextjs';
import { ensureSuperTokensInit } from './config/backend'; // パスは環境に合わせてね

ensureSuperTokensInit();

export async function middleware(request: NextRequest) {
  // 1. withSession を使って、リクエストしてきたユーザーのセッション（ログイン状態）をチェック
  return withSession(request, async (err, session) => {
    if (err) {
      // 何らかの重大なエラーが起きた場合は、リクエストをそのまま次にパス（またはエラーハンドリング）
      return await Promise.resolve(NextResponse.next());
    }

    // 2. もしセッションが存在しない（未ログイン）場合
    if (session === undefined) {
      // ログイン画面（/auth）へ強制リダイレクト（追い返し）する
      return await Promise.resolve(NextResponse.redirect(new URL('/auth', request.url)));
    }

    // 3. 無事にログインしていれば、本来行きたかったページへそのまま通す
    return await Promise.resolve(NextResponse.next());
  });
}

// 4. この警備員（ミドルウェア）を「どのURL」で発動させるかの設定
export const config = {
  // ログイン画面（/auth）や、SuperTokensのAPI（/api/auth）などを【除外】し、
  // それ以外の全てのページ（マイページやゲーム画面など）に鍵をかける設定
  matcher: ['/((?!api/auth|auth|images|_next/static|_next/image|favicon.ico).*)'],
};
