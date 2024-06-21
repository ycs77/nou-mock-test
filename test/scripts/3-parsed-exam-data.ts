import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseExam } from '~/logic/parse'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

;[
  '1011_760008_11',
  '1122_760008_11',
  '1122_780022_11',
  '1122_780051_11',
  '1042_760008_11',
].forEach(async filename => {
  const content = fs.readFileSync(path.resolve(__dirname, `../fixtures/${filename}__2_loaded_from_pdf.txt`), 'utf-8')

  const blocks = parseExam(content)

  fs.writeFileSync(
    path.resolve(__dirname, `../fixtures/${filename}__3_parsed_exam_data.json`),
    JSON.stringify(blocks, null, 2)
  )
})
