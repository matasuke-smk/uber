const fs = require('fs');
const path = require('path');

// distディレクトリを作成
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// コピーするファイル
const files = [
  'index.html',
  'manifest.json',
  'sw.js',
  'favicon.svg',
  'アイコン.jpg',
  'BTC.png'
];

// ファイルをコピー
files.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(distDir, file);

  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${file}`);
  } else {
    console.log(`Skipped (not found): ${file}`);
  }
});

console.log('Build completed!');
