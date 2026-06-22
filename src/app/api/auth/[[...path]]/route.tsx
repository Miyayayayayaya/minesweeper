import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getAppDirRequestHandler } from 'supertokens-node/nextjs';
import { ensureSuperTokensInit } from '../../../../config/backend'; // ★config/backend.tsの場所に合わせて調整してください

// 1. サーバー起動時にSuperTokensのバックエンド設定（レシピなど）を初期化する
ensureSuperTokensInit();

// 2. Next.js専用のAPIハンドラー（ミドルウェア）を取得
const handleCall = getAppDirRequestHandler();
// ユーザーが情報を取りに来る通信（GETリクエスト）の処理
export async function GET(request: NextRequest) {
  const res = (await handleCall(request)) as NextResponse | null | undefined;
  // SuperTokensが処理するURL（/api/auth/sessionなど）ならその結果を返し、
  // そうでなければ次のNext.jsの処理へパスする
  return res || NextResponse.next();
}

// ユーザーがログイン情報を送信してくる通信（POSTリクエスト：サインイン・サインアップなど）の処理
export async function POST(request: NextRequest) {
  const res = (await handleCall(request)) as NextResponse | null | undefined;
  return res || NextResponse.next();
}
