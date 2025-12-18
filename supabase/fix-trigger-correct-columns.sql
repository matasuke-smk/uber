-- expense_audit_logトリガー関数を正しいカラム名で修正
-- 実行日: 2025-12-18

-- 正しいカラム名でトリガー関数を再作成
CREATE OR REPLACE FUNCTION log_expense_changes()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO expense_audit_log (
      expense_id,
      operation,
      changed_by,
      changed_at,
      new_values
    )
    VALUES (
      NEW.id,
      'INSERT',
      NEW.user_id,
      NOW(),
      to_jsonb(NEW)
    );
    RETURN NEW;

  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO expense_audit_log (
      expense_id,
      operation,
      changed_by,
      changed_at,
      old_values,
      new_values
    )
    VALUES (
      NEW.id,
      'UPDATE',
      NEW.user_id,
      NOW(),
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;

  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO expense_audit_log (
      expense_id,
      operation,
      changed_by,
      changed_at,
      old_values
    )
    VALUES (
      OLD.id,
      'DELETE',
      OLD.user_id,
      NOW(),
      to_jsonb(OLD)
    );
    RETURN OLD;
  END IF;
END;
$$;

-- トリガーを再作成（念のため）
DROP TRIGGER IF EXISTS log_expense_changes_trigger ON expenses;
CREATE TRIGGER log_expense_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION log_expense_changes();

-- 完了メッセージ
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'トリガー関数を正しいカラム名で修正しました';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'カラムマッピング:';
  RAISE NOTICE '  - operation (INSERT/UPDATE/DELETE)';
  RAISE NOTICE '  - changed_by (user_id)';
  RAISE NOTICE '  - changed_at (timestamp)';
  RAISE NOTICE '  - old_values (JSONB)';
  RAISE NOTICE '  - new_values (JSONB)';
  RAISE NOTICE '';
  RAISE NOTICE 'SECURITY DEFINER設定により、RLSをバイパスして';
  RAISE NOTICE '監査ログを安全に記録できます。';
  RAISE NOTICE '========================================';
END $$;
