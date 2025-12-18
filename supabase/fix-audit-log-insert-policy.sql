-- expense_audit_logテーブルのINSERTポリシーを追加
-- 実行日: 2025-12-18

-- トリガーからINSERTできるようにSECURITY DEFINERポリシーを追加
-- または、expense_idを通じてuser_idを検証するポリシーを追加

-- 方法1: トリガー関数をSECURITY DEFINERにする（推奨）
-- まず、既存のトリガー関数を確認して再作成

-- 既存のトリガー関数をSECURITY DEFINERに変更
CREATE OR REPLACE FUNCTION log_expense_changes()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO expense_audit_log (expense_id, action, new_data, timestamp)
    VALUES (NEW.id, 'INSERT', to_jsonb(NEW), NOW());
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO expense_audit_log (expense_id, action, old_data, new_data, timestamp)
    VALUES (NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), NOW());
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO expense_audit_log (expense_id, action, old_data, timestamp)
    VALUES (OLD.id, 'DELETE', to_jsonb(OLD), NOW());
    RETURN OLD;
  END IF;
END;
$$;

-- トリガーを再作成
DROP TRIGGER IF EXISTS log_expense_changes_trigger ON expenses;
CREATE TRIGGER log_expense_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION log_expense_changes();

-- 完了メッセージ
DO $$
BEGIN
  RAISE NOTICE 'expense_audit_logのトリガー関数をSECURITY DEFINERに変更しました';
  RAISE NOTICE 'これによりRLSポリシーをバイパスして監査ログを書き込めます';
END $$;
