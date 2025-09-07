import type { PDFExtractResult, PDFExtractText } from 'pdf.js-extract'
import type { SectionType } from '../types/exam'
import stringWidth from 'string-width'

/**
 * 將 PDF 檔案資料轉換為文字內容
 * @param pdfData PDF 檔案資料
 * @param lineDeviation 計算同一行的文字允許的誤差值
 */
export function pdfDataToString(pdfData: PDFExtractResult, lineDeviation: number = 2): string {
  let prevY = null as number | null

  const texts = pdfData
    .pages
    .reduce<PDFExtractText[]>((texts, page) => [...texts, ...page.content], [])

  const content = texts.reduce<string>((content, text) => {
    let breakline = ''

    // 和上一個元素不同行，因此輸出換行符號
    if (typeof prevY === 'number' && Math.abs(text.y - prevY) > lineDeviation) {
      breakline = `\n`
    }

    prevY = text.y

    return `${content}${breakline}${text.str}`
  }, '')

  return content
}

export function getMaxLineWidth(content: string): number {
  return content
    .split('\n')
    .reduce((maxWidth, line) => Math.max(maxWidth, stringWidth(line)), 0)
}

/**
 * 將 PDF 字串內容轉換為正確的文字段落
 */
export function serializePdfStringToParagraphs(content: string): string {
  const maxWidth = getMaxLineWidth(content)

  // ignores
  const ignores = [
    '其他符號作答不計分',
    '按題號依序作答',
  ]

  let newContent = ''
  let sectionTitle = null as SectionType | null

  // 當前題目
  let currentQuestion = '' as string
  let currentQuestionComplete = true

  // 當前答案段落是否可以換行
  let currentAnswerCanBreakLine = false

  const lines = content
    .split('\n')
    .filter(line => line.trim() !== '')

  for (const line of lines) {
    if (ignores.some(text => line.includes(text))) continue

    // ex: 國立空中大學 112 學年度下學期期中考試題【正參】095
    // ex: 國立空中大學 106 學年度暑期期末考試題【正參】03
    if (line.match(/^國立空中大學 ?\d+ ?學年度(?:上學期|下學期|暑期)期[中末]考試題/)) {
      newContent += `${line}\n`
      continue
    }

    // ex: 科目：Linux 作業系統管理  一律橫式作答2-2頁
    if (line.startsWith('科目：')) {
      newContent += `${line}\n`
      continue
    }

    // ex: 作答結束
    if (line === '作答結束') continue

    // ex: 背面尚有試題
    if (line === '背面尚有試題') continue

    // ex: 一、選擇題（每題 5 分，共 50 分）
    const titleLine = line.replace(/(?<=[一二三四五六七八九十壹貳參肆伍陸柒捌玖拾]、? ?)單選題/, '選擇題')
    const sectionTitleMatchs = titleLine.match(/^[一二三四五六七八九十壹貳參肆伍陸柒捌玖拾]、? ?(是非題|選擇題|解釋名詞|簡答題|問答題|申論題)/)
    if (sectionTitleMatchs) {
      newContent = newContent.replace(/\n$/, '')
      newContent += `\n${titleLine}\n`
      sectionTitle = sectionTitleMatchs[1] as SectionType
      continue
    }

    // 解析是非題
    if (sectionTitle === '是非題') {
      if (line.match(/^[OX] ?\d+\./)) {
        // ex: X 1.
        // ex: X1.
      } else if (line.match(/^\([OX]\) ?\d+\./)) {
        // ex: (O) 1.
      } else if (line.match(/^\d+\./)) {
        // ex: 1.
      } else {
        // 取消上行結尾的換行，因為不是段落中第一行
        newContent = newContent.replace(/\n$/, '')

        // 如果上行結尾和當前行開頭都是英文小寫字母的話，則加上空格
        if (newContent.match(/[a-z]$/) && line.match(/^[a-z]/)) {
          newContent += ' '
        }
        // 如果上行結尾沒有空格，且當前行開頭是 B. C. D. E. 的話，則加上空格
        else if (!newContent.endsWith(' ') && line.match(/^[B-E]\./)) {
          newContent += ' '
        }
      }

      newContent += `${line}\n`
      continue
    }

    // 解析選擇題
    else if (sectionTitle === '選擇題') {
      if (line.match(/^[A-E](?: 或 [A-E])? ?\d+\./)) {
        // ex: A 1.
        // ex: A1.
        // ex: A 或 C 1.
      } else if (line.match(/^\([A-E]\) ?\d+\./)) {
        // ex: (A) 1.
      } else if (line.match(/^\d+\./)) {
        // ex: 1.
      } else {
        // 取消上行結尾的換行，因為不是段落中第一行
        newContent = newContent.replace(/\n$/, '')

        // 如果上行結尾和當前行開頭都是英文小寫字母的話，則加上空格
        if (newContent.match(/[a-z]$/) && line.match(/^[a-z]/)) {
          newContent += ' '
        }
        // 如果上行結尾沒有空格，且當前行開頭是 B. C. D. E. 的話，則加上空格
        else if (!newContent.endsWith(' ') && line.match(/^[B-E]\./)) {
          newContent += ' '
        }
      }

      newContent += `${line}\n`
      continue
    }

    // 解析解釋名詞 or 簡答題 or 問答題
    else if (sectionTitle === '解釋名詞' || sectionTitle === '簡答題' || sectionTitle === '問答題') {
      if (line.match(/^(?:\d+\.|[一二三四五六七八九十]、)/)) {
        // 確認當前行是題目的開始
        // ex: 1.
        currentQuestion = line
        currentQuestionComplete = false
      } else if (currentQuestion && !currentQuestionComplete) {
        // 確認當前行是題目的續行
        currentQuestion += line
      }

      // 當前題目是否輸出完畢
      if (currentQuestion && !currentQuestionComplete) {
        if (currentQuestion.match(/\((\d+-\d+(?:-\d+)?)\)$/)) {
          // 確認題目結尾存在對應課程章節
          // ex: (1-1-1)
          currentQuestionComplete = true
        } else if (currentQuestion.match(/CH\d+ ?P\.\d+$/)) {
          // 確認題目結尾存在對應課程章節
          // ex: CH1 P.1
          currentQuestionComplete = true
        } else if (currentQuestion.match(/\(教科書第[\d\-、]+頁(?:；媒體教材[\d-]+)?\)$/)) {
          // 確認題目結尾存在對應課程章節
          // ex: (教科書第15、17頁)
          // ex: (教科書第15、17頁；媒體教材1-2-3)
          currentQuestionComplete = true
        }
      }

      if (line.match(/^(?:\d+\.|[一二三四五六七八九十]、)/)) {
        // 確保標題換到新行
        // ex: 1.
        newContent = newContent.replace(/\n$/, '')
        newContent += `\n${line}`
      } else if (line.match(/^答 ?[:：]/)) {
        // ex: 答:
        // ex: 答：
        newContent = newContent.replace(/\n$/, '')
        newContent += `\n${line}`
        // 只要出現答案段落，就表示當前題目已經輸出完畢
        currentQuestion = ''
        // 且可以換行
        currentAnswerCanBreakLine = true
      } else {
        newContent += line
      }

      if (currentQuestion && currentQuestionComplete) {
        // 確認當前題目為輸出完畢，才可以換行
        newContent += '\n'
        currentQuestion = ''
      } else if (currentAnswerCanBreakLine && stringWidth(line) < (maxWidth - 10)) {
        // 需要斷行的答案段落，且本行未佔滿頁面寬度
        newContent += '\n'
      }

      continue
    }

    // 解析申論題
    else if (sectionTitle === '申論題') {
      if (line.match(/^[一二三四五六七八九十]、/)) {
        // 確保標題換到新行
        // ex: 一、
        newContent = newContent.replace(/\n$/, '')
        newContent += `\n${line}`
      } else {
        newContent += line
      }

      if (currentAnswerCanBreakLine && stringWidth(line) < (maxWidth - 10)) {
        // 需要斷行的答案段落，且本行未佔滿頁面寬度
        newContent += '\n'
      }

      continue
    }
  }

  // 清除更正文字
  // ex: 113.4.23 更正
  newContent = newContent.replace(/ *\d+\.\d+\.\d+ 更正/g, '')

  return newContent.replace(/\n$/, '')
}
