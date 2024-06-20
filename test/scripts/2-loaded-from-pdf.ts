import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadPdf } from '@/logic/pdf'
import { pdfDataToString, serializePdfStringToParagraphs } from '@/logic/serialize'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

;[
  '1011_760008_11',
  '1122_760008_11',
  '1122_780022_11',
  '1122_780051_11',
  '1042_760008_11',
].forEach(async filename => {
  const pdfData = await loadPdf(path.resolve(__dirname, `../fixtures/${filename}.pdf`))
  let content = pdfDataToString(pdfData)

  content = serializePdfStringToParagraphs(content)

  fs.writeFileSync(
    path.resolve(__dirname, `../fixtures/${filename}__2_loaded_from_pdf.txt`),
    content
  )
})
