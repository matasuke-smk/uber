-- 経費削除時の監査ログエラーを修正
-- このSQLをSupabase SQL Editorで実行してください

-- トリガー関数を修正（DELETEのみBEFOREに変更）
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

    -- DELETEの場合はBEFOREトリガーで実行されるため、親レコードがまだ存在する
    INSERT INTO expense_audit_log(expense_id, operation, changed_by, old_values)
    VALUES (OLD.id, 'DELETE', OLD.user_id, to_jsonb(OLD));
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 既存のトリガーを削除
DROP TRIGGER IF EXISTS expense_audit_trigger ON expenses;

-- INSERT/UPDATEはAFTER、DELETEはBEFOREに分割
-- AFTER INSERT/UPDATE トリガー
CREATE TRIGGER expense_audit_after_trigger
AFTER INSERT OR UPDATE ON expenses
FOR EACH ROW EXECUTE FUNCTION log_expense_changes();

-- BEFORE DELETE トリガー
CREATE TRIGGER expense_audit_before_delete_trigger
BEFORE DELETE ON expenses
FOR EACH ROW EXECUTE FUNCTION log_expense_changes();
