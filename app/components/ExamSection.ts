import type { CheckboxBlock, FieldBlock, RadioBlock, SectionBlock, TextareaBlock } from '#shared/types/exam'
import type { FunctionalComponent, PropType } from 'vue'
import ExamCheckbox from './ExamCheckbox.vue'
import ExamRadio from './ExamRadio.vue'
import ExamTextarea from './ExamTextarea.vue'

interface ExamSectionProps extends SectionBlock {
  answers: Record<string, FieldBlock['userAnswer']>
  answerMode?: boolean
}

interface ExamSectionEvents extends Record<string, any[]> {
  'update:answers': [answers: Record<string, FieldBlock['userAnswer']>]
}

const ExamSection: FunctionalComponent<ExamSectionProps, ExamSectionEvents> = (props, { emit }) => {
  return h('div', [
    h('h3', { class: 'mt-8 text-lg sm:text-xl font-bold' }, [
      `${props.subject}（${props.scoreOfItem ? `每題 ${props.scoreOfItem} 分，` : ''}共 ${props.scoreTotal} 分）`,
    ]),

    ...props.children.map(field => {
      const answerKey = getFieldKey(field.subject)

      const fieldProps = {
        key: field.subject,
        section: {
          type: props.type,
          subject: props.subject,
        },
        answerMode: props.answerMode,
      }

      if (isRadio(field)) {
        return h(ExamRadio, {
          ...field,
          ...fieldProps,
          modelValue: props.answers[answerKey] as RadioBlock['userAnswer'],
          'onUpdate:modelValue': (modelValue: RadioBlock['userAnswer']) => {
            emit('update:answers', {
              ...props.answers,
              [answerKey]: modelValue,
            })
          },
        })
      } else if (isCheckbox(field)) {
        return h(ExamCheckbox, {
          ...field,
          ...fieldProps,
          modelValue: props.answers[answerKey] as Exclude<CheckboxBlock['userAnswer'], undefined>,
          'onUpdate:modelValue': (modelValue: Exclude<CheckboxBlock['userAnswer'], undefined>) => {
            emit('update:answers', {
              ...props.answers,
              [answerKey]: modelValue,
            })
          },
        })
      } else if (isTextarea(field)) {
        return h(ExamTextarea, {
          ...field,
          ...fieldProps,
          modelValue: props.answers[answerKey] as TextareaBlock['userAnswer'],
          'onUpdate:modelValue': (modelValue: TextareaBlock['userAnswer']) => {
            emit('update:answers', {
              ...props.answers,
              [answerKey]: modelValue,
            })
          },
        })
      } else {
        return null
      }
    }).filter(Boolean),
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
