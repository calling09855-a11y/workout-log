# WorkoutLog 開発ガイド（Windsurf / Claude Code 用）

> このドキュメントはAIコーディングアシスタント（Windsurf / Claude Code）に渡して、
> 段階的に開発を進めるための指示書です。各Phaseのプロンプトをそのままコピペして使えます。

---

## 🔧 初期セットアップ

### Windsurf に最初に渡すプロンプト

```
このプロジェクトの .windsurfrules を読んで、以下のセットアップを行ってください。

1. Next.js プロジェクトを作成
   - npx create-next-app@latest workoutlog --typescript --tailwind --eslint --app --src-dir
   - src ディレクトリ使用

2. 必要なパッケージをインストール
   - npm install firebase react-hook-form @hookform/resolvers zod recharts react-day-picker date-fns lucide-react
   - npx shadcn-ui@latest init (デフォルト設定でOK)
   - npx shadcn-ui@latest add button input label select card dialog toast sheet tabs badge

3. .windsurfrules に記載されたディレクトリ構造を作成（空ファイルでOK）

4. Firebase設定ファイル src/lib/firebase/config.ts を作成
   - 環境変数から読み込む形式で（.env.local にキーを設定する想定）
   - NEXT_PUBLIC_FIREBASE_API_KEY 等の変数名で

5. .env.local.example を作成して必要な環境変数を記載

6. TypeScript の型定義を src/lib/types/index.ts に作成
   - User, Exercise, WorkoutLog, BodyPhoto, Condition の型
   - .windsurfrules のFirestoreデータ構造に準拠

セットアップ完了後、ファイル構成を見せてください。
```

---

## 📦 Phase 1: MVP（記録入力・一覧・認証）

### Step 1-1: 認証機能

```
Phase 1 Step 1: Firebase認証を実装してください。

【実装内容】
1. src/lib/firebase/auth.ts
   - signUp(email, password, displayName): メール/パスワードで新規登録
   - signIn(email, password): ログイン
   - signOut(): ログアウト
   - onAuthChange(callback): 認証状態の監視

2. src/contexts/AuthContext.tsx
   - AuthProvider: 認証状態をコンテキストで管理
   - useAuth フック: { user, loading, signUp, signIn, signOut }

3. src/components/layout/AuthGuard.tsx
   - 未認証なら /login にリダイレクト
   - loading中はスケルトン表示

4. src/app/login/page.tsx
   - メールアドレス + パスワード入力
   - React Hook Form + Zod バリデーション
   - 「新規登録はこちら」リンク

5. src/app/register/page.tsx
   - メール + パスワード + 表示名
   - 登録成功後、自動ログインしてホームへ遷移
   - プリセット種目をFirestoreに自動登録

【注意事項】
- エラーメッセージは日本語で表示
- パスワードは8文字以上
- shadcn/ui の Button, Input, Label, Card を使用
```

### Step 1-2: プリセット種目データ

```
Phase 1 Step 2: プリセット種目のデータとFirestore関数を実装してください。

【実装内容】
1. src/lib/constants/exercises.ts にプリセット種目を定義
   胸: ベンチプレス, ダンベルフライ, インクラインベンチ, チェストプレスマシン
   背中: デッドリフト, ラットプルダウン, ベントオーバーロー, 懸垂
   肩: ショルダープレス, サイドレイズ, フロントレイズ, フェイスプル
   腕: アームカール, ハンマーカール, トライセプスプッシュダウン, キックバック
   脚: スクワット, レッグプレス, レッグカール, カーフレイズ, ルーマニアンデッドリフト
   体幹: プランク, アブローラー, レッグレイズ, ケーブルクランチ

2. src/lib/firebase/firestore.ts に種目関連の関数
   - initializeExercises(userId): 新規ユーザーにプリセット種目を一括登録
   - getExercises(userId): ユーザーの種目一覧取得
   - addExercise(userId, exercise): カスタム種目追加
   - updateExercise(userId, exerciseId, data): 種目編集
   - deleteExercise(userId, exerciseId): 種目削除

3. src/lib/hooks/useExercises.ts
   - 種目一覧をリアルタイム取得するカスタムフック
   - bodyPartでフィルタリング可能
```

### Step 1-3: トレーニング記録入力

