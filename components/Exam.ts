import { h } from 'vue'
import type { DefineComponent, FunctionalComponent } from 'vue'
import ExamTitle from './ExamTitle.vue'
import ExamSubtitle from './ExamSubtitle.vue'
import ExamSection from './ExamSection'
import type { Block, Field } from '~/types/exam'

interface ExamProps {
  blocks: Block[]
  answers: Record<string, Field['userAnswer']>
  answerMode?: boolean
  score?: number
}

// eslint-disable-next-line ts/consistent-type-definitions
type ExamEvents = {
  'update:answers': (answers: Record<string, Field['userAnswer']>) => void
}

const Exam: FunctionalComponent<ExamProps, ExamEvents> = (props, { slots, emit }) => {
  return h('div', [
    ...props.blocks.map((block, index) => {
      const blockProps = {
        key: block.subject,
      }

      if (block.type === 'title') {
        return h(ExamTitle as unknown as DefineComponent<typeof block>, {
          ...block,
          ...blockProps,
        })
      } else if (block.type === 'subtitle') {
        return h(ExamSubtitle as unknown as DefineComponent<typeof block>, {
          ...block,
          ...blockProps,
          score: props.score,
        })
      } else if (isSection(block)) {
        return h(ExamSection, {
          ...block,
          ...blockProps,
          index: `${index + 1}`,
          answers: props.answers,
          'onUpdate:answers': (answers: Record<string, Field['userAnswer']>) => {
            emit('update:answers', answers)
          },
          answerMode: props.answerMode,
        })
      } else {
        return null
      }
    }),

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
