import fs from 'node:fs'
import path from 'node:path'
import { loadPdf } from '../shared/logic/pdf'
import { pdfDataToString, serializePdfStringToParagraphs } from '../shared/logic/serialize'

(async () => {
  const filePath = path.resolve(process.cwd(), process.argv[2] || '')
  if (!filePath.endsWith('.pdf')) {
    throw new Error('Please provide a path to a PDF file')
  }
  if (!fs.existsSync(filePath)) {
    throw new Error('File does not exist')
  }

  const filename = path.basename(filePath, '.pdf')

  const pdfData = await loadPdf(filePath)
  let content = pdfDataToString(pdfData)

  content = serializePdfStringToParagraphs(content)

  fs.writeFileSync(
    path.resolve(path.dirname(filePath), `${filename}__2_loaded_from_pdf.txt`),
    content
  )

  console.log(`PDF loaded and saved as ${filename}__2_loaded_from_pdf.txt`)
})()
