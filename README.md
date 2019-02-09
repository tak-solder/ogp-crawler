# OGP Crawler

AWS Lambdaで各サイトのOGPデータを取得するプログラムです。
API Gateway経由での利用を想定しています。

## 取得内容
取得項目と取得場所です。
各項目ごとに上から存在を確認し、最初にヒットした値を返します。
項目が存在しない場合はNULLを返します。

### ページタイトル
1. `meta[name="twitter:title"]`
1. `meta[property="og:title"]`
1. `title`

### ページURL
1. `meta[property="og:url"]`
1. `link[rel="canonical"]`
1. `リクエストのURL`

### ページ画像
1. `meta[name="twitter:image"]`
1. `meta[property="og:image"]`
1. `meta[itemprop="image"]`

### サイト名
1. `meta[property="og:site_name"]`

### ディスクリプション
1. `meta[name="twitter:description"]`
1. `meta[property="og:description"]`
1. `meta[name="description"]`

### 画像サイズ
`meta[name="twitter:card"]`が存在し、値が`summary_large_image`の場合に`true`を返します。  
上記以外の場合は`false`を返します。
