import { PDFExtract } from 'pdf.js-extract'
import type { PDFExtractOptions, PDFExtractResult } from 'pdf.js-extract'

export function loadPdf(filename: string, options: PDFExtractOptions = {}) {
  const pdfExtract = new PDFExtract()

  return new Promise<PDFExtractResult>((resolve, reject) => {
    pdfExtract.extract(filename, options, (err, data) => {
      if (err) {
        reject(err)
        return
      }

      if (!data) {
        reject(new Error(`The PDF file [${filename}] has no data`))
        return
      }

      resolve(data)
    })
  })
}
