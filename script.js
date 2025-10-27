// module script
const IMAGES = [
  // 12枚の画像ファイル名（public/images/ 配下に置いて下さい）
  "omikuji01.png",
  "omikuji02.png",
  "omikuji03.png",
  "omikuji04.png",
  "omikuji05.png",
  "omikuji06.png",
  "omikuji07.png",
  "omikuji08.png",
  "omikuji09.png",
  "omikuji10.png",
  "omikuji11.png",
  "omikuji12.png"
];

const drawBtn = document.getElementById("draw-btn");
const webShareBtn = document.getElementById("webshare-btn");
const downloadBtn = document.getElementById("download-btn");
const postXBtn = document.getElementById("post-x-btn");
const postBskyBtn = document.getElementById("post-bsky-btn");
const imgEl = document.getElementById("result-img");
const historyList = document.getElementById("history-list");

const HISTORY_KEY = "omikuji_img_history_v1";

function pickRandomImage(){
  const idx = Math.floor(Math.random()*IMAGES.length);
  return IMAGES[idx];
}

function showImage(filename){
  imgEl.classList.remove("show");
  // small delay to restart transition
  requestAnimationFrame(()=>{
    imgEl.src = `/images/${filename}`;
    imgEl.alt = `おみくじ結果 (${filename})`;
    // wait for image load to show
    imgEl.onload = () => {
      imgEl.classList.add("show");
    };
  });
  // enable share/download/post buttons
  webShareBtn.disabled = false;
  downloadBtn.disabled = false;
  postXBtn.disabled = false;
  postBskyBtn.disabled = false;
  saveHistory({file: filename, time: new Date().toISOString()});
}

function saveHistory(entry){
  const h = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  h.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0,12)));
  renderHistory();
}

function renderHistory(){
  const h = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  historyList.innerHTML = "";
  h.forEach(it=>{
    const li = document.createElement("li");
    li.textContent = `${new Date(it.time).toLocaleString()} — ${it.file}`;
    historyList.appendChild(li);
  });
}

// Web Share API（画像共有）
// 注意: 画像を fetch して Blob にして share する（サポートがある場合のみ）
async function shareImageViaWebShare(filename){
  if(!navigator.canShare) {
    alert("このブラウザはWeb Shareをサポートしていません。画像をダウンロードして投稿してください。");
    return;
  }
  try{
    const resp = await fetch(`/images/${filename}`);
    const blob = await resp.blob();
    const file = new File([blob], filename, {type: blob.type});
    if(navigator.canShare && navigator.canShare({files: [file]})){
      await navigator.share({files:[file], title: "おみくじ", text: "おみくじの結果です！"});
    }else{
      alert("この環境ではファイル共有が使えません。ダウンロードして投稿してください。");
    }
  }catch(e){
    console.error(e);
    alert("共有に失敗しました");
  }
}

// ダウンロード
function downloadImage(filename){
  const a = document.createElement("a");
  a.href = `/images/${filename}`;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/*
  X / Bluesky に投稿する（サーバー側 OAuthフローを使う想定）
  クライアントは /api/post に POST してサーバー側で投稿処理を実行します（このリポジトリは静的運用のためサーバー側は未実装）。
  静的公開だけなら、ユーザーは「画像をダウンロード」→ 各サービスに手動投稿 で OK です。
*/
async function postToSocial(provider, filename){
  try{
    const resp = await fetch(`/api/post`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ provider, filename })
    });
    const j = await resp.json();
    if(resp.ok) {
      alert(`${provider}への投稿をリクエストしました。(${j.message || "完了"})`);
    } else {
      if(j && j.authUrl){
        window.open(j.authUrl, "_blank", "noopener");
      } else {
        alert(`投稿に失敗しました: ${j.error || resp.statusText}`);
      }
    }
  }catch(e){
    console.error(e);
    alert("投稿処理中にエラーが発生しました");
  }
}

// イベント
drawBtn.addEventListener("click", ()=>{
  drawBtn.disabled = true;
  const filename = pickRandomImage();
  drawBtn.textContent = "引いています…";
  setTimeout(()=>{
    showImage(filename);
    drawBtn.disabled = false;
    drawBtn.textContent = "もう一度ひく";
  }, 700);
});

webShareBtn.addEventListener("click", async ()=>{
  const filename = imgEl.src.split("/").pop();
  await shareImageViaWebShare(filename);
});

downloadBtn.addEventListener("click", ()=>{
  const filename = imgEl.src.split("/").pop();
  downloadImage(filename);
});

postXBtn.addEventListener("click", ()=>{
  const filename = imgEl.src.split("/").pop();
  postToSocial("x", filename);
});

postBskyBtn.addEventListener("click", ()=>{
  const filename = imgEl.src.split("/").pop();
  postToSocial("bluesky", filename);
});

// 初期
renderHistory();