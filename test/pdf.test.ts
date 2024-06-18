import path from 'node:path'
import { expect, it } from 'vitest'

it('load pdf', async () => {
  const pdfData = await loadPdf(path.resolve(__dirname, 'fixtures/1122_760008_11.pdf'))

  expect(pdfData)
    .to.be.an('object')
    .that.has.all.keys('filename', 'meta', 'pages', 'pdfInfo')
})
