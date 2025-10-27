```markdown
# おみくじ（画像版） — Vercel デプロイ手順

準備:
- public/images/ 配下に 12 枚の画像を置く（ファイル名は omikuji01.png 〜 omikuji12.png を推奨）

ローカルで確認:
- 単にブラウザで index.html を開くか、簡易サーバーで確認:
  - Python: python -m http.server 8080 でルートを公開して http://localhost:8080 を開く
  - または: npx serve . （serve を使いたい場合は事前に npm i -g serve）

GitHub に push:
1. git init
2. git add .
3. git commit -m "Initial commit"
4. GitHub で新しいリポジトリを作成（GUI または gh cli）
5. git remote add origin git@github.com:<あなたのユーザー>/<repo>.git
6. git push -u origin main

Vercel にデプロイ（GUI の最短手順）:
1. https://vercel.com にログイン（GitHub アカウントで連携）
2. "New Project" -> Git Repository を選択して先ほどのリポジトリをインポート
3. Framework preset は "Other" または "Deploy from Root" を選択（静的ファイル）
4. Root directory は空（/）
5. 環境変数は静的公開のみなら不要
6. Deploy をクリック（自動でビルド & 公開）

Vercel CLI でデプロイ（代替）:
1. npm i -g vercel
2. vercel login
3. vercel --prod

注意点 / 推奨:
- 画像は最適化（png/jpg なら圧縮）しておくと表示が速くなります。WebP の利用も検討してください。
- SNS 自動投稿（X / Bluesky）を後で実装する場合はサーバーサイド（API）と OAuth の準備が必要です。静的公開だけなら「ダウンロード → 手動投稿」で運用可能です。
- カスタマイズは style.css の :root の変数を変更すると手軽にできます。
```