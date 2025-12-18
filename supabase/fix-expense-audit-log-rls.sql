-- 経費監査ログテーブルのRLSポリシー修正
-- 実行日: 2025-12-18

-- ===================================
-- expense_audit_logテーブルのRLSポリシー設定
-- ===================================

-- 既存のポリシーを削除して再作成
DROP POLICY IF EXISTS "Users can insert their own expense audit logs" ON expense_audit_log;
DROP POLICY IF EXISTS "Users can view their own expense audit logs" ON expense_audit_log;

-- INSERTポリシー: ユーザーは自分の監査ログを挿入できる
CREATE POLICY "Users can insert their own expense audit logs"
  ON expense_audit_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- SELECTポリシー: ユーザーは自分の監査ログを閲覧できる
CREATE POLICY "Users can view their own expense audit logs"
  ON expense_audit_log FOR SELECT
  USING (auth.uid() = user_id);

-- 完了メッセージ
DO $$
BEGIN
  RAISE NOTICE 'expense_audit_logテーブルのRLSポリシーが正常に更新されました';
END $$;
