# express-middleware-server
Expressのサーバー部のみ

## 起動スクリプト
- 場所
  - **bin/server**
- `yarn`でのインストール先からの実行方法
  - `yarn run server`

## src内のそれぞれのファイルの役割
- server.ts
  - Expressサーバーの起動
  - クラスター設定
- app.ts
  - サーバー共通のミドルウェアの設定
- router.ts
  - アプリケーション内のルーターを指定
