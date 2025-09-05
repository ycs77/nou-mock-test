<template>
  <UCard
    variant="subtle"
    :ui="{
      body: 'flex gap-4 px-4 pt-3 pb-3.5 sm:px-4 sm:pt-3 sm:pb-3.5',
    }"
    class="mt-4"
  >
    <div class="flex-1 min-w-0">
      <h4>{{ subject }}</h4>

      <slot />

      <div v-if="answerMode && reference" class="mt-5">
        <div class="block px-3 py-2 bg-warning/10 text-sm text-warning border border-warning/25 rounded-md">
          <UIcon name="i-heroicons-information-circle-20-solid" class="inline-block align-middle -mt-1 size-5" />
          參考：{{ reference }}
        </div>
      </div>
    </div>

    <div v-if="answerMode" class="shrink-0">
      <UIcon
        :name="userAnswerCorrect ? 'i-heroicons-check-20-solid' : 'i-heroicons-x-mark-20-solid'"
        class="size-8"
        :class="userAnswerCorrect ? 'text-success' : 'text-error'"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { FieldBlock } from '#shared/types/exam'

interface ExamFieldProps extends FieldBlock {
  section: Block
  answerMode?: boolean
}

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<ExamFieldProps>()

const userAnswerCorrect = ref<boolean | null>(null)

watch([
  () => props.subject,
  () => props.answer,
  () => props.userAnswer,
], () => {
  const field: FieldBlock = {
    type: props.type,
    subject: props.subject,
    answer: props.answer,
    userAnswer: props.userAnswer,
  }

  userAnswerCorrect.value = checkField(props.section, field)
}, { immediate: true })
</script>
