/**
 * Uber BTC積立管理システム - Expressサーバー
 *
 * Coincheck APIとSupabaseを連携し、REST APIを提供します。
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const CoincheckAPI = require('./api/coincheck');
const OrderService = require('./api/orders');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア設定
app.use(express.json());

// CORS設定
const corsOptions = {
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:5500', 'http://127.0.0.1:5500'],
  credentials: true
};
app.use(cors(corsOptions));

// ログミドルウェア
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ==================== ヘルスチェック ====================
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Uber BTC Backend API'
  });
});

// ==================== Public API (認証不要) ====================

/**
 * ティッカー取得
 * GET /api/ticker?pair=btc_jpy
 */
app.get('/api/ticker', async (req, res) => {
  try {
    const pair = req.query.pair || 'btc_jpy';
    const coincheck = new CoincheckAPI('', ''); // Public APIは認証不要
    const result = await coincheck.getTicker(pair);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('ティッカー取得エラー:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 板情報取得
 * GET /api/orderbook?pair=btc_jpy
 */
app.get('/api/orderbook', async (req, res) => {
  try {
    const pair = req.query.pair || 'btc_jpy';
    const coincheck = new CoincheckAPI('', ''); // Public APIは認証不要
    const result = await coincheck.getOrderBook(pair);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('板情報取得エラー:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== Private API (ユーザー認証必要) ====================

/**
 * ミドルウェア: ユーザーAPIキー検証
 * リクエストヘッダーから user_id, api_key, api_secret を取得
 */
const authenticateUser = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const apiKey = req.headers['x-api-key'];
  const apiSecret = req.headers['x-api-secret'];

  if (!userId || !apiKey || !apiSecret) {
    return res.status(401).json({
      success: false,
      error: '認証情報が不足しています（x-user-id, x-api-key, x-api-secret）'
    });
  }

  req.userId = userId;
  req.apiKey = apiKey;
  req.apiSecret = apiSecret;
  next();
};

/**
 * 残高取得
 * GET /api/balance
 * Headers: x-user-id, x-api-key, x-api-secret
 */
app.get('/api/balance', authenticateUser, async (req, res) => {
  try {
    const coincheck = new CoincheckAPI(req.apiKey, req.apiSecret);
    const result = await coincheck.getBalance();

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('残高取得エラー:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 新規注文作成
 * POST /api/orders
 * Headers: x-user-id, x-api-key, x-api-secret
 * Body: { pair, order_type, rate, amount, market_buy_amount }
 */
app.post('/api/orders', authenticateUser, async (req, res) => {
  try {
    const orderService = new OrderService(
      req.apiKey,
      req.apiSecret,
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const result = await orderService.createAndSaveOrder(req.userId, req.body);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('新規注文エラー:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 注文キャンセル
 * DELETE /api/orders/:orderId
 * Headers: x-user-id, x-api-key, x-api-secret
 */
app.delete('/api/orders/:orderId', authenticateUser, async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId);

    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        error: '無効な注文IDです'
      });
    }

    const orderService = new OrderService(
      req.apiKey,
      req.apiSecret,
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const result = await orderService.cancelAndUpdateOrder(req.userId, orderId);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('注文キャンセルエラー:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 注文ステータス更新
 * PUT /api/orders/:orderId/status
 * Headers: x-user-id, x-api-key, x-api-secret
 */
app.put('/api/orders/:orderId/status', authenticateUser, async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId);

    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        error: '無効な注文IDです'
      });
    }

    const orderService = new OrderService(
      req.apiKey,
      req.apiSecret,
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const result = await orderService.updateOrderStatus(req.userId, orderId);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('ステータス更新エラー:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 未決済注文一覧取得
 * GET /api/orders/open
 * Headers: x-user-id, x-api-key, x-api-secret
 */
app.get('/api/orders/open', authenticateUser, async (req, res) => {
  try {
    const orderService = new OrderService(
      req.apiKey,
      req.apiSecret,
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const result = await orderService.getOpenOrdersFromDB(req.userId);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('未決済注文取得エラー:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 取引履歴同期
 * POST /api/sync/transactions
 * Headers: x-user-id, x-api-key, x-api-secret
 * Body: { limit }
 */
app.post('/api/sync/transactions', authenticateUser, async (req, res) => {
  try {
    const limit = req.body.limit || 100;

    const orderService = new OrderService(
      req.apiKey,
      req.apiSecret,
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const result = await orderService.syncTransactions(req.userId, limit);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('取引履歴同期エラー:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 積立統計取得
 * GET /api/stats
 * Headers: x-user-id, x-api-key, x-api-secret
 */
app.get('/api/stats', authenticateUser, async (req, res) => {
  try {
    const orderService = new OrderService(
      req.apiKey,
      req.apiSecret,
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const result = await orderService.getInvestmentStats(req.userId);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('統計取得エラー:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 購入履歴取得
 * GET /api/purchases?limit=50
 * Headers: x-user-id, x-api-key, x-api-secret
 */
app.get('/api/purchases', authenticateUser, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const orderService = new OrderService(
      req.apiKey,
      req.apiSecret,
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const result = await orderService.getPurchaseHistory(req.userId, limit);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('購入履歴取得エラー:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== エラーハンドリングミドルウェア ====================

app.use((err, req, res, next) => {
  console.error('エラーミドルウェア:', err);
  res.status(500).json({
    success: false,
    error: 'サーバー内部エラーが発生しました',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404ハンドラー
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'エンドポイントが見つかりません'
  });
});

// ==================== サーバー起動 ====================

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Uber BTC Backend API サーバー起動`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log('='.repeat(50));
});

// グレースフルシャットダウン
process.on('SIGTERM', () => {
  console.log('SIGTERM受信 - サーバーをシャットダウンします...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT受信 - サーバーをシャットダウンします...');
  process.exit(0);
});
