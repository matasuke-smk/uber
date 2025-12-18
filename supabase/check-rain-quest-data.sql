-- rain_questカラムのデータを確認
-- 実行日: 2025-12-18

-- daily_recordsテーブルの最新10件を確認
SELECT
  date,
  hours,
  deliveries,
  earnings,
  quest,
  rain_quest,
  is_rainy,
  is_holiday,
  updated_at
FROM daily_records
ORDER BY updated_at DESC
LIMIT 10;
