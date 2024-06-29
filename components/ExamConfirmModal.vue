<template>
  <UModal v-model="isOpen">
    <UCard
      :ui="{
        body: {
          padding: 'px-4 py-8 sm:px-6 sm:py-8',
        },
      }"
    >
      <h3 class="text-lg text-center text-gray-900 dark:text-white font-semibold">
        確定要提交作答結果嗎？
      </h3>

      <div class="mt-8 flex justify-center gap-6">
        <UButton type="button" size="md" variant="outline" @click="isOpen = false">取消</UButton>
        <UButton type="button" size="md" @click="success">確定</UButton>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const emit = defineEmits(['success'])

const isOpen = defineModel<boolean>({ default: false })

function success() {
  emit('success')
  isOpen.value = false
}
</script>
