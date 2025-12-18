-- すべてのデータを確認
-- 実行日: 2025-12-18

-- user_settings（設定データ）を確認
SELECT
  user_id,
  weekday_avg_price,
  weekend_avg_price,
  weekday_deliveries_per_hour,
  weekend_deliveries_per_hour,
  use_auto_calculate,
  target_amount,
  current_week_start,
  hours,
  weekday_quests,
  weekend_quests,
  is_dark_mode,
  coincheck_api_key IS NOT NULL as has_coincheck_key,
  coincheck_api_secret IS NOT NULL as has_coincheck_secret,
  vision_api_key IS NOT NULL as has_vision_key,
  created_at,
  updated_at
FROM user_settings
ORDER BY updated_at DESC
LIMIT 5;

-- daily_records（日別データ）の最新10件を確認
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
ORDER BY date DESC
LIMIT 10;
