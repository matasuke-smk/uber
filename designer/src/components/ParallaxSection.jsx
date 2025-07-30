import React, { useEffect, useRef, useState } from 'react'

const ParallaxSection = ({ 
  children, 
  speed = 0.5, 
  className = '',
  backgroundImage = null 
}) => {
  const [offset, setOffset] = useState(0)
  const ref = useRef()

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      
      const scrolled = window.pageYOffset
      const rect = ref.current.getBoundingClientRect()
      const elementTop = rect.top + scrolled
      const elementHeight = rect.height
      const windowHeight = window.innerHeight
      
      // 要素が画面内にある場合のみパララックス効果を適用
      if (scrolled + windowHeight > elementTop && scrolled < elementTop + elementHeight) {
        const yPos = -(scrolled - elementTop) * speed
        setOffset(yPos)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 初期値設定
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  const backgroundStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  } : {}

  return (
    <div 
      ref={ref} 
      className={`relative overflow-hidden ${className}`}
      style={backgroundStyle}
    >
      <div 
        style={{
          transform: `translate3d(0, ${offset}px, 0)`,
          willChange: 'transform'
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default ParallaxSection