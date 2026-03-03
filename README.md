# WorkoutLog - 筋トレ記録管理Webアプリ

数字を入力するだけで筋トレを記録・管理できるWebアプリケーション。

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **UI**: shadcn/ui + Recharts
- **バックエンド**: Firebase (Firestore + Auth + Storage)
- **デプロイ**: Vercel / Firebase Hosting

## セットアップ

### 1. Firebase プロジェクト作成

1. [Firebase Console](https://console.firebase.google.com/) で新規プロジェクトを作成
2. **Authentication** → 「メール/パスワード」を有効化
3. **Firestore Database** → 本番モードで作成
4. **Storage** → 有効化
5. **プロジェクト設定** → 「ウェブアプリを追加」→ 設定値をコピー

### 2. 環境変数の設定

```bash
cp .env.local.example .env.local
```

`.env.local` に Firebase の設定値を記入してください。

### 3. インストール & 起動

```bash
npm install
npm run dev
```

http://localhost:3000 でアクセスできます。

### 4. Firestore セキュリティルール

```bash
firebase deploy --only firestore:rules
```

## 開発ガイド

詳しい開発手順は [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) を参照してください。
Windsurf / Claude Code で段階的に開発を進めるための指示書になっています。

## プロジェクト構成

```
src/
├── app/          # ページ (Next.js App Router)
├── components/   # UIコンポーネント
├── lib/          # ロジック・ユーティリティ
│   ├── firebase/ # Firebase関連
│   ├── types/    # TypeScript型定義
│   ├── constants/# 定数データ
│   ├── utils/    # ユーティリティ関数
│   └── hooks/    # カスタムフック
└── contexts/     # React Context
```

## 機能一覧

| 機能 | 説明 |
|------|------|
| トレーニング記録 | 種目・重量・回数・セット数を数字で入力 |
| クイック入力 | よく使う種目をワンタップで前回値プリセット |
| 記録一覧・検索 | 種目・日付・キーワードで絞り込み |
| グラフ | 重量推移・ボリューム推移・部位バランス |
| カレンダー | トレーニング日マーカー・ストリーク表示 |
| ボディチェック | 写真アップロード・タイムライン・比較 |
| データエクスポート | CSV / JSON でダウンロード |
| PWA | ホーム画面追加・オフライン対応 |

## ライセンス

Private
