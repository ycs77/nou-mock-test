import type { Block, Checkbox, Field, Radio, Section, SectionType, Textarea } from '~/types/exam'

/**
 * 解析考試題目內容成 JSON 格式
 */
export function parseExam(content: string) {
  let sectionTitle = null as SectionType | null

  const blocks: Block[] = []

  const lines = content
    .split('\n')
    .filter(line => line.trim() !== '')

  for (const line of lines) {
    // 解析考卷標題
    // ex: 國立空中大學 112 學年度下學期期中考試題【正參】095
    // ex: 國立空中大學 106 學年度暑期期末考試題【正參】03
    const titleMatchs = line.match(/^國立空中大學 ?\d+ ?學年度(?:上學期|下學期|暑期)期[中末]考試題/)
    if (titleMatchs) {
      blocks.push({
        type: 'title',
        subject: titleMatchs[0],
      })
      continue
    }

    // 解析科目名稱
    // ex: 科目：Linux 作業系統管理  一律橫式作答 2-2 頁
    const subtitleMatchs = line.match(/^(科目：[^【一]+)(?:【[^】]+】)? ?一律橫式作答 (?:共 )?((?:\d+-)?\d+)? ?頁/)
    if (subtitleMatchs) {
      const subject = subtitleMatchs[1]
      const pageStr = subtitleMatchs[2] ?? ''
      const page: string | undefined = pageStr.split('-')[1]
      if (subject && (
        // 不是 `2-1 頁` 格式
        !page ||

        // 是 `2-1 頁` 格式，且是第1頁
        Number.parseInt(page) === 1
      )) {
        blocks.push({
          type: 'subtitle',
          subject: subtitleMatchs[1].trim(),
        })
      }
      continue
    }

    // 解析章節標題
    // ex: 一、選擇題（每題 5 分，共 50 分）
    const sectionTitleMatchs = line.match(/^([一二三四五六七八九十壹貳參肆伍陸柒捌玖拾])、? ?(是非題|選擇題|解釋名詞|簡答題|問答題|申論題)/)
    if (sectionTitleMatchs) {
      const sectionNum = sectionTitleMatchs[1]
      sectionTitle = sectionTitleMatchs[2] as SectionType
      const section: Section = {
        type: 'section',
        subject: `${sectionNum}、${sectionTitle}`,
        scoreOfItem: 0,
        scoreTotal: 0,
        children: [],
      }

      // ex: 每題5分
      if (line.match(/每題 ?(\d+) ?分/)) {
        section.scoreOfItem = Number.parseInt(line.match(/每題 ?(\d+) ?分/)?.[1] ?? '0')
      }

      if (line.match(/共計? ?(\d+) ?分/)) {
        // ex: 共50分
        section.scoreTotal = Number.parseInt(line.match(/共計? ?(\d+) ?分/)?.[1] ?? '0')
      } else if (line.match(/(\d{1,3})%/)) {
        // ex: (50%)
        section.scoreTotal = Number.parseInt(line.match(/(\d{1,3})%/)?.[1] ?? '0')
      }

      blocks.push(section)
      continue
    }

    // 解析是非題
    if (sectionTitle === '是非題') {
      const field: Radio = {
        type: 'radio',
        subject: line,
        options: ['O', 'X'],
      }

      // ex: X 1.
      // ex: (X) 1.
      if (field.subject.match(/^\(?([OX])\)? ?\d+\./i)) {
        field.answer = field.subject.match(/^\(?([OX])\)? ?/i)?.[1]
        field.subject = field.subject.replace(/^\(?([OX])\)? ?/i, '').trim()
      }

      if (field.subject.match(/\([OX]，([\d\-. 圖]+)\)$/i)) {
        // 確認題目結尾存在對應課程章節
        // ex: (O，1-1)
        const parts = field.subject.match(/\(([OX])，([\d\-. 圖]+)\)$/i)
        field.answer = parts?.[1]
        field.reference = parts?.[2]
        field.subject = field.subject.replace(/\([OX]，([\d\-. 圖]+)\)$/i, '').trim()
      } else if (field.subject.match(/CH\d+ ?P\.\d+$/)) {
        // 確認題目結尾存在對應課程章節
        // ex: CH1 P.1
        field.reference = field.subject.match(/CH\d+ ?P\.\d+$/)?.[0]
        field.subject = field.subject.replace(/CH\d+ ?P\.\d+$/, '').trim()
      } else if (field.subject.match(/\((ch\d+-p\d+(?:~\d+)?)\)/)) {
        // 確認題目結尾存在對應課程章節
        // ex: (ch3-p73~74)
        field.reference = field.subject.match(/\((ch\d+-p\d+(?:~\d+)?)\)/)?.[1]
        field.subject = field.subject.replace(/\((ch\d+-p\d+(?:~\d+)?)\)/, '').trim()
      } else if (field.subject.match(/\((P\.[\d\-. 圖]+)\)$/)) {
        // 確認題目結尾存在對應課程章節
        // ex: (P.1圖1-1)
        field.reference = field.subject.match(/\((P\.[\d\-. 圖]+)\)$/)?.[1]
        field.subject = field.subject.replace(/\((P\.[\d\-. 圖]+)\)$/, '').trim()
      }

      const section = blocks[blocks.length - 1] as Section
      if (section.type === 'section') {
        section.children.push(field)
      }
      continue
    }

    // 解析選擇題
    else if (sectionTitle === '選擇題') {
      // 解析答案文字串
      if (line) {
        let answers: {
          number: string
          answer: Exclude<Field['answer'], undefined>
        }[] = []

        // ex: 1.D 2.B 3.B 4.A 5.C 6.D 7.A 8.B 9.D 10.D
        const lineParts = line.trim().split(' ')
        if (lineParts.length && lineParts.every(text => text.match(/^\d+\.[A-E]{1,3}$/))) {
          answers = line.match(/\d+\.[A-E]{1,3}/g)!.map(answerItem => {
            const m = answerItem.match(/(\d+)\.(.+)/)!
            const number = m[1]
            let answer: Exclude<Field['answer'], undefined> = m[2].trim()
            if (answer.length > 1) {
              answer = answer.split('')
            }
            return { number, answer }
          })
        }

        // ex: 1. 2. 3. 4. 5. 6. 7. 8. 9. 10.C B B A B C D B C A
        const m = line.trim().match(/^((?:\d+\. ?)+)((?:[A-E] ?)+)$/)
        const answerNumParts = m?.[1].split('.').filter(Boolean).map(num => num?.trim()).map(num => Number.parseInt(num)) ?? []
        const answerOptionParts = m?.[2].split(' ').filter(Boolean) ?? []
        if (answerNumParts.length &&
            answerOptionParts.length &&
            answerNumParts.length === answerOptionParts.length
        ) {
          answers = answerNumParts.map((num, index) => ({
            number: num.toString(),
            answer: answerOptionParts[index],
          }))
        }

        if (answers.length) {
          const section = blocks[blocks.length - 1] as Section
          if (section.type === 'section') {
            section.children.forEach(field => {
              if (field.type === 'radio' || field.type === 'checkbox') {
                const answer = answers.find(answer => field.subject.startsWith(`${answer.number}.`))?.answer
                if (answer)
                  field.answer = answer
              }
            })
          }

          continue
        }
      }

      let field: Radio | Checkbox = {
        type: 'radio',
        subject: line,
        options: [],
      }

      if (field.subject.includes('（兩個答案）')) {
        field = {
          type: 'checkbox',
          subject: field.subject,
          options: [],
        }
      }

      // ex: A 1.
      // ex: (A) 1.
      // ex: A 或 C 1.
      const m = field.subject.match(/^\(?([A-E])(?: 或 ([A-E]))?\)? ?\d+\./i)
      if (m) {
        field.answer = m.slice(1, m.length).filter(Boolean)
        if (field.answer.length === 1)
          field.answer = field.answer[0]
        field.subject = field.subject.replace(/^\(?([A-E])(?: 或 ([A-E]))?\)? ?/i, '').trim()
      }

      if (field.subject.match(/\([A-E]，([\d\-. 圖]+)\)$/i)) {
        // 確認題目結尾存在對應課程章節
        // ex: (A，1-1)
        const parts = field.subject.match(/\(([A-E])，([\d\-. 圖]+)\)$/i)
        field.answer = parts?.[1]
        field.reference = parts?.[2]
        field.subject = field.subject.replace(/\([A-E]，([\d\-. 圖]+)\)$/i, '').trim()
      } else if (field.subject.match(/CH\d+ ?P\.\d+$/)) {
        // 確認題目結尾存在對應課程章節
        // ex: CH1 P.1
        field.reference = field.subject.match(/CH\d+ ?P\.\d+$/)?.[0]
        field.subject = field.subject.replace(/CH\d+ ?P\.\d+$/, '').trim()
      } else if (field.subject.match(/\((ch\d+-p\d+(?:~\d+)?)\)/)) {
        // 確認題目結尾存在對應課程章節
        // ex: (ch3-p73~74)
        field.reference = field.subject.match(/\((ch\d+-p\d+(?:~\d+)?)\)/)?.[1]
        field.subject = field.subject.replace(/\((ch\d+-p\d+(?:~\d+)?)\)/, '').trim()
      } else if (field.subject.match(/\((P\.[\d\-. 圖]+)\)$/)) {
        // 確認題目結尾存在對應課程章節
        // ex: (P.1 圖1-1)
        field.reference = field.subject.match(/\((P\.[\d\-. 圖]+)\)$/)?.[1]
        field.subject = field.subject.replace(/\((P\.[\d\-. 圖]+)\)$/, '').trim()
      }

      // ex: (A) ... (B) ... (C) ... (D) ...
      if (field.subject.match(/^(.+)(\(A\).+)$/i)) {
        const m = field.subject.match(/^(.+)(\(A\).+)$/i)!
        field.subject = m[1].trim()

        const optionsStr = m[2]
        field.options = optionsStr.match(/\([A-E]\)[^(]+/gi)!
          .map(option => option.replace(/(\([A-E]\)) ?/i, '$1 ').trim())

        if (field.options[0] && !field.options[0].endsWith('。')) {
          field.options[field.options.length - 1] = field.options[field.options.length - 1].replace(/。$/, '')
        }
      }

      // ex: A ... B ... C ... D ...
      else if (field.subject.match(/^(.+[ ？?] ?)(A .+) (B .+) (C .+)/)) {
        let matches = field.subject.match(/^(.+[ ？?] ?)(A .+) (B .+) (C .+)$/)!
        const matches4 = field.subject.match(/^(.+[ ？?] ?)(A .+) (B .+) (C .+) (D .+)$/)
        const matches5 = field.subject.match(/^(.+[ ？?] ?)(A .+) (B .+) (C .+) (D .+) (E .+)$/)
        if (matches5) matches = matches5
        else if (matches4) matches = matches4

        field.subject = matches[1].trim()
        field.options = matches
          .slice(2, matches.length)
          .filter(Boolean)
          .map(option => option.trim())
      }

      // ex: A.XXX B.XXX C.XXX D.XXX
      else if (field.subject.match(/^(.+[ ？?] ?)(A\..+) (B\..+) (C\..+)/)) {
        let matches = field.subject.match(/^(.+[ ？?] ?)(A\..+) (B\..+) (C\..+)$/)!
        const matches4 = field.subject.match(/^(.+[ ？?] ?)(A\..+) (B\..+) (C\..+) (D\..+)$/)
        const matches5 = field.subject.match(/^(.+[ ？?] ?)(A\..+) (B\..+) (C\..+) (D\..+) (E\..+)$/)
        if (matches5) matches = matches5
        else if (matches4) matches = matches4

        field.subject = matches[1].trim()
        field.options = matches
          .slice(2, matches.length)
          .filter(Boolean)
          .map(option => option.trim())
      }

      const section = blocks[blocks.length - 1] as Section
      if (section.type === 'section') {
        section.children.push(field)
      }
      continue
    }

    // 解析解釋名詞 or 簡答題 or 問答題
    else if (sectionTitle === '解釋名詞' || sectionTitle === '簡答題' || sectionTitle === '問答題') {
      if (line.match(/^(?:\d+\.|[一二三四五六七八九十]、)/)) {
        const field: Textarea = {
          type: 'textarea',
          subject: line,
        }

        if (field.subject.match(/\(([\d\-. 圖]+)\)$/)) {
          // 確認題目結尾存在對應課程章節
          // ex: (1-1-1)
          field.reference = field.subject.match(/\(([\d\-. 圖]+)\)$/)?.[1]
          field.subject = field.subject.replace(/\(([\d\-. 圖]+)\)$/, '').trim()
        } else if (field.subject.match(/CH\d+ ?P\.\d+$/)) {
          // 確認題目結尾存在對應課程章節
          // ex: CH1 P.1
          field.reference = field.subject.match(/CH\d+ ?P\.\d+$/)?.[0]
          field.subject = field.subject.replace(/CH\d+ ?P\.\d+$/, '').trim()
        } else if (field.subject.match(/\((P\.[\d\-. 圖]+)\)$/)) {
          // 確認題目結尾存在對應課程章節
          // ex: (P.1圖1-1)
          field.reference = field.subject.match(/\((P\.[\d\-. 圖]+)\)$/)?.[1]
          field.subject = field.subject.replace(/\((P\.[\d\-. 圖]+)\)$/, '').trim()
        } else if (field.subject.match(/\((ch\d+-p\d+(?:~\d+)?)\)/)) {
          // 確認題目結尾存在對應課程章節
          // ex: (ch3-p73~74)
          field.reference = field.subject.match(/\((ch\d+-p\d+(?:~\d+)?)\)/)?.[1]
          field.subject = field.subject.replace(/\((ch\d+-p\d+(?:~\d+)?)\)/, '').trim()
        } else if (field.subject.match(/\(教科書第 [\d\-、]+ 頁(?:；媒體教材 [\d\-.]+)?\)$/)) {
          // 確認題目結尾存在對應課程章節
          // ex: (教科書第 15、17 頁)
          // ex: (教科書第 15、17 頁；媒體教材 1-2-3)
          field.reference = field.subject.match(/\(教科書第 [\d\-、]+ 頁(?:；媒體教材 [\d\-.]+)?\)$/)?.[0]
          field.subject = field.subject.replace(/\(教科書第 [\d\-、]+ 頁(?:；媒體教材 [\d\-.]+)?\)$/, '').trim()
        }

        // ex. (10 分)
        if (field.subject.match(/\((\d+) ?分\)$/)) {
          const m = field.subject.match(/\((\d+) ?分\)$/)
          if (m) {
            field.score = Number.parseInt(m[1])
          }
        }

        // ex. (10%)
        else if (field.subject.match(/\((\d+)%\)$/)) {
          const m = field.subject.match(/\((\d+)%\)$/)
          if (m) {
            field.score = Number.parseInt(m[1])
          }
        }

        const section = blocks[blocks.length - 1] as Section
        if (section.type === 'section') {
          section.children.push(field)
        }
      } else {
        const section = blocks[blocks.length - 1] as Section
        let field = section.children[section.children.length - 1] as Textarea | undefined
        if (!field) {
          // 若題目不存在，基本上是因為考卷中沒有可解析的小題目，
          // 而是直接給一整段的題目文字，這時候就增加一個新的文字輸入框題目。
          field = {
            type: 'textarea',
            subject: line,
          } satisfies Textarea

          const section = blocks[blocks.length - 1] as Section
          if (section.type === 'section') {
            section.children.push(field)
          }
          continue
        }

        // 解析答案行
        if (field.answer) {
          field.answer += `\n${line}`
        } else {
          field.answer = line
        }

        if (field.answer.match(/P\.[\d\-. 圖]+$/)) {
          // 確認答案存在對應課程章節
          // ex: P.1 圖1-1
          field.reference = field.answer.match(/P\.[\d\-. 圖]+$/)?.[0]
          field.answer = field.answer.replace(/P\.[\d\-. 圖]+$/, '')
        }

        section.children[section.children.length - 1] = field
      }
      continue
    }

    // 解析申論題
    else if (sectionTitle === '申論題') {
      const field: Textarea = {
        type: 'textarea',
        subject: line,
      }

      if (field.subject.match(/\(([\d\-. 圖]+)\)$/)) {
        // 確認題目結尾存在對應課程章節
        // ex: (1-1-1)
        field.reference = field.subject.match(/\(([\d\-. 圖]+)\)$/)?.[1]
        field.subject = field.subject.replace(/\(([\d\-. 圖]+)\)$/, '').trim()
      } else if (field.subject.match(/CH\d+ ?P\.\d+$/)) {
        // 確認題目結尾存在對應課程章節
        // ex: CH1 P.1
        field.reference = field.subject.match(/CH\d+ ?P\.\d+$/)?.[0]
        field.subject = field.subject.replace(/CH\d+ ?P\.\d+$/, '').trim()
      } else if (field.subject.match(/\((ch\d+-p\d+(?:~\d+)?)\)/)) {
        // 確認題目結尾存在對應課程章節
        // ex: (ch3-p73~74)
        field.reference = field.subject.match(/\((ch\d+-p\d+(?:~\d+)?)\)/)?.[1]
        field.subject = field.subject.replace(/\((ch\d+-p\d+(?:~\d+)?)\)/, '').trim()
      } else if (field.subject.match(/\((P\.[\d\-. 圖]+)\)$/)) {
        // 確認題目結尾存在對應課程章節
        // ex: (P.1 圖1-1)
        field.reference = field.subject.match(/\((P\.[\d\-. 圖]+)\)$/)?.[1]
        field.subject = field.subject.replace(/\((P\.[\d\-. 圖]+)\)$/, '').trim()
      } else if (field.subject.match(/\(教科書第 [\d\-、]+ 頁(?:；媒體教材 [\d\-.]+)?\)$/)) {
        // 確認題目結尾存在對應課程章節
        // ex: (教科書第 15、17 頁)
        // ex: (教科書第 15、17 頁；媒體教材 1-2-3)
        field.reference = field.subject.match(/\(教科書第 [\d\-、]+ 頁(?:；媒體教材 [\d\-.]+)?\)$/)?.[0]
        field.subject = field.subject.replace(/\(教科書第 [\d\-、]+ 頁(?:；媒體教材 [\d\-.]+)?\)$/, '').trim()
      }

      const section = blocks[blocks.length - 1] as Section
      if (section.type === 'section') {
        section.children.push(field)
      }
      continue
    }
  }

  return blocks
}
