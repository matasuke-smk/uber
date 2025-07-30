import React from 'react'

const Pricing = () => {
  const pricingPlans = [
    {
      id: 'signage',
      title: '看板デザイン',
      basePrice: '50,000円〜',
      features: [
        '初回打ち合わせ・ヒアリング',
        'デザインコンセプト提案',
        '3案まで初期デザイン提示',
        '2回まで修正対応',
        'AI形式での納品',
        '商用利用権付与'
      ],
      popular: false,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      id: 'character',
      title: 'キャラクターデザイン',
      basePrice: '80,000円〜',
      features: [
        '詳細ヒアリング・設定確認',
        'キャラクター設定資料作成',
        '基本ポーズ3パターン',
        '表情差分3パターン',
        '高解像度PNG/AI納品',
        '商用利用権付与',
        '2回まで大幅修正対応'
      ],
      popular: true,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 'decal',
      title: 'デカールデザイン',
      basePrice: '30,000円〜',
      features: [
        '車両サイズ・形状確認',
        'デザインコンセプト相談',
        '2案まで初期提案',
        '実車装着イメージ作成',
        'カッティング用データ制作',
        '1回まで修正対応'
      ],
      popular: false,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ]

  const additionalServices = [
    { service: '急ぎ対応（1週間以内納品）', price: '+30%' },
    { service: '追加修正（3回目以降）', price: '5,000円/回' },
    { service: 'ロゴデザイン', price: '40,000円〜' },
    { service: 'パッケージデザイン', price: '60,000円〜' },
    { service: 'Webバナー制作', price: '15,000円〜' },
    { service: 'アニメーション追加', price: '20,000円〜' }
  ]

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="section-title">料金表</h1>
        
        <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
          下記は基本料金です。プロジェクトの規模や複雑さに応じて料金が変動します。<br />
          まずはお気軽にご相談ください。
        </p>

        {/* メイン料金プラン */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map(plan => (
            <div
              key={plan.id}
              className={`card relative ${plan.popular ? 'border-primary-500 shadow-primary-500/20' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    人気
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  plan.popular ? 'bg-primary-600' : 'bg-dark-700'
                }`}>
                  <div className={plan.popular ? 'text-white' : 'text-primary-400'}>
                    {plan.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-primary-400 mb-2">{plan.title}</h3>
                <div className="text-3xl font-bold text-white mb-1">{plan.basePrice}</div>
                <p className="text-gray-400 text-sm">（税別・基本料金）</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-primary-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}>
                相談する
              </button>
            </div>
          ))}
        </div>

        {/* 追加サービス・オプション */}
        <div className="card">
          <h2 className="text-2xl font-bold text-primary-400 mb-6 text-center">追加サービス・オプション</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalServices.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-dark-700 last:border-b-0">
                <span className="text-gray-300">{item.service}</span>
                <span className="text-primary-400 font-semibold">{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 注意事項 */}
        <div className="mt-12 card">
          <h3 className="text-xl font-semibold text-primary-400 mb-4">お支払いについて</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• 制作開始前に50%の前金をお支払いいただきます</li>
            <li>• 残金は納品確認後1週間以内にお支払いください</li>
            <li>• 銀行振込、PayPay、各種クレジットカードに対応</li>
            <li>• 領収書の発行が可能です</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-primary-400 mt-6 mb-4">制作期間について</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• 看板デザイン：2〜3週間</li>
            <li>• キャラクターデザイン：3〜4週間</li>
            <li>• デカールデザイン：1〜2週間</li>
            <li>• 修正回数や内容により期間が延長される場合があります</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-300 mb-6">
            プロジェクトの詳細をお聞かせください。<br />
            お見積もりは無料です。
          </p>
          <button className="btn-primary text-lg px-8 py-4">
            無料見積もりを依頼する
          </button>
        </div>
      </div>
    </div>
  )
}

export default Pricing