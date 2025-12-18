-- 特定の日付のデータを確認
SELECT
  date,
  hours,
  deliveries,
  earnings,
  quest,
  rain_quest,
  is_rainy,
  is_holiday,
  created_at,
  updated_at
FROM daily_records
WHERE date = '2025-12-17'
ORDER BY updated_at DESC;
