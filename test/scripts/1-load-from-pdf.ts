import fs from 'node:fs'
import path from 'node:path'
import { loadPdf } from '../../shared/logic/pdf'
import { pdfDataToString, serializePdfStringToParagraphs } from '../../shared/logic/serialize'
import { pdfFiles } from '../data/pdf-files'

pdfFiles.forEach(async filename => {
  const pdfData = await loadPdf(path.resolve(import.meta.dirname, `../fixtures/${filename}.pdf`))
  let content = pdfDataToString(pdfData)

  content = serializePdfStringToParagraphs(content)

  // console.log(content)

  fs.writeFileSync(
    path.resolve(import.meta.dirname, `../fixtures/${filename}__1_loaded_from_pdf.txt`),
    content
  )
})
