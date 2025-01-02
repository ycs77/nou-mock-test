<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />

    <Announcement />

    <AppHeader />

    <main>
      <NuxtPage />
    </main>

    <UModals />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '空中大學考古題 線上模擬表單',
})
</script>
