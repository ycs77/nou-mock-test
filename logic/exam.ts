import type { Block, Store } from '~/types/exam'

export function calculateExam(blocks: Block[], answers: Record<string, string | undefined>) {
  let score = 0

  const newBlocks = blocks.map(block => {
    if (isSection(block)) {
      return {
        ...block,
        children: block.children.map(field => {
          // 使用 cyrb53 雜湊題目文字作為 key，避免重複
          const userAnswer = answers[`${cyrb53(field.subject)}`]
          let userAnswerCorrect = false

          if (block.subject.includes('是非題') || block.subject.includes('選擇題')) {
            // 是非題或選擇題，檢查答案是否正確
            if (typeof userAnswer === 'string' && (
              (typeof field.answer === 'string' && userAnswer === field.answer) ||
              (Array.isArray(field.answer) && field.answer.includes(userAnswer))
            )) {
              userAnswerCorrect = true
            }
          } else {
            // 簡答題或問答題，檢查是否有填寫答案
            if (typeof userAnswer === 'string' && userAnswer.trim() !== '') {
              userAnswerCorrect = true
            }
          }

          // 計算分數
          if (userAnswerCorrect) {
            score += block.scoreOfItem
          }

          return {
            ...field,
            userAnswer,
            userAnswerCorrect,
          }
        }),
      }
    }
    return block
  })

  return {
    blocks: newBlocks,
    score,
  } satisfies Store as Store
}
