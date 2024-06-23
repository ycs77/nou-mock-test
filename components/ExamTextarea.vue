<template>
  <ExamField v-bind="$props">
    <UTextarea
      v-model="modelValue"
      class="mt-2"
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
