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
            'bg-gray-100 hover:bg-blue-100 dark:bg-gray-800 dark:hover:bg-gray-700 has-[:checked]:bg-blue-500 has-[:checked]:text-white dark:has-[:checked]:bg-blue-500': !answerMode,
            'ring-2 ring-green-500 ring-offset-2 dark:ring-offset-gray-900': answerMode && answers.includes(option.value),
            'bg-blue-500 text-white': answerMode && modelValue.includes(option.value) && modelValue.some(option => answers.includes(option)),
            'bg-gray-100 dark:bg-gray-800': answerMode && !modelValue.includes(option.value),
            'bg-red-500 text-white': answerMode && modelValue.includes(option.value) && !modelValue.some(option => answers.includes(option)),
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
import type { Block, Checkbox } from '~/types/exam'

interface ExamCheckboxProps extends Checkbox {
  section: Block
  answerMode?: boolean
}

const props = defineProps<ExamCheckboxProps>()

const modelValue = defineModel<Exclude<Checkbox['userAnswer'], undefined>>({ required: true })

const answers = computed(() => {
  if (typeof props.answer === 'undefined') return []
  if (Array.isArray(props.answer)) return props.answer
  return [props.answer]
})

const formattedOptions = computed(() => {
  return props.options.map(option => {
    const m = option.match(/^\(?([A-E])\)? ?/i)
    if (m) {
      return { label: option, value: m[1] }
    }
    return { label: option, value: option }
  })
})

const isSelect = computed(() => props.options.some(option => option.match(/^\(?([A-E])\)? ?/i)))
</script>
