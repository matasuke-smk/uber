import { useState, useEffect } from 'react'
import { getAllImages, getImagesByCategory, generateImageMetadata } from '../utils/imageManager'

// ポートフォリオ画像を管理するカスタムフック
export const usePortfolioImages = (category = null) => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true)
        setError(null)
        
        let imageList = []
        
        if (category) {
          // 特定のカテゴリーの画像を取得
          const categoryImages = await getImagesByCategory(category)
          imageList = categoryImages.map(path => generateImageMetadata(path, category))
        } else {
          // 全ての画像を取得
          const allImages = await getAllImages()
          imageList = allImages.map(({ path, category }) => 
            generateImageMetadata(path, category)
          )
        }
        
        setImages(imageList)
      } catch (err) {
        setError('画像の読み込みに失敗しました')
        console.error('Image loading error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadImages()
  }, [category])

  return { images, loading, error }
}

// 画像の遅延読み込み用フック
export const useLazyImage = (src) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!src) return

    const img = new Image()
    
    img.onload = () => {
      setLoaded(true)
      setError(false)
    }
    
    img.onerror = () => {
      setError(true)
      setLoaded(false)
    }
    
    img.src = src
  }, [src])

  return { loaded, error }
}

// 画像のプリロード用フック
export const useImagePreloader = (imagePaths) => {
  const [preloaded, setPreloaded] = useState(false)
  
  useEffect(() => {
    if (!imagePaths || imagePaths.length === 0) return
    
    let loadedCount = 0
    const totalImages = imagePaths.length
    
    const handleImageLoad = () => {
      loadedCount++
      if (loadedCount === totalImages) {
        setPreloaded(true)
      }
    }
    
    imagePaths.forEach(path => {
      const img = new Image()
      img.onload = handleImageLoad
      img.onerror = handleImageLoad // エラーでもカウントを進める
      img.src = path
    })
  }, [imagePaths])
  
  return preloaded
}