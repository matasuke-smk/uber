import React from 'react'

const Profile = () => {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="section-title">プロフィール</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="w-80 h-80 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-8 flex items-center justify-center">
              <div className="w-72 h-72 bg-dark-700 rounded-full flex items-center justify-center">
                <svg className="w-32 h-32 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="animate-slide-up">
            <h2 className="text-3xl font-bold text-primary-400 mb-4">イラストレーター</h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              デザインの世界に魅了され、様々なジャンルのイラストレーション制作に携わってきました。
              特に看板デザイン、キャラクターデザイン、バイクのデカールデザインを得意としています。
            </p>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-primary-400 mb-3">経歴・実績</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• 看板デザイン制作：100件以上</li>
                <li>• キャラクターデザイン：50件以上</li>
                <li>• バイク・車両デカール：30件以上</li>
                <li>• 企業ロゴデザイン：20件以上</li>
              </ul>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-primary-400 mb-3">使用ツール</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-dark-800 p-3 rounded-lg border border-dark-700">
                  <span className="text-gray-300">Adobe Illustrator</span>
                </div>
                <div className="bg-dark-800 p-3 rounded-lg border border-dark-700">
                  <span className="text-gray-300">Adobe Photoshop</span>
                </div>
                <div className="bg-dark-800 p-3 rounded-lg border border-dark-700">
                  <span className="text-gray-300">Procreate</span>
                </div>
                <div className="bg-dark-800 p-3 rounded-lg border border-dark-700">
                  <span className="text-gray-300">Clip Studio Paint</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-primary-400 mb-3">デザインポリシー</h3>
              <p className="text-gray-300 leading-relaxed">
                クライアント様の想いを形にし、見る人の心に響くデザインを心がけています。
                常に新しい表現方法を追求し、時には型にハマらない斬新なアイデアで
                唯一無二の作品を生み出すことを大切にしています。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile