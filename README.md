# 國立空中大學 從考古題 PDF 產生線上模擬考表單

使用 Nuxt 3 建立的線上模擬考考卷表單網站，適用於 國立空中大學 歷屆考古題。

## 安裝

安裝依賴套件：

```bash
yarn
```

啟動本地開發伺服器：

```bash
yarn dev
```

## 線上環境

```bash
yarn build
```

## CLI

```bash
# 在 nou-mock-test 中執行
node ./bin/2-loaded-from-pdf.js "C:/Users/User/Downloads/file.pdf"
node ./bin/3-parsed-exam-data.js "C:/Users/User/Downloads/file.pdf"

# 在目的目錄下執行
node /d/dev/testing/nou-mock-test/bin/2-loaded-from-pdf.js file.pdf
node /d/dev/testing/nou-mock-test/bin/3-parsed-exam-data.js file.pdf
```

## 測試

```bash
yarn test
```

重新產生 fixtures：

```bash
yarn generate:2-loaded-from-pdf
```

重新解析考卷內容：

```bash
yarn generate:3-parsed-exam-data
```
