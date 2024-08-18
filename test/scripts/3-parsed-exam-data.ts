import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseExam } from '~/logic/parse'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

;[
  '101-1-linux-1ch-2ra-3tx',
  '104-2-linux-1ra-2tx',
  '112-2-linux-1ch-2ra-3tx',
  '112-2-gender-1ch-2ra-3tx',
  '112-2-couplet-1tx',
].forEach(async filename => {
  const content = fs.readFileSync(path.resolve(__dirname, `../fixtures/${filename}__2_loaded_from_pdf.txt`), 'utf-8')

  const blocks = parseExam(content)

  fs.writeFileSync(
    path.resolve(__dirname, `../fixtures/${filename}__3_parsed_exam_data.json`),
    JSON.stringify(blocks, null, 2)
  )
})