```
Phase 1 Step 3: トレーニング記録の入力機能を実装してください。
これがアプリの最重要機能です。「数字を入れるだけ」で記録完了する UX を最優先にしてください。

【実装内容】
1. src/app/record/page.tsx - 記録入力画面
   - 日付: 今日がデフォルト、変更可能
   - 種目: ドロップダウン選択（部位でグループ化）
   - 重量(kg): 数字入力（テンキー対応、inputmode="decimal"）
   - 回数(reps): 数字入力
   - セット数: 数字入力（デフォルト: 3）
   - コンディション: 5段階セレクト（任意）
   - メモ: テキスト（任意）
   - ボリューム（重量×回数×セット数）を自動計算してリアルタイム表示

2. src/components/workout/RecordForm.tsx
   - React Hook Form + Zod でバリデーション
   - 同じ種目の前回記録をFirestoreから取得し、重量・回数・セット数に薄くプレースホルダー表示
   - 保存成功後「続けて記録」「ホームに戻る」の選択
   - 保存時にボリュームを自動計算して一緒に保存

3. src/components/workout/ExerciseSelect.tsx
   - 部位別にグループ化されたドロップダウン
   - よく使う種目が上位に表示（使用頻度順ソート）

4. src/lib/firebase/firestore.ts に追加
   - addWorkout(userId, data): 記録保存
   - getLatestWorkout(userId, exerciseId): 同種目の前回記録取得
   - getWorkouts(userId, filters): 記録一覧取得（日付範囲・種目フィルター）
   - updateWorkout(userId, workoutId, data): 記録編集
   - deleteWorkout(userId, workoutId): 記録削除

【UXのポイント】
- 種目選択 → 数字3つ入力 → 保存。最短3タップ+数字入力で完了
- 全角数字は自動で半角に変換
- 重量は小数第1位まで対応（例: 62.5kg）
- 保存ボタンは大きく、タップしやすいサイズに
- 保存成功時はトースト通知
```

### Step 1-4: ホームダッシュボード

```
Phase 1 Step 4: ホーム画面（ダッシュボード）を実装してください。

【実装内容】
1. src/app/page.tsx - ダッシュボード
   - 上部: 今月のサマリー（トレーニング回数、総ボリューム）
   - 中部: 小さなカレンダー（トレーニング日にドット表示）
   - 下部: クイック入力フォーム（よく使う種目3つをボタン表示）

2. src/components/workout/QuickInput.tsx
   - よく使う種目がボタンとして並ぶ
   - タップすると前回の数値がプリセットされた入力フォームが開く
   - 数値を変えて保存するだけで記録完了
   - shadcn/ui の Sheet（ボトムシート）で表示

3. src/components/layout/BottomNav.tsx
   - モバイル用下部ナビゲーション
   - タブ: ホーム / 記録 / 履歴 / グラフ / 設定
   - lucide-react のアイコン使用
   - 現在のページをハイライト

4. src/components/layout/Header.tsx
   - アプリ名「WorkoutLog」
   - ユーザー名表示
   - PC表示時はサイドナビとして機能

【レスポンシブ】
- モバイル: 下部タブナビ、1カラム
- PC (md以上): サイドバーナビ、2カラムレイアウト
```

### Step 1-5: 記録一覧・検索

```
Phase 1 Step 5: 記録一覧・検索画面を実装してください。

【実装内容】
1. src/app/history/page.tsx - 記録一覧画面
   - 日付の新しい順に記録を表示
   - 無限スクロール（20件ずつ読み込み）
   - フィルター: 種目名、日付範囲、キーワード（メモ検索）

2. src/components/workout/RecordCard.tsx
   - 1つの記録をカード形式で表示
   - 種目名、重量×回数×セット数、ボリューム、日付
   - コンディションをアイコンで表示
   - 右上の「…」メニューから編集・削除
   - 自己ベスト更新時は🏆バッジ表示
   - 左スワイプで削除（モバイル）

3. 削除時は確認ダイアログを表示

4. 自己ベスト（各種目の最大重量・最大ボリューム）を自動計算しハイライト
```

---

## 📊 Phase 2: グラフ・カレンダー

### Step 2-1: グラフ機能

```
Phase 2 Step 1: グラフ・可視化機能を実装してください。Recharts を使用します。

【実装内容】
1. src/app/graph/page.tsx
   - 上部: 種目選択（複数選択可）+ 期間選択（1週間/1ヶ月/3ヶ月/6ヶ月/1年/全期間）
   - タブ切り替え: 重量推移 / ボリューム推移 / 部位バランス / 成長率

2. src/components/graph/WeightChart.tsx
   - 折れ線グラフ（Recharts LineChart）
   - X軸: 日付、Y軸: 重量(kg)
   - 複数種目を重ねて比較可能
   - ツールチップで詳細表示
   - レスポンシブ（ResponsiveContainer使用）

3. src/components/graph/VolumeChart.tsx
   - 棒グラフ（Recharts BarChart）
   - 日別 or 週別のボリューム推移

4. src/components/graph/BodyPartPie.tsx
   - 円グラフ（Recharts PieChart）
   - 部位別トレーニング頻度の割合
   - 胸/背中/肩/腕/脚/体幹 のバランス表示

5. 週比・月比の成長率をパーセンテージで表示するコンポーネント

6. src/lib/firebase/firestore.ts に追加
   - getWorkoutStats(userId, exerciseId, dateRange): 統計データ取得
   - getBodyPartStats(userId, dateRange): 部位別統計

【デザイン】
- グラフのカラーはテーマカラーに合わせる
- スマホでも見やすいサイズ
- データがない場合は空状態メッセージを表示
```

