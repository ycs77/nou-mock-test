import { h } from 'vue'
import type { DefineComponent, FunctionalComponent, PropType } from 'vue'
import ExamRadio from './ExamRadio.vue'
import ExamTextarea from './ExamTextarea.vue'
import type { Section } from '~/types/exam'

interface ExamSectionProps extends Section {
  index: string
  answers: Record<string, string | undefined>
  answerMode?: boolean
}

// eslint-disable-next-line ts/consistent-type-definitions
type ExamSectionEvents = {
  'update:answers': (answers: Record<string, string | undefined>) => void
}

const ExamSection: FunctionalComponent<ExamSectionProps, ExamSectionEvents> = (props, { emit }) => {
  return h('div', [
    h('h3', { class: 'mt-8 text-lg sm:text-xl font-bold' }, [
      `${props.subject}（每題 ${props.scoreOfItem} 分，共 ${props.scoreTotal} 分）`,
    ]),

    ...props.children.map(field => {
      const attrs = {
        key: field.subject,
        answerMode: props.answerMode,
      }

      // 使用 cyrb53 雜湊題目文字作為 key，避免重複
      const modelValueKey = `${cyrb53(field.subject)}`

      if (isRadio(field)) {
        return h(ExamRadio as unknown as DefineComponent<typeof field>, {
          ...field,
          ...attrs,
          modelValue: props.answers[modelValueKey],
          'onUpdate:modelValue': (modelValue: string | undefined) => {
            emit('update:answers', {
              ...props.answers,
              [modelValueKey]: modelValue,
            })
          },
        })
      } else if (isTextarea(field)) {
        return h(ExamTextarea as unknown as DefineComponent<typeof field>, {
          ...field,
          ...attrs,
          modelValue: props.answers[modelValueKey],
          'onUpdate:modelValue': (modelValue: string | undefined) => {
            emit('update:answers', {
              ...props.answers,
              [modelValueKey]: modelValue,
            })
          },
        })
      } else {
        return null
      }
    }),
  ])
}

ExamSection.props = {
  type: {
    type: String as PropType<'section'>,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  scoreOfItem: {
    type: Number,
    required: true,
  },
  scoreTotal: {
    type: Number,
    required: true,
  },
  children: {
    type: Array,
    required: true,
  },
  index: {
    type: String,
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
}

ExamSection.emits = ['update:answers']

export default ExamSection
