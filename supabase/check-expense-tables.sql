-- 既存のテーブル構造を確認
-- 実行日: 2025-12-18

-- expense_audit_logテーブルの構造を確認
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'expense_audit_log'
ORDER BY ordinal_position;

-- expensesテーブルの構造を確認
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'expenses'
ORDER BY ordinal_position;

-- 既存のRLSポリシーを確認
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('expenses', 'expense_audit_log')
ORDER BY tablename, policyname;
