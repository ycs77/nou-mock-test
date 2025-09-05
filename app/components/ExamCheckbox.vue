<template>
  <ExamField v-bind="$props">
    <div
      class="mt-3"
      :class="{
        'flex flex-col gap-4': isSelect,
        'space-x-4': !isSelect,
      }"
    >
      <div
        v-for="option in formattedOptions"
        :key="option.label"
        :class="{ 'inline-block': !isSelect }"
      >
        <label
          class="inline-block px-3.5 py-1 rounded-md select-none"
          :class="{
            'bg-neutral-200/50 hover:bg-primary-100 dark:bg-neutral-700/50 dark:hover:bg-neutral-600/50 has-checked:bg-primary has-checked:text-white dark:has-checked:bg-primary': !answerMode,
            'ring-2 ring-success ring-offset-2 ring-offset-(--ui-bg-elevated)': answerMode && answers.includes(option.value),
            'bg-primary text-white': answerMode && modelValue.includes(option.value) && modelValue.some(option => answers.includes(option)),
            'bg-neutral-200/50 dark:bg-neutral-700/50': answerMode && !modelValue.includes(option.value),
            'bg-error text-white': answerMode && modelValue.includes(option.value) && !modelValue.some(option => answers.includes(option)),
          }"
        >
          <input
            v-model="modelValue"
            type="checkbox"
            :value="option.value"
            :disabled="answerMode"
          >
          {{ option.label }}
        </label>
      </div>
    </div>
  </ExamField>
</template>

<script setup lang="ts">
import type { CheckboxBlock } from '#shared/types/exam'

interface ExamCheckboxProps extends CheckboxBlock {
  section: Block
  answerMode?: boolean
}

const props = defineProps<ExamCheckboxProps>()

const modelValue = defineModel<Exclude<CheckboxBlock['userAnswer'], undefined>>({
  required: true,
  default: () => [],
})

const answers = computed(() => {
  if (typeof props.answer === 'undefined') return []
  if (Array.isArray(props.answer)) return props.answer
  return [props.answer]
})

const formattedOptions = computed(() => {
  return props.options.map(option => {
    const m = option.match(/^\(?([A-E])\)? ?/i)
    if (m?.[1]) {
      return { label: option, value: m[1] }
    }
    return { label: option, value: option }
  })
})

const isSelect = computed(() => props.options.some(option => option.match(/^\(?([A-E])\)? ?/i)))
</script>
