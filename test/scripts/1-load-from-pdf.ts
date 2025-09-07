import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadPdf } from '../../shared/logic/pdf'
import { pdfDataToString, serializePdfStringToParagraphs } from '../../shared/logic/serialize'
import { pdfFiles } from '../data/pdf-files'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

pdfFiles.forEach(async filename => {
  const pdfData = await loadPdf(path.resolve(__dirname, `../fixtures/${filename}.pdf`))
  let content = pdfDataToString(pdfData)

  content = serializePdfStringToParagraphs(content)

  // console.log(content)

  fs.writeFileSync(
    path.resolve(__dirname, `../fixtures/${filename}__1_loaded_from_pdf.txt`),
    content
  )
})