### Step 2-2: カレンダー機能

```
Phase 2 Step 2: カレンダー機能を実装してください。

【実装内容】
1. src/components/calendar/TrainingCalendar.tsx
   - react-day-picker でカレンダー表示
   - トレーニングした日にドットマーカー
   - 日付タップで、その日の記録一覧をボトムシートで表示
   - 月切り替え対応

2. src/components/calendar/StreakCounter.tsx
   - 連続トレーニング日数（ストリーク）をカウント
   - 現在のストリーク + 最長ストリークを表示
   - 視覚的にわかりやすくアニメーション付き

3. ホーム画面のカレンダーをこのコンポーネントに置き換え

4. カレンダー上部にサマリー表示
   - 今月のトレーニング回数
   - 今月の総ボリューム
   - 前月比の増減
```

---

## 📸 Phase 3: ボディチェック写真

```
Phase 3: ボディチェック写真機能を実装してください。

【実装内容】
1. src/app/body/page.tsx
   - 写真タイムライン表示
   - 新規アップロードボタン

2. src/components/photo/PhotoUpload.tsx
   - カメラ撮影 or アルバム選択
   - 画像プレビュー
   - タグ入力（例:「ダイエット2週目」「バルクアップ期」）
   - Firebase Storage にアップロード
   - アップロード中はプログレスバー表示
   - 画像は自動リサイズ（最大1200px幅）してから保存

3. src/components/photo/PhotoTimeline.tsx
   - 日付順のタイムライン形式で写真を表示
   - グリッド or リスト切り替え
   - 写真タップで拡大表示
   - ビフォーアフター比較モード（2枚並べてスワイプ比較）

4. src/lib/firebase/storage.ts
   - uploadPhoto(userId, file, metadata): 写真アップロード
   - deletePhoto(userId, photoId): 写真削除
   - 画像リサイズ処理

5. src/lib/firebase/firestore.ts に追加
   - addPhoto(userId, data): 写真メタデータ保存
   - getPhotos(userId): 写真一覧取得
   - deletePhotoRecord(userId, photoId): 写真メタデータ削除
```

---

## 📱 Phase 4: PWA化・仕上げ

```
Phase 4: PWA化と仕上げを行ってください。

【実装内容】
1. PWA設定
   - next.config.js に next-pwa 設定追加
   - public/manifest.json 作成（アプリ名、アイコン、テーマカラー）
   - Service Worker でオフライン対応
   - オフライン時に入力したデータはIndexedDBに一時保存、オンライン復帰時に同期

2. src/app/settings/page.tsx - 設定画面
   - プロフィール編集（表示名変更）
   - カスタム種目管理（追加・編集・削除・並び替え）
   - データエクスポート（CSV / JSON）
   - ログアウト
   - アカウント削除

3. Firestore セキュリティルール
   - firestore.rules を作成
   - ユーザーは自分のデータのみ読み書き可能
   - バリデーション: 重量は0以上、回数は1以上、セット数は1以上

4. パフォーマンス最適化
   - 画像の遅延読み込み（next/image）
   - Firestore クエリの最適化（必要なフィールドのみ取得）
   - React.memo で不要な再レンダリング防止

5. アクセシビリティ
   - フォーカス管理
   - aria-label の適切な設定
   - キーボードナビゲーション対応
```

---

## 🚀 デプロイ

```
デプロイの設定をしてください。

【Vercel の場合】
1. vercel.json を作成（リダイレクト設定等）
2. 環境変数の設定手順を README に記載
3. ビルドコマンドの確認

【Firebase Hosting の場合】
1. firebase.json を作成
2. .firebaserc を作成
3. デプロイコマンドをpackage.jsonのscriptsに追加
```

---

## 📝 各Phase完了時の確認事項

各Phaseが完了したら、以下を確認してください：

- [ ] TypeScriptエラーがないか（npm run build が通るか）
- [ ] モバイル表示でレイアウトが崩れていないか
- [ ] Firestoreの読み書きが正常に動作するか
- [ ] エラー時にユーザーにフィードバックが表示されるか
- [ ] ローディング状態が適切に表示されるか

---

## 🔑 Firebase セットアップ手順

開発を始める前に Firebase プロジェクトを作成する必要があります：

1. https://console.firebase.google.com/ で新規プロジェクト作成
2. Authentication → メール/パスワード認証を有効化
3. Firestore Database → 本番モードで作成
4. Storage → 有効化
5. プロジェクト設定 → ウェブアプリ追加 → 設定値をコピー
6. .env.local に設定値を貼り付け（.env.local.example を参照）
