/**
 * Coincheck API クライアント
 *
 * Coincheck取引所のPublic/Private APIへのアクセスを提供します。
 *
 * 認証仕様:
 * - ACCESS-KEY: APIキー
 * - ACCESS-NONCE: UNIXタイムスタンプ（ミリ秒）
 * - ACCESS-SIGNATURE: HMAC-SHA256(nonce + url + body, secret)
 */

const crypto = require('crypto');
const fetch = require('node-fetch');

class CoincheckAPI {
  /**
   * コンストラクタ
   * @param {string} apiKey - CoincheckのAPIキー
   * @param {string} apiSecret - CoincheckのAPIシークレット
   */
  constructor(apiKey, apiSecret) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.baseURL = 'https://coincheck.com';
  }

  /**
   * HMAC-SHA256署名を生成
   * @param {string} nonce - タイムスタンプ（ミリ秒）
   * @param {string} url - リクエストURL
   * @param {string} body - リクエストボディ（デフォルト: 空文字）
   * @returns {string} 署名
   */
  generateSignature(nonce, url, body = '') {
    const message = nonce + url + body;
    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(message)
      .digest('hex');
  }

  /**
   * Private APIリクエストのヘッダーを生成
   * @param {string} url - リクエストURL
   * @param {string} body - リクエストボディ（デフォルト: 空文字）
   * @returns {object} ヘッダー
   */
  generateHeaders(url, body = '') {
    const nonce = Date.now().toString();
    const signature = this.generateSignature(nonce, url, body);

    return {
      'ACCESS-KEY': this.apiKey,
      'ACCESS-NONCE': nonce,
      'ACCESS-SIGNATURE': signature,
      'Content-Type': 'application/json'
    };
  }

  /**
   * GETリクエスト（Public API）
   * @param {string} endpoint - APIエンドポイント
   * @returns {Promise<object>} レスポンス
   */
  async publicGet(endpoint) {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Public API Error (${response.status}):`, errorText);
        return {
          success: false,
          error: `HTTP Error: ${response.status}`,
          details: errorText
        };
      }

      const data = await response.json();
      return { success: true, ...data };
    } catch (error) {
      console.error('Public API通信エラー:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * GETリクエスト（Private API）
   * @param {string} endpoint - APIエンドポイント
   * @returns {Promise<object>} レスポンス
   */
  async privateGet(endpoint) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.generateHeaders(url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers
      });

      if (response.status === 429) {
        console.error('レート制限に達しました');
        return {
          success: false,
          error: 'リクエストが多すぎます。しばらく待ってください。'
        };
      }

      if (response.status === 401 || response.status === 403) {
        console.error('認証エラー: APIキーを確認してください');
        return {
          success: false,
          error: 'APIキーの認証に失敗しました'
        };
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Private API Error (${response.status}):`, errorText);
        return {
          success: false,
          error: `HTTP Error: ${response.status}`,
          details: errorText
        };
      }

      const data = await response.json();
      return { success: true, ...data };
    } catch (error) {
      console.error('Private API通信エラー:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * POSTリクエスト（Private API）
   * @param {string} endpoint - APIエンドポイント
   * @param {object} params - リクエストパラメータ
   * @returns {Promise<object>} レスポンス
   */
  async privatePost(endpoint, params = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const body = JSON.stringify(params);
    const headers = this.generateHeaders(url, body);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body
      });

      if (response.status === 429) {
        console.error('レート制限に達しました');
        return {
          success: false,
          error: 'リクエストが多すぎます。しばらく待ってください。'
        };
      }

      if (response.status === 401 || response.status === 403) {
        console.error('認証エラー: APIキーを確認してください');
        return {
          success: false,
          error: 'APIキーの認証に失敗しました'
        };
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Private API Error (${response.status}):`, errorText);
        return {
          success: false,
          error: `HTTP Error: ${response.status}`,
          details: errorText
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Private API通信エラー:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * DELETEリクエスト（Private API）
   * @param {string} endpoint - APIエンドポイント
   * @returns {Promise<object>} レスポンス
   */
  async privateDelete(endpoint) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.generateHeaders(url);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: headers
      });

      if (response.status === 429) {
        console.error('レート制限に達しました');
        return {
          success: false,
          error: 'リクエストが多すぎます。しばらく待ってください。'
        };
      }

      if (response.status === 401 || response.status === 403) {
        console.error('認証エラー: APIキーを確認してください');
        return {
          success: false,
          error: 'APIキーの認証に失敗しました'
        };
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Private API Error (${response.status}):`, errorText);
        return {
          success: false,
          error: `HTTP Error: ${response.status}`,
          details: errorText
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Private API通信エラー:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== Public API ====================

  /**
   * ティッカー取得
   * @param {string} pair - 取引ペア（デフォルト: btc_jpy）
   * @returns {Promise<object>} ティッカー情報
   */
  async getTicker(pair = 'btc_jpy') {
    return await this.publicGet(`/api/ticker?pair=${pair}`);
  }

  /**
   * 板情報取得
   * @param {string} pair - 取引ペア（デフォルト: btc_jpy）
   * @returns {Promise<object>} 板情報
   */
  async getOrderBook(pair = 'btc_jpy') {
    return await this.publicGet(`/api/order_books?pair=${pair}`);
  }

  // ==================== Private API ====================

  /**
   * 残高取得
   * @returns {Promise<object>} 残高情報
   */
  async getBalance() {
    return await this.privateGet('/api/accounts/balance');
  }

  /**
   * 新規注文
   * @param {object} params - 注文パラメータ
   * @param {string} params.pair - 取引ペア（例: 'btc_jpy'）
   * @param {string} params.order_type - 注文タイプ（'buy', 'sell', 'market_buy', 'market_sell'）
   * @param {number} params.rate - 注文レート（指値注文の場合）
   * @param {number} params.amount - 注文量（指値注文、成行売りの場合）
   * @param {number} params.market_buy_amount - 日本円金額（成行買いの場合）
   * @returns {Promise<object>} 注文結果
   */
  async createOrder(params) {
    // バリデーション
    if (!params.pair || !params.order_type) {
      return {
        success: false,
        error: '必須パラメータが不足しています（pair, order_type）'
      };
    }

    return await this.privatePost('/api/exchange/orders', params);
  }

  /**
   * 注文詳細取得
   * @param {number} orderId - 注文ID
   * @returns {Promise<object>} 注文詳細
   */
  async getOrder(orderId) {
    return await this.privateGet(`/api/exchange/orders/${orderId}`);
  }

  /**
   * 未決済注文一覧取得
   * @returns {Promise<object>} 未決済注文一覧
   */
  async getOpenOrders() {
    return await this.privateGet('/api/exchange/orders/opens');
  }

  /**
   * 注文キャンセル
   * @param {number} orderId - 注文ID
   * @returns {Promise<object>} キャンセル結果
   */
  async cancelOrder(orderId) {
    return await this.privateDelete(`/api/exchange/orders/${orderId}`);
  }

  /**
   * 取引履歴取得（ページネーション）
   * @param {number} limit - 取得件数（デフォルト: 100）
   * @returns {Promise<object>} 取引履歴
   */
  async getTransactions(limit = 100) {
    return await this.privateGet(
      `/api/exchange/orders/transactions_pagination?limit=${limit}`
    );
  }
}

module.exports = CoincheckAPI;
