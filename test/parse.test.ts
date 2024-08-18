import fs from 'node:fs'
import path from 'node:path'
import { expect, it } from 'vitest'

it.each([
  '101-1-linux-1ch-2ra-3tx',
  '104-2-linux-1ra-2tx',
  '112-2-linux-1ch-2ra-3tx',
  '112-2-gender-1ch-2ra-3tx',
  '112-2-couplet-1tx',
])('parse pdf string to exam data - %s', async filename => {
  const content = fs.readFileSync(path.resolve(__dirname, `fixtures/${filename}__2_loaded_from_pdf.txt`), 'utf-8')

  const blocks = parseExam(content)

  // console.log(require('node:util').inspect(blocks, false, null, true))

  expect(blocks).matchSnapshot()
})
