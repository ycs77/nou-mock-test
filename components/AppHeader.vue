<template>
  <header>
    <UContainer class="flex items-center justify-between gap-3 h-[4rem] border-b border-gray-200 dark:border-gray-800">
      <div class="lg:flex-1 flex items-center gap-1.5 text-gray-900 dark:text-white font-bold">
        <span class="text-lg sm:hidden">空大考古題 線上模擬表單</span>
        <span class="hidden sm:inline sm:text-xl">空中大學考古題 線上模擬表單</span>
      </div>

      <div class="flex items-center justify-end lg:flex-1 gap-1.5">
        <ColorModeButton />

        <UButton
          v-for="(link, index) of links"
          :key="index"
          v-bind="{ color: 'gray', variant: 'ghost', ...link }"
        />
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
const links = [{
  icon: 'i-simple-icons-github',
  to: 'https://github.com/ycs77/nou-mock-test',
  target: '_blank',
  'aria-label': 'Source on GitHub',
}]
</script>
