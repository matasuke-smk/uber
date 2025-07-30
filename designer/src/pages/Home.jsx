import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import ParallaxSection from '../components/ParallaxSection'
import SEOHead from '../components/SEOHead'
import ImageModal from '../components/ImageModal'

const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')

  // ポートフォリオデータ
  const portfolioItems = [
    {
      id: 1,
      title: '和風居酒屋の看板',
      category: 'signage',
      year: '2024',
      client: '○○居酒屋',
      tools: 'Adobe Illustrator, Photoshop',
      description: '伝統的な和の要素を現代的にアレンジした看板デザイン。木目調の背景に書道風の文字を配置し、温かみのある雰囲気を演出しました。',
      image: '/images/portfolio/signage/sample1.jpg'
    },
    {
      id: 2,
      title: 'RPGゲームキャラクター',
      category: 'characters',
      year: '2024',
      client: 'ゲーム会社A',
      tools: 'Procreate, Clip Studio Paint',
      description: 'ファンタジーRPGの主人公キャラクター。勇敢さと親しみやすさを兼ね備えたデザインを心がけました。',
      image: '/images/portfolio/characters/sample1.jpg'
    },
    {
      id: 3,
      title: 'バイクカスタムデカール',
      category: 'decals',
      year: '2023',
      client: '個人オーナー',
      tools: 'Adobe Illustrator',
      description: 'スポーツバイク用のフルカスタムデカール。スピード感と躍動感を表現したダイナミックなデザインです。',
      image: '/images/portfolio/decals/sample1.jpg'
    },
    {
      id: 4,
      title: 'カフェのロゴデザイン',
      category: 'others',
      year: '2024',
      client: '○○カフェ',
      tools: 'Adobe Illustrator',
      description: 'コーヒーの香りと温かい雰囲気を表現したカフェのロゴ。シンプルながらも印象に残るデザインを目指しました。',
      image: '/images/portfolio/others/sample1.jpg'
    },
    {
      id: 5,
      title: 'レストランの外壁看板',
      category: 'signage',
      year: '2023',
      client: 'イタリアンレストラン',
      tools: 'Adobe Illustrator, Photoshop',
      description: 'イタリアンレストランの外壁看板。明るく親しみやすい色調で、通りからでも目を引くデザインにしました。',
      image: '/images/portfolio/signage/sample2.jpg'
    },
    {
      id: 6,
      title: 'マスコットキャラクター',
      category: 'characters',
      year: '2023',
      client: '地域イベント実行委員会',
      tools: 'Adobe Illustrator, Procreate',
      description: '地域イベントのマスコットキャラクター。老若男女に愛されるような親しみやすいデザインを制作しました。',
      image: '/images/portfolio/characters/sample2.jpg'
    }
  ]

  const categories = [
    { id: 'all', label: 'すべて', count: portfolioItems.length },
    { id: 'signage', label: '看板デザイン', count: portfolioItems.filter(item => item.category === 'signage').length },
    { id: 'characters', label: 'キャラクター', count: portfolioItems.filter(item => item.category === 'characters').length },
    { id: 'decals', label: 'デカール', count: portfolioItems.filter(item => item.category === 'decals').length },
    { id: 'others', label: 'その他', count: portfolioItems.filter(item => item.category === 'others').length }
  ]

  const filteredItems = activeCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory)

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

  const openModal = (item) => {
    setSelectedImage(item)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  return (
    <>
      <SEOHead 
        title="新井大地（Arai Daichi） - イラストレーター・デザイナー"
        description="新井大地（Arai Daichi）のポートフォリオサイト。看板デザイン、キャラクターデザイン、バイクのデカールデザインなど幅広いジャンルの作品を手がけるイラストレーター・デザイナーです。企業・個人問わずデザイン制作を承ります。"
        keywords="新井大地,Arai Daichi,イラストレーター,デザイナー,ポートフォリオ,看板デザイン,キャラクターデザイン,デカールデザイン,グラフィックデザイン,バイク,デザイン制作"
      />
      <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section id="home" className="relative h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900">
        <ScrollReveal className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-float">
            Arai Daichi
            <span className="text-primary-400 block">新井大地</span>
          </h1>
          <ScrollReveal delay={300}>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
              看板デザイン、キャラクターデザイン、<br />
              バイクのデカールデザインなど<br />
              幅広いジャンルの作品を手がけています
            </p>
          </ScrollReveal>
          <ScrollReveal delay={600}>
            <div className="space-x-4">
              <a href="#gallery" className="btn-primary">作品を見る</a>
              <a href="#contact" className="btn-secondary">お問い合わせ</a>
            </div>
          </ScrollReveal>
        </ScrollReveal>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* サービスセクション */}
      <ParallaxSection id="services" speed={0.3} className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="section-title">特徴的なサービス</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal delay={0}>
              <div className="card text-center hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-primary-400 mb-3">看板デザイン</h3>
                <p className="text-gray-300">
                  店舗の顔となる看板デザインを、ブランドイメージに合わせて制作いたします。
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="card text-center hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-primary-400 mb-3">キャラクターデザイン</h3>
                <p className="text-gray-300">
                  オリジナルキャラクターの制作から、企業マスコットまで幅広く対応いたします。
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div className="card text-center hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-primary-400 mb-3">デカールデザイン</h3>
                <p className="text-gray-300">
                  バイクや車両用のデカールデザイン。個性的でインパクトのあるデザインを提供します。
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </ParallaxSection>

      {/* プロフィールセクション */}
      <section id="profile" className="py-20 px-4 bg-dark-800">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="section-title">プロフィール</h2>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="w-80 h-80 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-8 flex items-center justify-center">
                <div className="w-72 h-72 bg-dark-700 rounded-full flex items-center justify-center">
                  <svg className="w-32 h-32 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={200}>
              <div>
                <h3 className="text-3xl font-bold text-primary-400 mb-4">新井大地（Arai Daichi）</h3>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  デザインの世界に魅了され、様々なジャンルのイラストレーション制作に携わってきました。
                  特に看板デザイン、キャラクターデザイン、バイクのデカールデザインを得意としています。
                </p>
                
                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-primary-400 mb-3">経歴・実績</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• 看板デザイン制作：100件以上</li>
                    <li>• キャラクターデザイン：50件以上</li>
                    <li>• バイク・車両デカール：30件以上</li>
                    <li>• 企業ロゴデザイン：20件以上</li>
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-primary-400 mb-3">使用ツール</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-dark-700 p-3 rounded-lg border border-dark-600">
                      <span className="text-gray-300">Adobe Illustrator</span>
                    </div>
                    <div className="bg-dark-700 p-3 rounded-lg border border-dark-600">
                      <span className="text-gray-300">Adobe Photoshop</span>
                    </div>
                    <div className="bg-dark-700 p-3 rounded-lg border border-dark-600">
                      <span className="text-gray-300">Procreate</span>
                    </div>
                    <div className="bg-dark-700 p-3 rounded-lg border border-dark-600">
                      <span className="text-gray-300">Clip Studio Paint</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ギャラリーセクション */}
      <section id="gallery" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="section-title">作品ギャラリー</h2>
          </ScrollReveal>
          
          {/* カテゴリーフィルター */}
          <ScrollReveal delay={200}>
            <div className="flex flex-wrap justify-center mb-12 gap-3">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-dark-800 text-gray-300 hover:bg-dark-700 hover:text-primary-400'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* ギャラリーグリッド */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <ScrollReveal key={item.id} delay={index * 100}>
                <div
                  className="group cursor-pointer"
                  onClick={() => openModal(item)}
                >
                  <div className="card p-0 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <div className="aspect-square bg-gradient-to-br from-primary-900 to-dark-700 relative overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-800 to-primary-900">
                        <div className="text-center">
                          <svg className="w-20 h-20 text-primary-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-primary-300 text-sm">{item.title}</p>
                        </div>
                      </div>
                      
                      <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-center text-white">
                          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <p className="text-sm">詳細を見る</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-primary-400 mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{item.year} • {item.client}</p>
                      <p className="text-gray-300 text-sm line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 料金表セクション */}
      <section id="pricing" className="py-20 px-4 bg-dark-800">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="section-title">料金表</h2>
          </ScrollReveal>
          
          <ScrollReveal delay={200}>
            <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
              下記は基本料金です。プロジェクトの規模や複雑さに応じて料金が変動します。<br />
              まずはお気軽にご相談ください。
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <ScrollReveal key={plan.id} delay={index * 200}>
                <div className={`card relative ${plan.popular ? 'border-primary-500 shadow-primary-500/20' : ''}`}>
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

                  <a href="#contact" className={`block text-center w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-primary-600 hover:bg-primary-700 text-white transform hover:scale-105' 
                      : 'border-2 border-primary-600 text-primary-400 hover:bg-primary-600 hover:text-white'
                  }`}>
                    相談する
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* お問い合わせセクション */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="section-title">お問い合わせ</h2>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* お問い合わせフォーム */}
            <ScrollReveal delay={200}>
              <div className="card">
                <h3 className="text-2xl font-bold text-primary-400 mb-6">ご依頼・ご相談フォーム</h3>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        お名前 <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
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
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="看板デザインのご依頼について"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      メッセージ <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                      placeholder="プロジェクトの詳細、ご要望、参考資料等がございましたらお聞かせください。"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 btn-primary"
                  >
                    送信する
                  </button>
                </form>
              </div>
            </ScrollReveal>

            {/* 連絡先情報 */}
            <ScrollReveal delay={400}>
              <div className="space-y-8">
                <div className="card">
                  <h4 className="text-xl font-semibold text-primary-400 mb-4">お問い合わせについて</h4>
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
                  <h4 className="text-xl font-semibold text-primary-400 mb-4">制作の流れ</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 mt-1">1</div>
                      <div>
                        <h5 className="font-medium text-white mb-1">お問い合わせ・ヒアリング</h5>
                        <p className="text-gray-400 text-sm">ご要望をお聞かせください</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 mt-1">2</div>
                      <div>
                        <h5 className="font-medium text-white mb-1">お見積もり・ご契約</h5>
                        <p className="text-gray-400 text-sm">料金と制作期間をご提示</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 mt-1">3</div>
                      <div>
                        <h5 className="font-medium text-white mb-1">デザイン制作</h5>
                        <p className="text-gray-400 text-sm">初稿提案と修正対応</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 mt-1">4</div>
                      <div>
                        <h5 className="font-medium text-white mb-1">納品・お支払い</h5>
                        <p className="text-gray-400 text-sm">完成データの納品</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
      </div>

      {/* モーダル */}
      {selectedImage && (
        <ImageModal
          item={selectedImage}
          onClose={closeModal}
        />
      )}
    </>
  )
}

export default Home