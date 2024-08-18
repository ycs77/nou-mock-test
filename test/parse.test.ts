import fs from 'node:fs'
import path from 'node:path'
import { expect, it } from 'vitest'
import { pdfFiles } from './data/pdf-files'

it.each(pdfFiles)('parse pdf string to exam data - %s', async filename => {
  const content = fs.readFileSync(path.resolve(__dirname, `fixtures/${filename}__2_loaded_from_pdf.txt`), 'utf-8')

  const blocks = parseExam(content)

  // console.log(require('node:util').inspect(blocks, false, null, true))

  expect(blocks).matchSnapshot()
})
