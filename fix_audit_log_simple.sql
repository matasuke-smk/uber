-- シンプルな修正方法: expense_audit_logのRLSを調整
-- このSQLをSupabase SQL Editorで実行してください

-- オプション1: expense_audit_logのRLSを無効化（推奨）
-- 監査ログはトリガー経由でのみ書き込まれ、閲覧は制限されるべき
ALTER TABLE expense_audit_log DISABLE ROW LEVEL SECURITY;

-- もしくは、オプション2: RLSを有効のまま、適切なポリシーを設定
-- （上記でRLSを無効化した場合はこれらは不要）

/*
-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can view their own audit logs" ON expense_audit_log;
DROP POLICY IF EXISTS "Allow insert for expense owners" ON expense_audit_log;

-- RLSを有効化
ALTER TABLE expense_audit_log ENABLE ROW LEVEL SECURITY;

-- SELECTポリシー: ユーザーは自分の経費の監査ログのみ閲覧可能
CREATE POLICY "audit_log_select_policy" ON expense_audit_log
  FOR SELECT
  USING (
    changed_by = auth.uid() OR
    expense_id IN (
      SELECT id FROM expenses WHERE user_id = auth.uid()
    )
  );

-- INSERTポリシー: 認証されたユーザーのみ挿入可能（トリガー経由）
CREATE POLICY "audit_log_insert_policy" ON expense_audit_log
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- UPDATEとDELETEは禁止（監査ログは変更・削除不可）
-- ポリシーを作らないことで自動的に禁止される
*/

-- トリガー関数の修正（auth.uid()を適切に使用）
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

-- トリガーの再作成
DROP TRIGGER IF EXISTS expense_audit_trigger ON expenses;
CREATE TRIGGER expense_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON expenses
FOR EACH ROW EXECUTE FUNCTION log_expense_changes();