import fs from 'node:fs'
import path from 'node:path'
import util from 'node:util'
import { parseExam } from '../../shared/logic/parse'
import { pdfFiles } from '../data/pdf-files'

const debug = process.argv.includes('--debug')

pdfFiles.forEach(async filename => {
  const content = fs.readFileSync(path.resolve(import.meta.dirname, `../fixtures/${filename}__1_loaded_from_pdf.txt`), 'utf-8')

  const blocks = parseExam(content)

  if (debug) {
    console.log(util.inspect(blocks, false, null, true))
  }

  fs.writeFileSync(
    path.resolve(import.meta.dirname, `../fixtures/${filename}__2_parsed_exam_data.json`),
    JSON.stringify(blocks, null, 2)
  )
})
