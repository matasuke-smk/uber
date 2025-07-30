import React from 'react'
import { Helmet } from 'react-helmet-async'

const SEOHead = ({ 
  title = '新井大地（Arai Daichi） - イラストレーター・デザイナー',
  description = '新井大地（Arai Daichi）のポートフォリオサイト。看板デザイン、キャラクターデザイン、バイクのデカールデザインなどの作品を手がけるイラストレーター・デザイナーです。',
  keywords = '新井大地,Arai Daichi,イラストレーター,デザイナー,ポートフォリオ,看板デザイン,キャラクターデザイン,デカールデザイン,グラフィックデザイン',
  ogImage = '/og-image.jpg',
  url = window.location.href,
  type = 'website'
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "新井大地",
    "alternateName": "Arai Daichi",
    "jobTitle": "Graphic Designer & Illustrator",
    "description": description,
    "url": url,
    "sameAs": [
      // SNSアカウントがあれば追加
    ],
    "knowsAbout": [
      "看板デザイン",
      "キャラクターデザイン", 
      "デカールデザイン",
      "グラフィックデザイン",
      "イラストレーション"
    ],
    "offers": {
      "@type": "Service",
      "serviceType": [
        "看板デザイン",
        "キャラクターデザイン",
        "デカールデザイン"
      ]
    }
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="新井大地（Arai Daichi）" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="新井大地（Arai Daichi） - イラストレーター・デザイナー" />
      <meta property="og:locale" content="ja_JP" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#22c55e" />
      <meta name="msapplication-TileColor" content="#22c55e" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    </Helmet>
  )
}

export default SEOHead