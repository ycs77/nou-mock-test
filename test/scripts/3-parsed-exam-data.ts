import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pdfFiles } from '../data/pdf-files'
import { parseExam } from '~/logic/parse'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

pdfFiles.forEach(async filename => {
  const content = fs.readFileSync(path.resolve(__dirname, `../fixtures/${filename}__2_loaded_from_pdf.txt`), 'utf-8')

  const blocks = parseExam(content)

  // console.log(require('node:util').inspect(blocks, false, null, true))

  fs.writeFileSync(
    path.resolve(__dirname, `../fixtures/${filename}__3_parsed_exam_data.json`),
    JSON.stringify(blocks, null, 2)
  )
})
