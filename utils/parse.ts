import type { Block, Radio, Section, Textarea } from '../types/exam'

export function parseExam(content: string) {
  let sectionTitle = null as '是非題' | '選擇題' | '簡答題' | '問答題' | '申論題' | null

  const blocks: Block[] = []

  const lines = content
    .split('\n')
    .filter(line => line.trim() !== '')

  for (const line of lines) {
    // ex: 國立空中大學 112 學年度下學期期中考試題【正參】095
    const titleMatchs = line.match(/^國立空中大學 ?\d+ ?學年度[上下]學期期[中末]考試題/)
    if (titleMatchs) {
      blocks.push({
        type: 'title',
        subject: titleMatchs[0],
      })
      continue
    }

    // ex: 科目：Linux 作業系統管理  一律橫式作答 2-2 頁
    const subtitleMatchs = line.match(/^(科目：[^【一]+)(?:【[^】]+】)? ?一律橫式作答 (?:\d+-)?(\d+) ?頁/)
    if (subtitleMatchs) {
      const page = Number.parseInt(subtitleMatchs[2] ?? '1')
      if (page === 1) {
        blocks.push({
          type: 'subtitle',
          subject: subtitleMatchs[1].trim(),
        })
      }
      continue
    }

    // ex: 一、選擇題（每題 5 分，共 50 分）
    const sectionTitleMatchs = line.match(/^([一二三四五六七八九十壹貳參肆伍陸柒捌玖拾])[、 ]?(是非題|選擇題|簡答題|問答題|申論題)/)
    if (sectionTitleMatchs) {
      const count = sectionTitleMatchs[1]
      sectionTitle = sectionTitleMatchs[2] as '是非題' | '選擇題' | '簡答題' | '問答題' | '申論題'
      const section: Section = {
        type: 'section',
        subject: `${count}、${sectionTitle}`,
        scoreOfItem: 0,
        scoreTotal: 0,
        children: [],
      }

      // ex: 每題5分
      if (line.match(/每題 ?\d+ ?分/)) {
        section.scoreOfItem = Number.parseInt(line.match(/每題 ?(\d+) ?分/)?.[1] ?? '0')
      }

      if (line.match(/共 ?\d+ ?分/)) {
        // ex: 共50分
        section.scoreTotal = Number.parseInt(line.match(/共 ?(\d+) ?分/)?.[1] ?? '0')
      } else if (line.match(/\d{1,2}%/)) {
        // ex: (50%)
        section.scoreTotal = Number.parseInt(line.match(/(\d{1,2})%/)?.[1] ?? '0')
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
        answer: undefined,
        reference: undefined,
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
      const field: Radio = {
        type: 'radio',
        subject: line,
        options: [],
        answer: undefined,
        reference: undefined,
      }

      // ex: A 1.
      // ex: (A) 1.
      // ex: A 或 C 1.
      const matches = field.subject.match(/^\(?([A-E])(?: 或 ([A-E]))?\)? ?\d+\./i)
      if (matches) {
        if (matches[2]) {
          field.answer = matches.slice(1, 3)
        } else {
          field.answer = matches[1]
        }
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
      } else if (field.subject.match(/\((P\.[\d\-. 圖]+)\)$/)) {
        // 確認題目結尾存在對應課程章節
        // ex: (P.1 圖1-1)
        field.reference = field.subject.match(/\((P\.[\d\-. 圖]+)\)$/)?.[1]
        field.subject = field.subject.replace(/\((P\.[\d\-. 圖]+)\)$/, '').trim()
      }

      // ex: (A)... (B)... (C)... (D)...
      if (field.subject.match(/\(A\)/i)) {
        const matches = field.subject.match(/^(.+)(\(A\).+)$/i)
        field.subject = matches?.[1] ?? ''

        const optionsStr = matches?.[2] ?? ''
        field.options = optionsStr.match(/\([A-E]\)[^(]+/gi)!
          .map(option => option.replace(/(\([A-E]\)) ?/i, '$1 ').trim())

        if (field.options[0] && !field.options[0].endsWith('。')) {
          field.options[field.options.length - 1] = field.options[field.options.length - 1].replace(/。$/, '')
        }
      }

      const section = blocks[blocks.length - 1] as Section
      if (section.type === 'section') {
        section.children.push(field)
      }
      continue
    }

    // 解析簡答題 or 問答題
    else if (sectionTitle === '簡答題' || sectionTitle === '問答題') {
      if (line.match(/^(?:\d+\.|[一二三四五六七八九十]、)/)) {
        const field: Textarea = {
          type: 'textarea',
          subject: line,
          answer: undefined,
          reference: undefined,
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
      } else {
        const section = blocks[blocks.length - 1] as Section
        const field = section.children[section.children.length - 1] as Textarea

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
        answer: undefined,
        reference: undefined,
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
