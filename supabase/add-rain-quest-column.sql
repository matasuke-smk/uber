-- daily_recordsテーブルに雨クエストカラムを追加
-- 実行日: 2025-12-18

-- rain_questカラムを追加（既存の場合はスキップ）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'daily_records' AND column_name = 'rain_quest'
  ) THEN
    ALTER TABLE daily_records ADD COLUMN rain_quest DECIMAL(18, 2) DEFAULT 0;
    RAISE NOTICE 'rain_questカラムを追加しました';
  ELSE
    RAISE NOTICE 'rain_questカラムは既に存在します';
  END IF;
END $$;

-- 完了メッセージ
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '雨クエストカラムの追加が完了しました';
  RAISE NOTICE '========================================';
END $$;
