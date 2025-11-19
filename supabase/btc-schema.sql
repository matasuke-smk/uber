-- ビットコイン積立管理システム - Supabaseスキーマ
-- 実行日: 2025-01-18

-- ===================================
-- 1. 購入履歴テーブル (purchases)
-- ===================================
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_id BIGINT UNIQUE,
  transaction_id BIGINT,
  pair VARCHAR(20) DEFAULT 'btc_jpy',
  order_type VARCHAR(20),
  btc_amount DECIMAL(18, 8),
  jpy_amount DECIMAL(18, 2),
  rate DECIMAL(18, 2),
  fee DECIMAL(18, 2),
  fee_currency VARCHAR(10),
  liquidity VARCHAR(10),
  status VARCHAR(50),
  notes TEXT
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON purchases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_purchases_order_id ON purchases(order_id);

-- RLSポリシー設定
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own purchases" ON purchases;
CREATE POLICY "Users can view their own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own purchases" ON purchases;
CREATE POLICY "Users can insert their own purchases"
  ON purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own purchases" ON purchases;
CREATE POLICY "Users can update their own purchases"
  ON purchases FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own purchases" ON purchases;
CREATE POLICY "Users can delete their own purchases"
  ON purchases FOR DELETE
  USING (auth.uid() = user_id);

-- ===================================
-- 2. 注文履歴テーブル (orders)
-- ===================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_id BIGINT UNIQUE NOT NULL,
  pair VARCHAR(20) DEFAULT 'btc_jpy',
  order_type VARCHAR(20) NOT NULL,
  rate DECIMAL(18, 2),
  amount DECIMAL(18, 8),
  market_buy_amount DECIMAL(18, 2),
  status VARCHAR(50),
  pending_amount DECIMAL(18, 8),
  executed_amount DECIMAL(18, 8),
  stop_loss_rate DECIMAL(18, 2),
  time_in_force VARCHAR(50),
  coincheck_created_at TIMESTAMP WITH TIME ZONE
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- RLSポリシー設定
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
CREATE POLICY "Users can insert their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
CREATE POLICY "Users can update their own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own orders" ON orders;
CREATE POLICY "Users can delete their own orders"
  ON orders FOR DELETE
  USING (auth.uid() = user_id);

-- ===================================
-- 3. 積立統計テーブル (investment_stats)
-- ===================================
CREATE TABLE IF NOT EXISTS investment_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  total_btc DECIMAL(18, 8),
  total_jpy DECIMAL(18, 2),
  average_rate DECIMAL(18, 2),
  total_fee DECIMAL(18, 2),
  purchase_count INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_investment_stats_user_id ON investment_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_investment_stats_date ON investment_stats(date DESC);

-- RLSポリシー設定
ALTER TABLE investment_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own stats" ON investment_stats;
CREATE POLICY "Users can view their own stats"
  ON investment_stats FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own stats" ON investment_stats;
CREATE POLICY "Users can insert their own stats"
  ON investment_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own stats" ON investment_stats;
CREATE POLICY "Users can update their own stats"
  ON investment_stats FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own stats" ON investment_stats;
CREATE POLICY "Users can delete their own stats"
  ON investment_stats FOR DELETE
  USING (auth.uid() = user_id);

-- ===================================
-- 4. 価格履歴テーブル (btc_price_history)
-- ===================================
CREATE TABLE IF NOT EXISTS btc_price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pair VARCHAR(20) DEFAULT 'btc_jpy',
  price DECIMAL(18, 2) NOT NULL
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_price_history_created_at ON btc_price_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_history_pair ON btc_price_history(pair);

-- RLSポリシー設定（全ユーザー参照可能）
ALTER TABLE btc_price_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view price history" ON btc_price_history;
CREATE POLICY "Anyone can view price history"
  ON btc_price_history FOR SELECT
  USING (true);

-- ===================================
-- 5. user_settings テーブルに Coincheck APIキー列を追加
-- ===================================
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS coincheck_api_key TEXT,
ADD COLUMN IF NOT EXISTS coincheck_api_secret TEXT;

-- ===================================
-- 6. トリガー: updated_at自動更新
-- ===================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_investment_stats_updated_at ON investment_stats;
CREATE TRIGGER update_investment_stats_updated_at
  BEFORE UPDATE ON investment_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- 7. 統計自動更新関数
-- ===================================
CREATE OR REPLACE FUNCTION update_investment_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_total_btc DECIMAL(18, 8);
  v_total_jpy DECIMAL(18, 2);
  v_average_rate DECIMAL(18, 2);
  v_total_fee DECIMAL(18, 2);
  v_purchase_count INTEGER;
BEGIN
  -- 新規レコードまたは更新レコードのuser_idを取得
  IF TG_OP = 'DELETE' THEN
    v_user_id := OLD.user_id;
  ELSE
    v_user_id := NEW.user_id;
  END IF;

  -- 統計を計算
  SELECT
    COALESCE(SUM(btc_amount), 0),
    COALESCE(SUM(jpy_amount), 0),
    CASE
      WHEN SUM(btc_amount) > 0 THEN SUM(jpy_amount) / SUM(btc_amount)
      ELSE 0
    END,
    COALESCE(SUM(fee), 0),
    COUNT(*)
  INTO
    v_total_btc,
    v_total_jpy,
    v_average_rate,
    v_total_fee,
    v_purchase_count
  FROM purchases
  WHERE user_id = v_user_id
    AND status = 'completed';

  -- investment_statsに挿入または更新
  INSERT INTO investment_stats (
    user_id,
    date,
    total_btc,
    total_jpy,
    average_rate,
    total_fee,
    purchase_count
  )
  VALUES (
    v_user_id,
    CURRENT_DATE,
    v_total_btc,
    v_total_jpy,
    v_average_rate,
    v_total_fee,
    v_purchase_count
  )
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    total_btc = EXCLUDED.total_btc,
    total_jpy = EXCLUDED.total_jpy,
    average_rate = EXCLUDED.average_rate,
    total_fee = EXCLUDED.total_fee,
    purchase_count = EXCLUDED.purchase_count,
    updated_at = NOW();

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- トリガー設定
DROP TRIGGER IF EXISTS trigger_update_investment_stats ON purchases;
CREATE TRIGGER trigger_update_investment_stats
  AFTER INSERT OR UPDATE OR DELETE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_investment_stats();

-- ===================================
-- 完了メッセージ
-- ===================================
DO $$
BEGIN
  RAISE NOTICE 'ビットコイン積立管理システムのスキーマが正常に作成されました';
END $$;
