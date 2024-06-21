<template>
  <ExamField v-bind="$props">
    <textarea
      v-model="modelValue"
      class="mt-2 w-full h-24 form-textarea rounded-md focus:ring-blue-500 focus:border-blue-500"
      :disabled="answerMode"
    />
  </ExamField>
</template>

<script setup lang="ts">
import type { Textarea } from '~/types/exam'

interface ExamTextareaProps extends Textarea {
  answerMode?: boolean
}

defineProps<ExamTextareaProps>()

const modelValue = defineModel<string | undefined>({ required: true })
</script>
