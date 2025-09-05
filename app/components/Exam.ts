import type { FieldBlock, MaybeBlock } from '#shared/types/exam'
import type { FunctionalComponent } from 'vue'
import ExamSection from './ExamSection'
import ExamSubtitle from './ExamSubtitle.vue'
import ExamTitle from './ExamTitle.vue'

interface ExamProps {
  blocks: MaybeBlock[]
  answers: Record<string, FieldBlock['userAnswer']>
  answerMode?: boolean
  score?: number
}

interface ExamEvents extends Record<string, any[]> {
  'update:answers': [answers: Record<string, FieldBlock['userAnswer']>]
}

const Exam: FunctionalComponent<ExamProps, ExamEvents> = (props, { slots, emit }) => {
  return h('div', [
    ...props.blocks.map(block => {
      if (block.type === 'title') {
        return h(ExamTitle, {
          key: block.subject,
          ...block,
        })
      } else if (block.type === 'subtitle') {
        return h(ExamSubtitle, {
          key: block.subject,
          ...block,
        })
      } else if (isSection(block)) {
        return h(ExamSection, {
          key: block.subject,
          ...block,
          answers: props.answers,
          'onUpdate:answers': (answers: Record<string, FieldBlock['userAnswer']>) => {
            emit('update:answers', answers)
          },
          answerMode: props.answerMode,
        })
      } else {
        return null
      }
    }).filter(Boolean),

    slots.footer?.(),
  ])
}

Exam.props = {
  blocks: {
    type: Array,
    required: true,
  },
  answers: {
    type: Object,
    required: true,
  },
  answerMode: {
    type: Boolean,
    default: false,
  },
  score: Number,
}

Exam.emits = ['update:answers']

export default Exam
