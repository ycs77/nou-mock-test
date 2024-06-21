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
            'bg-gray-100 hover:bg-blue-100 has-[:checked]:bg-blue-400 has-[:checked]:text-white': !answerMode,
            'ring-2 ring-green-400 ring-offset-2': answerMode && answer === option.value,
            'bg-blue-400 text-white': answerMode && modelValue === option.value && modelValue === answer,
            'bg-gray-100': answerMode && modelValue !== option.value,
            'bg-red-400 text-white': answerMode && modelValue === option.value && modelValue !== answer,
          }"
        >
          <input
            v-model="modelValue"
            type="radio"
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
import type { Radio } from '~/types/exam'

interface ExamRadioProps extends Radio {
  answerMode?: boolean
}

const props = defineProps<ExamRadioProps>()

const modelValue = defineModel<string | undefined>({ required: true })

const formattedOptions = computed(() => {
  return props.options.map(option => {
    const matches = option.match(/^\(?([A-E])\)? ?/i)
    if (matches) {
      return { label: option, value: matches[1] }
    }
    return { label: option, value: option }
  })
})

const isSelect = computed(() => props.options.some(option => option.match(/^\(?([A-E])\)? ?/i)))
</script>
