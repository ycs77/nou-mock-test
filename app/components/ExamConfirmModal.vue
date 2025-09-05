<template>
  <UModal :close="{ onClick: () => emit('close', false) }">
    <template #content>
      <UCard
        :ui="{
          body: 'px-4 py-8 sm:px-6 sm:py-8',
        }"
      >
        <h3 class="text-lg text-center font-semibold">
          確定要提交作答結果嗎？
        </h3>

        <div class="mt-8 flex justify-center gap-6">
          <UButton type="button" size="md" variant="outline" label="取消" @click="emit('close', false)" />
          <UButton type="button" size="md" label="確定" @click="emit('close', true)" />
        </div>
      </UCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  close: [boolean]
}>()
</script>
