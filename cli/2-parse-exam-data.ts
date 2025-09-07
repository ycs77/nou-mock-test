import fs from 'node:fs'
import path from 'node:path'
import { parseExam } from '../shared/logic/parse'

(async () => {
  const filePath = path.resolve(process.cwd(), process.argv[2] || '')
  if (!filePath.endsWith('.pdf')) {
    throw new Error('Please provide a path to a PDF file')
  }
  if (!fs.existsSync(filePath)) {
    throw new Error('File does not exist')
  }

  const filename = path.basename(filePath, '.pdf')

  const txtFilePath = path.resolve(path.dirname(filePath), `${filename}__1_loaded_from_pdf.txt`)
  if (!fs.existsSync(txtFilePath)) {
    throw new Error(`${filename}__1_loaded_from_pdf.txt does not exist`)
  }
  const content = fs.readFileSync(txtFilePath, 'utf-8')

  const blocks = parseExam(content)

  fs.writeFileSync(
    path.resolve(path.dirname(filePath), `${filename}__2_parsed_exam_data.json`),
    JSON.stringify(blocks, null, 2)
  )

  console.log(`Exam data parsed and saved as ${filename}__2_parsed_exam_data.json`)
})()
