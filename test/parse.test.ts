import fs from 'node:fs'
import path from 'node:path'
import { expect, it } from 'vitest'

it.each([
  '1011_760008_11',
  '1122_760008_11',
  '1122_780022_11',
  '1122_780051_11',
  '1042_760008_11',
])('parse pdf string to exam data - %s', async filename => {
  const content = fs.readFileSync(path.resolve(__dirname, `fixtures/${filename}__2_loaded_from_pdf.txt`), 'utf-8')

  const blocks = parseExam(content)

  // console.log(require('node:util').inspect(blocks, false, null, true))

  expect(blocks).matchSnapshot()
})
