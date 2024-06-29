import { readFiles } from 'h3-formidable'
import { parseExam } from '~/logic/parse'
import { loadPdf } from '~/logic/pdf'
import { pdfDataToString, serializePdfStringToParagraphs } from '~/logic/serialize'
import type { Block } from '~/types/exam'

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

  const pdfData = await loadPdf(file.filepath)

  let content = pdfDataToString(pdfData)
  content = serializePdfStringToParagraphs(content)

  const blocks = parseExam(content)

  return response(200, '文件上傳完成', blocks)
})
