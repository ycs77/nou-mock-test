<template>
  <UCard
    class="mt-4"
    :ui="{
      body: {
        base: 'flex gap-4',
        padding: 'px-4 pt-3 pb-3.5 sm:px-4 sm:pt-3 sm:pb-3.5',
      },
    }"
  >
    <div class="flex-1 min-w-0">
      <h4>{{ subject }}</h4>

      <slot />

      <div v-if="answerMode && reference" class="mt-5">
        <div class="block px-2.5 py-1 bg-amber-100 dark:bg-amber-900 text-sm text-amber-500 dark:text-amber-400 border border-amber-400 dark:border-amber-500 rounded-md">
          <UIcon name="i-heroicons-information-circle-20-solid" class="inline-block align-middle -mt-1 size-5" />
          參考：{{ reference }}
        </div>
      </div>
    </div>

    <div v-if="answerMode" class="shrink-0">
      <UIcon
        :name="userAnswerCorrect ? 'i-heroicons-check-20-solid' : 'i-heroicons-x-mark-20-solid'"
        class="size-8 text-green-500"
        :class="{
          'text-green-500': userAnswerCorrect,
          'text-red-500': !userAnswerCorrect,
        }"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Block, Field } from '~/types/exam'

interface ExamFieldProps extends Field {
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
  userAnswerCorrect.value = checkField(props.section, {
    type: props.type,
    subject: props.subject,
    answer: props.answer,
    userAnswer: props.userAnswer,
  })
}, { immediate: true })
</script>
