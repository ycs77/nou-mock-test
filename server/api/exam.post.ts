import type { Block } from '#shared/types/exam'
import type { PDFExtractResult } from 'pdf.js-extract'
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

  if (!file) {
    return response(422, '缺少上傳文件')
  }

  if (!file.originalFilename?.endsWith('.pdf') || file.mimetype !== 'application/pdf') {
    return response(422, '無效文件格式')
  }

  if (file.size > 1024 * 1024) {
    return response(422, '文件大小不能超過 1MB')
  }

  let pdfData: PDFExtractResult
  try {
    pdfData = await loadPdf(file.filepath)
  } catch (error) {
    return response(422, (error as Error).message)
  }

  let content = pdfDataToString(pdfData)
  content = serializePdfStringToParagraphs(content)

  const blocks = parseExam(content)

  if (!blocks.some(block => block.type === 'title')) {
    return response(422, '缺少空中大學考卷標題')
  } else if (!blocks.some(block => block.type === 'subtitle')) {
    return response(422, '缺少空中大學考卷副標題')
  }

  return response(200, '文件上傳完成', blocks)
})
