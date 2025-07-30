import React, { useState, useEffect } from 'react'
import ImageModal from '../components/ImageModal'

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [portfolioItems] = useState([
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
  ])

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

  const openModal = (item) => {
    setSelectedImage(item)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="section-title">作品ギャラリー</h1>
        
        {/* カテゴリーフィルター */}
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

        {/* ギャラリーグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="group cursor-pointer"
              onClick={() => openModal(item)}
            >
              <div className="card p-0 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <div className="aspect-square bg-gradient-to-br from-primary-900 to-dark-700 relative overflow-hidden">
                  {/* プレースホルダー画像 */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-800 to-primary-900">
                    <div className="text-center">
                      <svg className="w-20 h-20 text-primary-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-primary-300 text-sm">{item.title}</p>
                    </div>
                  </div>
                  
                  {/* ホバーオーバーレイ */}
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
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">該当する作品がありません。</p>
          </div>
        )}
      </div>

      {/* モーダル */}
      {selectedImage && (
        <ImageModal
          item={selectedImage}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

export default Gallery