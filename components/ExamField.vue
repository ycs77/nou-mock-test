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

      <div v-if="answerMode && reference" class="mt-4">
        <div class="inline-block px-2.5 py-1 bg-amber-100 dark:bg-amber-900 text-sm text-amber-500 dark:text-amber-400 border border-amber-400 dark:border-amber-500 rounded-md">
          <UIcon name="i-heroicons-information-circle" class="inline-block align-middle -mt-1 size-5" />
          {{ reference }}
        </div>
      </div>
    </div>

    <div v-if="answerMode" class="shrink-0">
      <UIcon v-if="userAnswerCorrect" name="i-heroicons-check" class="size-7 text-green-500" />
      <UIcon v-else name="i-heroicons-x-mark" class="size-7 text-red-500" />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Field } from '~/types/exam'

interface ExamFieldProps extends Field {
  answerMode?: boolean
}

defineOptions({
  inheritAttrs: false,
})

defineProps<ExamFieldProps>()
</script>
