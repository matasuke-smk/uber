// 画像管理ユーティリティ
// フォルダベースの簡易画像管理システム

export const imageCategories = {
  signage: 'signage',
  characters: 'characters', 
  decals: 'decals',
  others: 'others'
}

// 画像パスの生成
export const getImagePath = (category, filename) => {
  return `/images/portfolio/${category}/${filename}`
}

// 画像の存在確認（開発環境用）
export const checkImageExists = async (imagePath) => {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

// カテゴリー別の画像を取得する関数
export const getImagesByCategory = async (category) => {
  const images = []
  
  // 実際の実装では、APIエンドポイントから画像一覧を取得するか、
  // ビルド時に画像フォルダをスキャンして生成する
  
  // 開発用のサンプルデータ
  const sampleImages = {
    signage: [
      'sample1.jpg',
      'sample2.jpg'
    ],
    characters: [
      'sample1.jpg', 
      'sample2.jpg'
    ],
    decals: [
      'sample1.jpg'
    ],
    others: [
      'sample1.jpg'
    ]
  }
  
  if (sampleImages[category]) {
    return sampleImages[category].map(filename => getImagePath(category, filename))
  }
  
  return images
}

// 全ての画像を取得
export const getAllImages = async () => {
  const allImages = []
  
  for (const category of Object.values(imageCategories)) {
    const categoryImages = await getImagesByCategory(category)
    allImages.push(...categoryImages.map(path => ({
      path,
      category
    })))
  }
  
  return allImages
}

// 画像のメタデータを生成（ファイル名から推測）
export const generateImageMetadata = (imagePath, category) => {
  const filename = imagePath.split('/').pop()
  const nameWithoutExt = filename.split('.')[0]
  
  return {
    path: imagePath,
    category,
    filename,
    alt: `${category} - ${nameWithoutExt}`,
    title: nameWithoutExt.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }
}

// 画像をプリロードする
export const preloadImages = (imagePaths) => {
  imagePaths.forEach(path => {
    const img = new Image()
    img.src = path
  })
}

// レスポンシブ画像のsrcsetを生成
export const generateSrcSet = (basePath) => {
  const pathParts = basePath.split('.')
  const extension = pathParts.pop()
  const base = pathParts.join('.')
  
  return [
    `${base}_sm.${extension} 400w`,
    `${base}_md.${extension} 800w`, 
    `${base}_lg.${extension} 1200w`,
    `${basePath} 1600w`
  ].join(', ')
}

// 画像の最適化情報を取得
export const getOptimizedImageInfo = (originalPath) => {
  return {
    webp: originalPath.replace(/\.(jpg|jpeg|png)$/i, '.webp'),
    avif: originalPath.replace(/\.(jpg|jpeg|png)$/i, '.avif'),
    placeholder: originalPath.replace(/\.(jpg|jpeg|png)$/i, '_placeholder.jpg')
  }
}