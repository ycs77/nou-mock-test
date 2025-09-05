<template>
  <h1 class="text-center text-2xl sm:text-3xl font-bold">
    {{ subject }}
  </h1>
</template>

<script setup lang="ts">
import type { Block } from '#shared/types/exam'

interface ExamTitleProps extends Block {
  //
}

defineProps<ExamTitleProps>()
</script>
