<template>
  <div class="mt-4 flex gap-4 px-4 pt-3 pb-3.5 border border-gray-300 rounded-md">
    <div class="flex-1 min-w-0">
      <h4>{{ subject }}</h4>

      <slot />

      <div v-if="answerMode && reference" class="mt-4">
        <div class="inline-block px-2.5 py-1 bg-amber-100 text-sm text-amber-500 rounded-md">
          <svg class="inline-block -mt-1 size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd" />
          </svg>

          {{ reference }}
        </div>
      </div>
    </div>

    <div v-if="answerMode" class="shrink-0">
      <svg v-if="userAnswerCorrect" class="size-8 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
      </svg>
      <svg v-else class="size-8 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
      </svg>
    </div>
  </div>
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
