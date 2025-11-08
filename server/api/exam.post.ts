import type { Block } from '#shared/types/exam'
import { aiParseExam } from '#shared/logic/aiParse'
import { parseExam } from '#shared/logic/parse'
import { loadPdf } from '#shared/logic/pdf'
import { pdfDataToString, serializePdfStringToParagraphs } from '#shared/logic/serialize'
import { readFiles } from 'h3-formidable'

function createValidationError(message: string) {
  return createError({
    statusCode: 422,
    statusMessage: 'Unprocessable Content',
    message,
  })
}

export default defineEventHandler(async event => {
  const { files } = await readFiles(event, {
    maxFiles: 1,
  })

  const file = files.pdf?.[0]

  // 驗證文件是否存在
  if (!file) {
    throw createValidationError('缺少上傳文件，請選擇一個 PDF 檔案')
  }

  if (!file.originalFilename?.endsWith('.pdf') || file.mimetype !== 'application/pdf') {
    throw createValidationError('無效文件格式')
  }

  // 驗證文件大小
  if (file.size > 1024 * 1024) {
    throw createValidationError('文件大小不能超過 1MB')
  }

  const runtimeConfig = useRuntimeConfig()

  let blocks: Block[] = []

  try {
    const pdfData = await loadPdf(file.filepath)

    let content = pdfDataToString(pdfData)

    content = serializePdfStringToParagraphs(content)

    if (runtimeConfig.aiParser.enabled) {
      blocks = await aiParseExam(content)
    } else {
      blocks = parseExam(content)
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('PDF 解析錯誤：', error)
      throw createValidationError(error.message)
    }
  }

  // 驗證解析結果
  if (!Array.isArray(blocks) || blocks.length === 0) {
    throw createValidationError('解析失敗：無法從 PDF 中提取有效的考試內容')
  }

  if (!blocks.some(block => block.type === 'title')) {
    throw createValidationError('解析失敗：缺少考卷標題，請確認這是有效的空中大學考卷')
  }

  if (!blocks.some(block => block.type === 'subtitle')) {
    throw createValidationError('解析失敗：缺少科目資訊，請確認這是有效的空中大學考卷')
  }

  return { blocks }
})
