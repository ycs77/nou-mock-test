# 國立空中大學 從考古題 PDF 產生線上模擬考表單

使用 Nuxt 3 建立的線上模擬考考卷表單網站，適用於 國立空中大學 歷屆考古題。

## 安裝

安裝依賴套件：

```bash
yarn
```

啟動本地開發伺服器 http://localhost:3000：

```bash
yarn dev
```

## 線上環境

```bash
yarn build
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
