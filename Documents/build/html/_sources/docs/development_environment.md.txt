環境構築回り
*************

# 開発環境作成
## 環境構築手順
1. （任意）VSCodeのインストール

https://qiita.com/psychoroid/items/7d85ae6bade4a67aedb1

2. NodeJSのインストール

https://qiita.com/Masayuki-M/items/840a997a824e18f576d8

NodeJSのパッケージ管理ツールとしてnpmを用いているので以下のコマンドでnpmをインストールする

`$ npm install`

3. Gitのインストール

https://qiita.com/toshi-click/items/dcf3dd48fdc74c91b409

4. Pythonのインストール

このドキュメント構築に用いています。
    
    1. Anacondaのインストール

    https://www.python.jp/install/anaconda/windows/install.html

    2. 必要なモジュールのインストール

    pip install で以下のモジュールをインストールしていく

    - sphinx
    - sphinx-rtd-theme
    - sphinxcontrib-seqdiag

5. プロジェクトをclone

コマンドプロンプトを起動し、プロジェクトを置いておきたいフォルダまで移動し、以下のコマンドを実行

`$ git clone https://github.com/s-taiga/learn-group`

## ローカルでの立ち上げ

1. コマンドプロンプトでプロジェクトのフォルダまで移動する

2. Angularを起動する

`$ ng serve`

コンパイルエラーがある場合はここでエラーを吐かれる

3. ブラウザで確認

以下のURLでページが開く

http://localhost:4200/