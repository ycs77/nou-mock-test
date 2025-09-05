<template>
  <ExamField v-bind="$props">
    <UTextarea
      v-model="modelValue"
      class="mt-2"
      :ui="{
        root: 'w-full min-h-[100px]',
      }"
      :disabled="answerMode"
    />
  </ExamField>
</template>

<script setup lang="ts">
import type { TextareaBlock } from '#shared/types/exam'

interface ExamTextareaProps extends TextareaBlock {
  section: Block
  answerMode?: boolean
}

defineProps<ExamTextareaProps>()

const modelValue = defineModel<TextareaBlock['userAnswer']>({
  required: true,
  default: '',
})
</script>
