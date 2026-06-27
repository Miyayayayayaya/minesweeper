// src/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { withSession } from 'supertokens-node/nextjs';
import { ensureSuperTokensInit } from './config/backend';

ensureSuperTokensInit();

export function middleware(request: NextRequest) {
  // 1. withSession を使って、リクエストしてきたユーザーのセッションをチェック
  console.log('警備員（ミドルウェア）が起動しました！アクセス先:', request.nextUrl.pathname);
  return withSession(request, (err, session) => {
    if (err) {
      // 重大なエラー時はそのまま次にパス
      return NextResponse.next();
    }

    // 2. もしセッションが存在しない（未ログイン）場合
    if (session === undefined) {
      // ログイン画面（/auth）へ強制リダイレクト
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    // 3. 無事にログインしていれば、本来行きたかったページへそのまま通す
    return NextResponse.next();
  });
}

// 4. この警備員（ミドルウェア）を「どのURL」で発動させるかの設定
export const config = {
  matcher: ['/((?!api/auth|auth|images|_next/static|_next/image|favicon.ico).*)'],
};
