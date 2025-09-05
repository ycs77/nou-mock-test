<template>
  <header>
    <UContainer class="flex items-center justify-between gap-3 h-16 border-b border-default">
      <div class="lg:flex-1 flex items-center gap-1.5 font-bold">
        <span class="text-lg sm:hidden">空大考古題 線上模擬表單</span>
        <span class="hidden sm:inline sm:text-xl">空中大學考古題 線上模擬表單</span>
      </div>

      <div class="flex items-center justify-end lg:flex-1 gap-1.5">
        <ColorModeButton />

        <UButton
          v-for="(link, index) of links"
          :key="index"
          color="neutral"
          variant="ghost"
          v-bind="link"
        />
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
const links = [
  {
    icon: 'i-simple-icons-github',
    to: 'https://github.com/ycs77/nou-mock-test',
    target: '_blank',
    'aria-label': 'Source on GitHub',
  },
]
</script>
