// おみくじの挙動（12個の画像を使用）
(function(){
  const TOTAL = 12; // 画像数をここで変更できます（1〜12）
  const images = [];
  for (let i = 1; i <= TOTAL; i++) {
    // images/omikuji1.png ... images/omikuji12.png を想定
    images.push({
      src: `images/omikuji${i}.png`,
      alt: `おみくじ ${i}`,
      label: getLabelForIndex(i)
    });
  }

  const drawBtn = document.getElementById('drawBtn');
  const resetBtn = document.getElementById('resetBtn');
  const resultEl = document.getElementById('result');
  const resultImg = document.getElementById('resultImage');
  const resultText = document.getElementById('resultText');

  // 画像をプリロード
  images.forEach(img => {
    const i = new Image();
    i.src = img.src;
  });

  drawBtn.addEventListener('click', drawOmikuji);
  resetBtn.addEventListener('click', reset);

  // スペースキー / Enter で引けるように
  document.addEventListener('keydown', (e) => {
    if ((e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') && document.activeElement === document.body) {
      e.preventDefault();
      drawBtn.focus();
      drawOmikuji();
    }
  });

  function drawOmikuji() {
    // ランダムに1つ選ぶ
    const idx = Math.floor(Math.random() * images.length);
    const sel = images[idx];

    // 表示更新
    resultImg.classList.remove('reveal');
    // 先に短く非表示にしてアニメーションを再トリガー
    resultImg.style.opacity = '0';
    setTimeout(() => {
      resultImg.src = sel.src;
      resultImg.alt = sel.alt;
      resultText.textContent = sel.label;
      resultEl.classList.remove('hidden');
      // アニメーション
      void resultImg.offsetWidth;
      resultImg.classList.add('reveal');
      resultImg.style.opacity = '1';
    }, 120);

    // ボタン制御
    drawBtn.disabled = true;
    setTimeout(() => drawBtn.disabled = false, 800); // 連打防止
  }

  function reset(){
    resultEl.classList.add('hidden');
    resultImg.src = '';
    resultText.textContent = '';
    drawBtn.focus();
  }

  // 任意：画像インデックスに対応するテキスト（カスタマイズ可能）
  function getLabelForIndex(i){
    // 12個の結果ラベル例（好きに変更してください）
    const labels = [
      "大吉", "中吉", "小吉", "吉",
      "末吉", "凶", "大凶", "中凶",
      "小凶", "半吉", "吉凶混合", "平"
    ];
    return labels[(i - 1) % labels.length] || `おみくじ ${i}`;
  }
})();