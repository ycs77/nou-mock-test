import path from 'node:path'
import { expect, it } from 'vitest'

it('parse pdf data to string', async () => {
  const pdfData = await loadPdf(path.resolve(__dirname, 'fixtures/1122_760008_11.pdf'))

  const content = pdfDataToString(pdfData)

  expect(content).matchSnapshot()
})

it('calculate max line width', () => {
  const maxWidth = getMaxLineWidth(`
    3.你看過沈國仁的水彩畫作嗎? 水彩是最簡易的繪圖工具，但運用得好，並
    不容易。以你的經驗為例，請說明你駕馭水彩的過程以及從中獲得的成功或
    失敗的經驗。(參閱 1-1)
  `.split('\n').map(line => line.trim()).filter(line => line !== '').join('\n'))

  expect(maxWidth).toBe(66)
})

it.each([
  '1011_760008_11',
  '1122_760008_11',
  '1122_780022_11',
  '1122_780051_11',
  '1042_760008_11',
])('serialize pdf string to paragraphs - %s', async filename => {
  const pdfData = await loadPdf(path.resolve(__dirname, `fixtures/${filename}.pdf`))
  let content = pdfDataToString(pdfData)

  content = serializePdfStringToParagraphs(content)

  expect(content).matchSnapshot()
})
