import type { Block, ExamStore, FieldBlock } from '../types/exam'
import { isSection } from '../utils/exam'
import { getFieldKey } from '../utils/storage'

export function checkField(section: Block, field: FieldBlock): boolean {
  if (section.subject.includes('是非題') || section.subject.includes('選擇題')) {
    // 是非題或選擇題，檢查答案是否正確
    if (typeof field.userAnswer === 'string' &&
        (Array.isArray(field.answer) ? field.answer : typeof field.answer === 'undefined' ? [] : [field.answer])
          .includes(field.userAnswer)
    ) {
      return true
    } else if (Array.isArray(field.userAnswer) &&
        (Array.isArray(field.answer) ? field.answer : typeof field.answer === 'undefined' ? [] : [field.answer])
          .every(answer => (field.userAnswer as string[]).includes(answer))
    ) {
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

export function calculateExam(blocks: Block[], answers: Record<string, FieldBlock['userAnswer']>): ExamStore {
  let score = 0

  const newBlocks = blocks.map(block => {
    if (isSection(block)) {
      return {
        ...block,
        children: block.children.map(field => {
          const userAnswer = answers[getFieldKey(field.subject)]

          const newField = {
            ...field,
            userAnswer,
          }

          // 計算分數
          if (checkField(block, newField)) {
            score += newField.score ?? block.scoreOfItem
          }

          return newField
        }),
      }
    }
    return block
  })

  const examStore: ExamStore = {
    blocks: newBlocks,
    score,
  }

  return examStore
}
