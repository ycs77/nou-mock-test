import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pdfFiles } from '../data/pdf-files'
import { loadPdf } from '~/logic/pdf'
import { pdfDataToString, serializePdfStringToParagraphs } from '~/logic/serialize'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

pdfFiles.forEach(async filename => {
  const pdfData = await loadPdf(path.resolve(__dirname, `../fixtures/${filename}.pdf`))
  let content = pdfDataToString(pdfData)

  content = serializePdfStringToParagraphs(content)

  fs.writeFileSync(
    path.resolve(__dirname, `../fixtures/${filename}__2_loaded_from_pdf.txt`),
    content
  )
})
