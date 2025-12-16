/**
 * 注文管理サービス
 *
 * Coincheck APIとSupabaseを連携し、注文の作成・管理・同期を行います。
 */

const CoincheckAPI = require('./coincheck');
const { createClient } = require('@supabase/supabase-js');

class OrderService {
  /**
   * コンストラクタ
   * @param {string} coincheckApiKey - Coincheck APIキー
   * @param {string} coincheckApiSecret - Coincheck APIシークレット
   * @param {string} supabaseUrl - Supabase URL
   * @param {string} supabaseKey - Supabaseサービスキー
   */
  constructor(coincheckApiKey, coincheckApiSecret, supabaseUrl, supabaseKey) {
    this.coincheck = new CoincheckAPI(coincheckApiKey, coincheckApiSecret);
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * 新規注文作成 & Supabaseに保存
   * @param {string} userId - ユーザーID
   * @param {object} orderParams - 注文パラメータ
   * @returns {Promise<object>} 注文結果
   */
  async createAndSaveOrder(userId, orderParams) {
    try {
      // Coincheckに注文を送信
      const orderResult = await this.coincheck.createOrder(orderParams);

      if (!orderResult.success) {
        return orderResult;
      }

      // Supabaseのordersテーブルに保存
      const { data, error } = await this.supabase.from('orders').insert({
        user_id: userId,
        order_id: orderResult.id,
        pair: orderResult.pair,
        order_type: orderResult.order_type,
        rate: orderResult.rate ? parseFloat(orderResult.rate) : null,
        amount: orderParams.amount ? parseFloat(orderParams.amount) : null,
        market_buy_amount: orderParams.market_buy_amount
          ? parseFloat(orderParams.market_buy_amount)
          : null,
        status: 'NEW',
        pending_amount: orderParams.amount ? parseFloat(orderParams.amount) : null,
        executed_amount: 0,
        stop_loss_rate: orderResult.stop_loss_rate
          ? parseFloat(orderResult.stop_loss_rate)
          : null,
        time_in_force: orderResult.time_in_force || 'good_til_cancelled',
        coincheck_created_at: orderResult.created_at
      });

      if (error) {
        console.error('Supabase保存エラー:', error);
        return {
          success: false,
          error: 'データベースへの保存に失敗しました',
          details: error.message
        };
      }

      return {
        success: true,
        order: orderResult,
        saved: true
      };
    } catch (error) {
      console.error('注文作成エラー:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 注文キャンセル & DB更新
   * @param {string} userId - ユーザーID
   * @param {number} orderId - 注文ID
   * @returns {Promise<object>} キャンセル結果
   */
  async cancelAndUpdateOrder(userId, orderId) {
    try {
      // Coincheckで注文キャンセル
      const cancelResult = await this.coincheck.cancelOrder(orderId);

      if (!cancelResult.success) {
        return cancelResult;
      }

      // Supabaseのステータスを更新
      const { data, error } = await this.supabase
        .from('orders')
        .update({
          status: 'CANCELED',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('order_id', orderId);

      if (error) {
        console.error('Supabase更新エラー:', error);
        return {
          success: false,
          error: 'データベースの更新に失敗しました',
          details: error.message
        };
      }

      return {
        success: true,
        message: '注文をキャンセルしました',
        orderId: orderId
      };
    } catch (error) {
      console.error('注文キャンセルエラー:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 注文ステータス更新（CoincheckからSupabaseへ同期）
   * @param {string} userId - ユーザーID
   * @param {number} orderId - 注文ID
   * @returns {Promise<object>} 更新結果
   */
  async updateOrderStatus(userId, orderId) {
    try {
      // Coincheckから最新の注文情報を取得
      const orderDetail = await this.coincheck.getOrder(orderId);

      if (!orderDetail.success) {
        return orderDetail;
      }

      // Supabaseを更新
      const { data, error } = await this.supabase
        .from('orders')
        .update({
          status: orderDetail.status,
          executed_amount: orderDetail.executed_amount
            ? parseFloat(orderDetail.executed_amount)
            : 0,
          pending_amount:
            orderDetail.amount && orderDetail.executed_amount
              ? parseFloat(orderDetail.amount) -
                parseFloat(orderDetail.executed_amount)
              : null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('order_id', orderId);

      if (error) {
        console.error('Supabase更新エラー:', error);
        return {
          success: false,
          error: 'データベースの更新に失敗しました',
          details: error.message
        };
      }

      return {
        success: true,
        order: orderDetail
      };
    } catch (error) {
      console.error('注文ステータス更新エラー:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 取引履歴を同期（CoincheckからSupabaseへ）
   * @param {string} userId - ユーザーID
   * @param {number} limit - 取得件数
   * @returns {Promise<object>} 同期結果
   */
  async syncTransactions(userId, limit = 100) {
    try {
      // Coincheckから取引履歴を取得
      const transactionsResult = await this.coincheck.getTransactions(limit);

      if (!transactionsResult.success) {
        return transactionsResult;
      }

      const transactions = transactionsResult.data || [];
      let syncedCount = 0;
      let errorCount = 0;
      let skippedCount = 0;

      console.log(`取引所から${transactions.length}件の取引を取得`);

      // 7日前の0時0分0秒を計算（UTC）
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      const cutoffDate = sevenDaysAgo.toISOString();

      console.log('取引所取引履歴同期: 基準日時（7日前） =', cutoffDate);

      // 各取引をpurchasesテーブルに保存
      for (const tx of transactions) {
        try {
          console.log(`[取引] ID:${tx.id}, ペア:${tx.pair}, タイプ:${tx.side}, 日時:${tx.created_at}`);

          // BTCペアのみ処理
          if (tx.pair !== 'btc_jpy') {
            console.log(`  → スキップ（BTCペアでない）`);
            skippedCount++;
            continue;
          }

          // 7日以内のデータのみ処理
          if (tx.created_at < cutoffDate) {
            console.log(`  → スキップ（7日より前のデータ）`);
            skippedCount++;
            continue;
          }

          // すでに存在するか確認（transaction_idのみで判定）
          const { data: existing } = await this.supabase
            .from('purchases')
            .select('id')
            .eq('user_id', userId)
            .eq('transaction_id', tx.id)
            .maybeSingle();

          if (existing) {
            console.log(`  → スキップ（既に存在）`);
            skippedCount++;
            continue; // すでに存在する場合はスキップ
          }

          // fundsから金額を計算
          const btcAmount = tx.funds.btc ? parseFloat(tx.funds.btc) : 0;
          const jpyAmount = tx.funds.jpy ? Math.abs(parseFloat(tx.funds.jpy)) : 0;

          // purchasesに挿入
          const { error } = await this.supabase.from('purchases').insert({
            user_id: userId,
            order_id: tx.order_id,
            transaction_id: tx.id,
            pair: tx.pair,
            order_type: tx.side, // "buy" or "sell"
            btc_amount: Math.abs(btcAmount),
            jpy_amount: jpyAmount,
            rate: tx.rate ? parseFloat(tx.rate) : 0,
            fee: tx.fee ? Math.abs(parseFloat(tx.fee)) : 0,
            fee_currency: tx.fee_currency,
            liquidity: tx.liquidity, // "T", "M", "itayose"
            status: 'completed',
            created_at: tx.created_at
          });

          if (error) {
            console.error(`  → 保存エラー:`, error);
            errorCount++;
          } else {
            console.log(`  → 保存成功（BTC:${Math.abs(btcAmount)}, JPY:${jpyAmount}）`);
            syncedCount++;
          }
        } catch (err) {
          console.error('取引処理エラー:', err);
          errorCount++;
        }
      }

      return {
        success: true,
        message: `取引所から${syncedCount}件の取引を同期しました`,
        syncedCount: syncedCount,
        errorCount: errorCount,
        skippedCount: skippedCount,
        totalTransactions: transactions.length,
        cutoffDate: cutoffDate
      };
    } catch (error) {
      console.error('取引履歴同期エラー:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 積立統計を取得
   * @param {string} userId - ユーザーID
   * @returns {Promise<object>} 統計情報
   */
  async getInvestmentStats(userId) {
    try {
      // 最新の統計を取得
      const { data, error } = await this.supabase
        .from('investment_stats')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        console.error('統計取得エラー:', error);
        return {
          success: false,
          error: '統計の取得に失敗しました',
          details: error.message
        };
      }

      if (!data) {
        // データがない場合は空の統計を返す
        return {
          success: true,
          stats: {
            total_btc: 0,
            total_jpy: 0,
            average_rate: 0,
            total_fee: 0,
            purchase_count: 0
          }
        };
      }

      return {
        success: true,
        stats: data
      };
    } catch (error) {
      console.error('統計取得エラー:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 購入履歴を取得
   * @param {string} userId - ユーザーID
   * @param {number} limit - 取得件数
   * @returns {Promise<object>} 購入履歴
   */
  async getPurchaseHistory(userId, limit = 50) {
    try {
      const { data, error } = await this.supabase
        .from('purchases')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('購入履歴取得エラー:', error);
        return {
          success: false,
          error: '購入履歴の取得に失敗しました',
          details: error.message
        };
      }

      return {
        success: true,
        purchases: data || []
      };
    } catch (error) {
      console.error('購入履歴取得エラー:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 未決済注文を取得
   * @param {string} userId - ユーザーID
   * @returns {Promise<object>} 未決済注文一覧
   */
  async getOpenOrdersFromDB(userId) {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['NEW', 'WAITING_FOR_TRIGGER', 'PARTIALLY_FILLED'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('未決済注文取得エラー:', error);
        return {
          success: false,
          error: '未決済注文の取得に失敗しました',
          details: error.message
        };
      }

      return {
        success: true,
        orders: data || []
      };
    } catch (error) {
      console.error('未決済注文取得エラー:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 手動で購入履歴を追加
   * @param {string} userId - ユーザーID
   * @param {string} datetime - 購入日時（ISO 8601形式）
   * @param {number} btcAmount - BTC量
   * @param {number} jpyAmount - 日本円金額
   * @param {number} fee - 手数料
   * @returns {Promise<object>} 追加結果
   */
  async addManualPurchase(userId, datetime, btcAmount, jpyAmount, fee = 0) {
    try {
      // 価格を計算
      const rate = jpyAmount / btcAmount;

      // ユニークなIDを生成（bigint型に対応するため数値のみ）
      // 現在のタイムスタンプ（ミリ秒）を使用
      const uniqueId = Date.now();

      // purchasesに挿入
      const { data, error } = await this.supabase.from('purchases').insert({
        user_id: userId,
        order_id: uniqueId,
        transaction_id: uniqueId,
        pair: 'btc_jpy',
        order_type: 'buy',
        btc_amount: btcAmount,
        jpy_amount: jpyAmount,
        rate: rate,
        fee: fee,
        fee_currency: 'JPY',
        liquidity: 'sales', // 販売所
        status: 'completed',
        created_at: datetime
      });

      if (error) {
        console.error('手動購入追加エラー:', error);
        return {
          success: false,
          error: '購入履歴の追加に失敗しました',
          details: error.message
        };
      }

      return {
        success: true,
        message: '販売所購入を追加しました'
      };
    } catch (error) {
      console.error('手動購入追加エラー:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 指定日時より前の購入履歴を削除
   * @param {string} userId - ユーザーID
   * @param {string} datetime - 基準日時（ISO 8601形式）
   * @returns {Promise<object>} 削除結果
   */
  async deletePurchasesBefore(userId, datetime) {
    try {
      const { data, error, count } = await this.supabase
        .from('purchases')
        .delete({ count: 'exact' })
        .eq('user_id', userId)
        .lt('created_at', datetime);

      if (error) {
        console.error('購入履歴削除エラー:', error);
        return {
          success: false,
          error: '購入履歴の削除に失敗しました',
          details: error.message
        };
      }

      return {
        success: true,
        message: `${count}件の購入履歴を削除しました`,
        deletedCount: count
      };
    } catch (error) {
      console.error('購入履歴削除エラー:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 販売所の購入履歴を同期（一昨日以降のみ）
   * @param {string} userId - ユーザーID
   * @returns {Promise<object>} 同期結果
   */
  async syncBuyHistory(userId) {
    try {
      // 販売所での購入履歴を取得
      const buyResult = await this.coincheck.getBuyHistory();

      if (!buyResult.success) {
        return buyResult;
      }

      const buys = buyResult.data || [];
      let syncedCount = 0;
      let errorCount = 0;

      // 一昨日の0時0分0秒を計算（UTC）
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      twoDaysAgo.setHours(0, 0, 0, 0);
      const cutoffDate = twoDaysAgo.toISOString();

      console.log('販売所購入履歴同期: 基準日時 =', cutoffDate);

      // 各購入をpurchasesテーブルに保存
      for (const buy of buys) {
        try {
          // 一昨日以降のデータのみ処理
          if (buy.created_at < cutoffDate) {
            continue;
          }

          // すでに存在するか確認
          const { data: existing } = await this.supabase
            .from('purchases')
            .select('id')
            .eq('user_id', userId)
            .eq('transaction_id', buy.id)
            .single();

          if (existing) {
            continue; // すでに存在する場合はスキップ
          }

          // BTCとJPYの金額を計算
          const btcAmount = buy.amount ? parseFloat(buy.amount) : 0;
          const jpyAmount = buy.total ? parseFloat(buy.total) : 0;
          const rate = btcAmount > 0 ? jpyAmount / btcAmount : 0;

          // purchasesに挿入
          const { error } = await this.supabase.from('purchases').insert({
            user_id: userId,
            order_id: buy.id, // 販売所の場合はorder_idとして保存
            transaction_id: buy.id,
            pair: 'btc_jpy',
            order_type: 'buy',
            btc_amount: btcAmount,
            jpy_amount: jpyAmount,
            rate: rate,
            fee: buy.fee ? parseFloat(buy.fee) : 0,
            fee_currency: 'JPY',
            liquidity: 'sales', // 販売所を示すマーカー
            status: 'completed',
            created_at: buy.created_at
          });

          if (error) {
            console.error('販売所購入保存エラー:', error);
            errorCount++;
          } else {
            syncedCount++;
          }
        } catch (err) {
          console.error('販売所購入処理エラー:', err);
          errorCount++;
        }
      }

      return {
        success: true,
        message: `販売所から${syncedCount}件の購入履歴を同期しました`,
        syncedCount: syncedCount,
        errorCount: errorCount,
        totalBuys: buys.length,
        cutoffDate: cutoffDate
      };
    } catch (error) {
      console.error('販売所購入履歴同期エラー:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = OrderService;
