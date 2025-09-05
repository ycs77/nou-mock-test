<template>
  <h2 class="mt-4 text-muted text-center text-xl sm:text-2xl font-bold">
    {{ subject }}
  </h2>

  <div v-if="typeof score === 'number'" class="mt-4 text-5xl text-center font-bold text-primary">
    {{ score }}分
  </div>
</template>

<script setup lang="ts">
import type { Block } from '#shared/types/exam'

interface ExamSubtitleProps extends Block {
  score?: number
}

defineProps<ExamSubtitleProps>()
</script>
