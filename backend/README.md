# Uber BTC積立管理システム - バックエンドAPI

Coincheck APIを使用したビットコイン積立管理システムのバックエンドサーバー

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`をコピーして`.env`を作成し、必要な値を設定してください。

```bash
cp .env.example .env
```

#### 必要な環境変数:

- **COINCHECK_API_KEY**: Coincheck APIキー
- **COINCHECK_API_SECRET**: Coincheck APIシークレット
- **SUPABASE_URL**: SupabaseプロジェクトのURL
- **SUPABASE_ANON_KEY**: Supabase匿名キー
- **SUPABASE_SERVICE_KEY**: Supabaseサービスロールキー
- **PORT**: サーバーポート（デフォルト: 3000）
- **CORS_ORIGIN**: 許可するフロントエンドのURL

### 3. Supabaseテーブルの作成

`../supabase/btc-schema.sql`をSupabaseのSQLエディタで実行してください。

### 4. サーバーの起動

#### 開発環境:
```bash
npm run dev
```

#### 本番環境:
```bash
npm start
```

サーバーは `http://localhost:3000` で起動します。

## APIエンドポイント

### Public API (認証不要)

- **GET /api/ticker** - 現在のBTC価格を取得
- **GET /api/orderbook** - 板情報を取得

### Private API (ユーザー認証必要)

#### 残高
- **GET /api/balance** - 残高を取得

#### 注文
- **POST /api/orders** - 新規注文作成（成行・指値）
- **DELETE /api/orders/:orderId** - 注文キャンセル
- **PUT /api/orders/:orderId/status** - 注文ステータス更新
- **GET /api/orders/open** - 未決済注文一覧

#### 同期
- **POST /api/sync/transactions** - 取引履歴を同期

#### 統計
- **GET /api/stats** - 積立統計を取得

## セキュリティ

- APIキーは**環境変数**でのみ管理
- クライアント側には**絶対に露出させない**
- `.env`ファイルは`.gitignore`に追加済み
- Supabase RLSで認証済みユーザーのみアクセス可能

## レート制限

Coincheck APIのレート制限:
- 新規注文: **秒間5リクエストまで**
- 注文詳細取得: **秒間1リクエストまで**

429エラーが返された場合は適切に処理されます。

## エラーハンドリング

すべてのエンドポイントは以下の形式でエラーを返します:

```json
{
  "success": false,
  "error": "エラーメッセージ"
}
```

## 開発者向け

### ディレクトリ構造

```
backend/
├── api/
│   ├── coincheck.js    # Coincheck APIクライアント
│   └── orders.js        # 注文管理サービス
├── server.js            # Expressサーバー
├── package.json
├── .env                 # 環境変数（gitignore）
└── README.md
```

### ログ

詳細なエラー情報はコンソールに出力されます。

```javascript
console.error('注文作成エラー:', {
  endpoint: url,
  params: params,
  error: error.message
});
```
