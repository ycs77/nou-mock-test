import path from 'node:path'
import { expect, it } from 'vitest'
import { loadPdf } from '../shared/logic/pdf'
import { getMaxLineWidth, pdfDataToString, serializePdfStringToParagraphs } from '../shared/logic/serialize'
import { pdfFiles } from './data/pdf-files'

it('parse pdf data to string', async () => {
  const pdfData = await loadPdf(path.resolve(import.meta.dirname, 'fixtures/104-2-linux-1ra-2tx.pdf'))

  const content = pdfDataToString(pdfData)

  expect(content).matchSnapshot()
})

it('calculate max line width', () => {
  const maxWidth = getMaxLineWidth(`
    3.你看過沈國仁的水彩畫作嗎? 水彩是最簡易的繪圖工具，但運用得好，並
    不容易。以你的經驗為例，請說明你駕馭水彩的過程以及從中獲得的成功或
    失敗的經驗。(參閱 1-1)
  `.split('\n').map(line => line.trim()).filter(Boolean).join('\n'))

  expect(maxWidth).toBe(66)
})

it.each(pdfFiles)('serialize pdf string to paragraphs - %s', async filename => {
  const pdfData = await loadPdf(path.resolve(import.meta.dirname, `fixtures/${filename}.pdf`))
  let content = pdfDataToString(pdfData)

  content = serializePdfStringToParagraphs(content)

  // console.log(content)

  expect(content).matchSnapshot()
})
