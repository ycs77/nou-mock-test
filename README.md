# 國立空中大學 從考古題 PDF 產生線上模擬考表單

使用 Nuxt 3 建立的線上模擬考考卷表單網站，適用於 國立空中大學 歷屆考古題。

## 安裝

安裝依賴套件：

```bash
yarn
```

分析考古題 PDF 時有使用到 Claude Code，需要有訂閱或 API Key 才能使用 AI 分析功能。

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
./bin/1-load-from-pdf "C:/Users/User/Downloads/file.pdf"
./bin/2-parse-exam-data "C:/Users/User/Downloads/file.pdf"

# 在目的目錄下執行
/d/dev/testing/nou-mock-test/bin/1-load-from-pdf file.pdf
/d/dev/testing/nou-mock-test/bin/2-parse-exam-data file.pdf
```

## 測試

```bash
yarn test
```

重新產生 fixtures：

```bash
yarn generate:1-load-from-pdf
```

重新解析考卷內容：

```bash
yarn generate:2-parse-exam-data
```
