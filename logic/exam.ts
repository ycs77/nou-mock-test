import type { Block, ExamStore, Field } from '~/types/exam'

export function checkField(section: Block, field: Field): boolean {
  if (section.subject.includes('是非題') || section.subject.includes('選擇題')) {
    // 是非題或選擇題，檢查答案是否正確
    if (typeof field.userAnswer === 'string' && (
      (typeof field.answer === 'string' && field.userAnswer === field.answer) ||
      (Array.isArray(field.answer) && field.answer.includes(field.userAnswer))
    )) {
      return true
    }
  } else {
    // 簡答題或問答題，檢查是否有填寫答案
    if (typeof field.userAnswer === 'string' && field.userAnswer.trim() !== '') {
      return true
    }
  }

  return false
}

export function calculateExam(blocks: Block[], answers: Record<string, string | undefined>) {
  let score = 0

  const newBlocks = blocks.map(block => {
    if (isSection(block)) {
      return {
        ...block,
        children: block.children.map(field => {
          // 使用 cyrb53 雜湊題目文字作為 key，避免重複
          const userAnswer = answers[`${cyrb53(field.subject)}`]

          const newField = {
            ...field,
            userAnswer,
          }

          // 計算分數
          if (checkField(block, newField)) {
            score += block.scoreOfItem
          }

          return newField
        }),
      }
    }
    return block
  })

  return {
    blocks: newBlocks,
    score,
  } satisfies ExamStore as ExamStore
}
