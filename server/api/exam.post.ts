import type { Block } from '#shared/types/exam'
import { aiParseExam } from '#shared/logic/aiParse'
import { parseExam } from '#shared/logic/parse'
import { loadPdf } from '#shared/logic/pdf'
import { pdfDataToString, serializePdfStringToParagraphs } from '#shared/logic/serialize'
import { readFiles } from 'h3-formidable'

function response(status: number, message: string, blocks: Block[] = []) {
  return { status, message, blocks }
}

export default defineEventHandler(async event => {
  const { files } = await readFiles(event, {
    maxFiles: 1,
  })

  const file = files.pdf?.[0]

  // 驗證文件是否存在
  if (!file) {
    return response(422, '缺少上傳文件，請選擇一個 PDF 檔案')
  }

  if (!file.originalFilename?.endsWith('.pdf') || file.mimetype !== 'application/pdf') {
    return response(422, '無效文件格式')
  }

  // 驗證文件大小
  if (file.size > 1024 * 1024) {
    return response(422, '文件大小不能超過 1MB')
  }

  const runtimeConfig = useRuntimeConfig()

  try {
    const pdfData = await loadPdf(file.filepath)

    let content = pdfDataToString(pdfData)

    content = serializePdfStringToParagraphs(content)

    const blocks = runtimeConfig.aiParser.enabled
      ? await aiParseExam(content)
      : parseExam(content)

    // 驗證解析結果
    if (!Array.isArray(blocks) || blocks.length === 0) {
      return response(422, '解析失敗：無法從 PDF 中提取有效的考試內容')
    }

    if (!blocks.some(block => block.type === 'title')) {
      return response(422, '解析失敗：缺少考卷標題，請確認這是有效的空中大學考卷')
    }

    if (!blocks.some(block => block.type === 'subtitle')) {
      return response(422, '解析失敗：缺少科目資訊，請確認這是有效的空中大學考卷')
    }

    return response(200, '文件上傳成功', blocks)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知錯誤'
    console.error('PDF 解析錯誤：', error)
    return response(422, `解析失敗：${errorMessage}`)
  }
})
