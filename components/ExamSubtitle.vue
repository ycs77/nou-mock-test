<template>
  <h2 class="mt-4 text-gray-700 text-center text-xl sm:text-2xl font-bold">
    {{ subject }}
  </h2>

  <div v-if="typeof score === 'number'" class="mt-4 text-5xl text-center font-bold text-blue-500">
    {{ score }}分
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: 'subtitle'
  subject: string
  score?: number
}>()
</script>
