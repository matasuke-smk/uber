import React, { useEffect } from 'react'

const ImageModal = ({ item, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* バックドロップ */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* モーダルコンテンツ */}
      <div className="relative bg-dark-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-dark-900 hover:bg-primary-600 text-white rounded-full p-2 transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* 画像部分 */}
          <div className="aspect-square bg-gradient-to-br from-primary-900 to-dark-700 relative overflow-hidden rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <svg className="w-32 h-32 text-primary-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-primary-300 text-lg">{item.title}</p>
              </div>
            </div>
          </div>

          {/* 詳細情報部分 */}
          <div className="p-8">
            <h2 className="text-3xl font-bold text-primary-400 mb-4">{item.title}</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-1">制作年</h3>
                <p className="text-white">{item.year}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-1">クライアント</h3>
                <p className="text-white">{item.client}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-1">使用ツール</h3>
                <p className="text-white">{item.tools}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-primary-400 mb-3">作品説明</h3>
              <p className="text-gray-300 leading-relaxed">{item.description}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-dark-700">
              <button
                onClick={onClose}
                className="btn-secondary w-full"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageModal