-- 電子帳簿保存法対応のためのテーブル更新
-- このSQLをSupabase SQL Editorで実行してください

-- 1. expensesテーブルに必要なカラムを追加
ALTER TABLE expenses
ADD COLUMN IF NOT EXISTS vendor TEXT,
ADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS original_hash TEXT,
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS locked_at TIMESTAMPTZ;

-- 2. 変更履歴テーブルの作成
CREATE TABLE IF NOT EXISTS expense_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE,
  operation VARCHAR(10) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT
);

-- 3. インデックスの作成（検索高速化）
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_amount ON expenses(amount);
CREATE INDEX IF NOT EXISTS idx_expenses_vendor ON expenses(vendor);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date);

-- 4. 監査ログトリガー関数の作成
CREATE OR REPLACE FUNCTION log_expense_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO expense_audit_log(expense_id, operation, changed_by, new_values)
    VALUES (NEW.id, 'INSERT', NEW.user_id, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- ロックされた経費は変更不可
    IF OLD.is_locked = TRUE THEN
      RAISE EXCEPTION 'この経費は確定済みのため変更できません';
    END IF;

    INSERT INTO expense_audit_log(expense_id, operation, changed_by, old_values, new_values)
    VALUES (NEW.id, 'UPDATE', NEW.user_id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- ロックされた経費は削除不可
    IF OLD.is_locked = TRUE THEN
      RAISE EXCEPTION 'この経費は確定済みのため削除できません';
    END IF;

    INSERT INTO expense_audit_log(expense_id, operation, changed_by, old_values)
    VALUES (OLD.id, 'DELETE', OLD.user_id, to_jsonb(OLD));
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 5. トリガーの作成
DROP TRIGGER IF EXISTS expense_audit_trigger ON expenses;
CREATE TRIGGER expense_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON expenses
FOR EACH ROW EXECUTE FUNCTION log_expense_changes();

-- 6. 3営業日後に自動ロックする関数（タイムスタンプ代替）
CREATE OR REPLACE FUNCTION auto_lock_expenses()
RETURNS void AS $$
BEGIN
  UPDATE expenses
  SET is_locked = TRUE,
      locked_at = NOW()
  WHERE uploaded_at <= NOW() - INTERVAL '3 days'
    AND is_locked = FALSE;
END;
$$ LANGUAGE plpgsql;

-- 7. RLS（行レベルセキュリティ）ポリシーの更新
ALTER TABLE expense_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audit logs" ON expense_audit_log
  FOR SELECT USING (
    expense_id IN (
      SELECT id FROM expenses WHERE user_id = auth.uid()
    )
  );