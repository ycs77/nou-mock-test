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
import type { Textarea } from '#shared/types/exam'

interface ExamTextareaProps extends Textarea {
  section: Block
  answerMode?: boolean
}

defineProps<ExamTextareaProps>()

const modelValue = defineModel<Textarea['userAnswer']>({
  required: true,
})
</script>
