-- expense_audit_logテーブルのRLSポリシーを修正
-- このSQLをSupabase SQL Editorで実行してください

-- 1. 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can view their own audit logs" ON expense_audit_log;

-- 2. 監査ログトリガー関数を修正（auth.uid()を使用）
CREATE OR REPLACE FUNCTION log_expense_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO expense_audit_log(expense_id, operation, changed_by, new_values)
    VALUES (NEW.id, 'INSERT', auth.uid(), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- ロックされた経費は変更不可
    IF OLD.is_locked = TRUE THEN
      RAISE EXCEPTION 'この経費は確定済みのため変更できません';
    END IF;

    INSERT INTO expense_audit_log(expense_id, operation, changed_by, old_values, new_values)
    VALUES (NEW.id, 'UPDATE', auth.uid(), to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- ロックされた経費は削除不可
    IF OLD.is_locked = TRUE THEN
      RAISE EXCEPTION 'この経費は確定済みのため削除できません';
    END IF;

    INSERT INTO expense_audit_log(expense_id, operation, changed_by, old_values)
    VALUES (OLD.id, 'DELETE', auth.uid(), to_jsonb(OLD));
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. RLSポリシーを再作成

-- SELECTポリシー: ユーザーは自分の経費の監査ログを閲覧できる
CREATE POLICY "Users can view their own audit logs" ON expense_audit_log
  FOR SELECT USING (
    expense_id IN (
      SELECT id FROM expenses WHERE user_id = auth.uid()
    )
  );

-- INSERTポリシー: トリガー経由でのみ挿入可能（SECURITY DEFINERにより実行）
-- 注: トリガー関数にSECURITY DEFINERを設定したため、
-- トリガー経由の挿入はポリシーをバイパスします

-- 別の方法: より明示的なポリシー
CREATE POLICY "Allow insert for expense owners" ON expense_audit_log
  FOR INSERT WITH CHECK (
    expense_id IN (
      SELECT id FROM expenses WHERE user_id = auth.uid()
    )
  );

-- 4. トリガーを再作成してSECURITY DEFINER関数を使用
DROP TRIGGER IF EXISTS expense_audit_trigger ON expenses;
CREATE TRIGGER expense_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON expenses
FOR EACH ROW EXECUTE FUNCTION log_expense_changes();

-- 5. 既存のデータがある場合の権限修正
-- 既存の監査ログのchanged_byを修正（必要に応じて）
UPDATE expense_audit_log
SET changed_by = e.user_id
FROM expenses e
WHERE expense_audit_log.expense_id = e.id
  AND expense_audit_log.changed_by IS NULL;