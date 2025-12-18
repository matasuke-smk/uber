-- 経費管理システム - Supabaseスキーマ
-- 実行日: 2025-12-18

-- ===================================
-- 1. 経費テーブル (expenses)
-- ===================================
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date DATE NOT NULL,
  category VARCHAR(50),
  description TEXT,
  amount DECIMAL(18, 2) NOT NULL,
  business_percentage INTEGER DEFAULT 100,
  accounting_subject VARCHAR(100),
  credit_account VARCHAR(100),
  photo_url TEXT,
  memo TEXT,
  vendor VARCHAR(200),
  uploaded_at TIMESTAMP WITH TIME ZONE,
  original_hash TEXT
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_vendor ON expenses(vendor);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

-- RLSポリシー設定
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own expenses" ON expenses;
CREATE POLICY "Users can view their own expenses"
  ON expenses FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own expenses" ON expenses;
CREATE POLICY "Users can insert their own expenses"
  ON expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own expenses" ON expenses;
CREATE POLICY "Users can update their own expenses"
  ON expenses FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own expenses" ON expenses;
CREATE POLICY "Users can delete their own expenses"
  ON expenses FOR DELETE
  USING (auth.uid() = user_id);

-- ===================================
-- 2. 経費監査ログテーブル (expense_audit_log)
-- ===================================
CREATE TABLE IF NOT EXISTS expense_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  action VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_data JSONB,
  new_data JSONB,
  changed_fields TEXT[]
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_expense_audit_log_user_id ON expense_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_expense_audit_log_expense_id ON expense_audit_log(expense_id);
CREATE INDEX IF NOT EXISTS idx_expense_audit_log_created_at ON expense_audit_log(created_at DESC);

-- RLSポリシー設定
ALTER TABLE expense_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own expense audit logs" ON expense_audit_log;
CREATE POLICY "Users can view their own expense audit logs"
  ON expense_audit_log FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own expense audit logs" ON expense_audit_log;
CREATE POLICY "Users can insert their own expense audit logs"
  ON expense_audit_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ===================================
-- 3. トリガー: updated_at自動更新
-- ===================================
CREATE OR REPLACE FUNCTION update_expenses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_expenses_updated_at_trigger ON expenses;
CREATE TRIGGER update_expenses_updated_at_trigger
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_expenses_updated_at();

-- ===================================
-- 4. トリガー: 経費監査ログ自動作成
-- ===================================
CREATE OR REPLACE FUNCTION log_expense_changes()
RETURNS TRIGGER AS $$
DECLARE
  v_changed_fields TEXT[];
  v_old_data JSONB;
  v_new_data JSONB;
  v_user_id UUID;
BEGIN
  -- user_idを取得
  IF TG_OP = 'DELETE' THEN
    v_user_id := OLD.user_id;
  ELSE
    v_user_id := NEW.user_id;
  END IF;

  -- INSERT操作
  IF TG_OP = 'INSERT' THEN
    v_new_data := to_jsonb(NEW);
    INSERT INTO expense_audit_log (user_id, expense_id, action, new_data)
    VALUES (v_user_id, NEW.id, 'INSERT', v_new_data);
    RETURN NEW;
  END IF;

  -- UPDATE操作
  IF TG_OP = 'UPDATE' THEN
    v_old_data := to_jsonb(OLD);
    v_new_data := to_jsonb(NEW);

    -- 変更されたフィールドを検出
    v_changed_fields := ARRAY[]::TEXT[];
    IF OLD.date IS DISTINCT FROM NEW.date THEN
      v_changed_fields := array_append(v_changed_fields, 'date');
    END IF;
    IF OLD.amount IS DISTINCT FROM NEW.amount THEN
      v_changed_fields := array_append(v_changed_fields, 'amount');
    END IF;
    IF OLD.business_percentage IS DISTINCT FROM NEW.business_percentage THEN
      v_changed_fields := array_append(v_changed_fields, 'business_percentage');
    END IF;
    IF OLD.vendor IS DISTINCT FROM NEW.vendor THEN
      v_changed_fields := array_append(v_changed_fields, 'vendor');
    END IF;
    IF OLD.memo IS DISTINCT FROM NEW.memo THEN
      v_changed_fields := array_append(v_changed_fields, 'memo');
    END IF;

    -- 変更があった場合のみログを記録
    IF array_length(v_changed_fields, 1) > 0 THEN
      INSERT INTO expense_audit_log (user_id, expense_id, action, old_data, new_data, changed_fields)
      VALUES (v_user_id, NEW.id, 'UPDATE', v_old_data, v_new_data, v_changed_fields);
    END IF;
    RETURN NEW;
  END IF;

  -- DELETE操作
  IF TG_OP = 'DELETE' THEN
    v_old_data := to_jsonb(OLD);
    INSERT INTO expense_audit_log (user_id, expense_id, action, old_data)
    VALUES (v_user_id, OLD.id, 'DELETE', v_old_data);
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS log_expense_changes_trigger ON expenses;
CREATE TRIGGER log_expense_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION log_expense_changes();

-- ===================================
-- 完了メッセージ
-- ===================================
DO $$
BEGIN
  RAISE NOTICE '経費管理システムのスキーマが正常に作成されました';
END $$;
