import React, { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    budget: '',
    deadline: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // フォーム送信のシミュレーション
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubmitMessage('お問い合わせありがとうございます。2-3営業日以内にご返信いたします。')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        budget: '',
        deadline: ''
      })
    } catch (error) {
      setSubmitMessage('送信に失敗しました。もう一度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  const budgetOptions = [
    '〜5万円',
    '5万円〜10万円',
    '10万円〜30万円',
    '30万円〜50万円',
    '50万円〜100万円',
    '100万円以上',
    '要相談'
  ]

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="section-title">お問い合わせ</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* お問い合わせフォーム */}
          <div className="card">
            <h2 className="text-2xl font-bold text-primary-400 mb-6">ご依頼・ご相談フォーム</h2>
            
            {submitMessage && (
              <div className={`p-4 rounded-lg mb-6 ${
                submitMessage.includes('ありがとう') 
                  ? 'bg-primary-900 border border-primary-600 text-primary-100'
                  : 'bg-red-900 border border-red-600 text-red-100'
              }`}>
                {submitMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    お名前 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="田中太郎"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    メールアドレス <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  件名
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="看板デザインのご依頼について"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
                    ご予算
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                  >
                    <option value="">選択してください</option>
                    {budgetOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-300 mb-2">
                    希望納期
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  メッセージ <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                  placeholder="プロジェクトの詳細、ご要望、参考資料等がございましたらお聞かせください。"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-300 ${
                  isSubmitting
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    送信中...
                  </div>
                ) : (
                  '送信する'
                )}
              </button>
            </form>
          </div>

          {/* 連絡先情報 */}
          <div className="space-y-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-primary-400 mb-4">お問い合わせについて</h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  デザインのご依頼やご相談は、お気軽にお問い合わせください。
                  まずは簡単なヒアリングをさせていただき、最適なご提案をいたします。
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">営業時間：平日 9:00-18:00</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">返信目安：2-3営業日以内</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-primary-400 mb-4">制作の流れ</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 mt-1">1</div>
                  <div>
                    <h4 className="font-medium text-white mb-1">お問い合わせ・ヒアリング</h4>
                    <p className="text-gray-400 text-sm">ご要望をお聞かせください</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 mt-1">2</div>
                  <div>
                    <h4 className="font-medium text-white mb-1">お見積もり・ご契約</h4>
                    <p className="text-gray-400 text-sm">料金と制作期間をご提示</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 mt-1">3</div>
                  <div>
                    <h4 className="font-medium text-white mb-1">デザイン制作</h4>
                    <p className="text-gray-400 text-sm">初稿提案と修正対応</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 mt-1">4</div>
                  <div>
                    <h4 className="font-medium text-white mb-1">納品・お支払い</h4>
                    <p className="text-gray-400 text-sm">完成データの納品</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-primary-400 mb-4">よくある質問</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">Q. 修正は何回まで可能ですか？</h4>
                  <p className="text-gray-400 text-sm">基本プランでは2回まで無料修正が可能です。追加修正は1回5,000円で承ります。</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Q. 急ぎの依頼は可能ですか？</h4>
                  <p className="text-gray-400 text-sm">1週間以内の急ぎ対応は+30%の特急料金で承ります。まずはご相談ください。</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Q. 制作途中での変更は可能ですか？</h4>
                  <p className="text-gray-400 text-sm">初稿提案後の大幅な変更は追加料金が発生する場合があります。事前にご相談ください。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact