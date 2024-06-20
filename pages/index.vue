<template>
  <div>
    <div class="container max-w-[480px] mx-auto px-2 py-4">
      <h1 class="text-center text-2xl sm:text-3xl font-bold">
        空中大學考古題 線上模擬表單
      </h1>

      <div class="mt-32">
        <form @submit.prevent="submit">
          <input ref="fileEl" type="file" class="form-input w-full">
          <div v-if="error" class="mt-1 text-sm text-red-500">
            {{ error }}
          </div>

          <button class="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            上傳
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const fileEl = ref<HTMLInputElement | null>(null)
const error = ref<string | null>(null)

async function submit() {
  if (!fileEl.value) return

  const formData = new FormData()
  Array.from(fileEl.value.files ?? []).forEach(file => {
    formData.append('pdf', file)
  })

  error.value = null

  const res = await $fetch('/api/exam', {
    method: 'POST',
    body: formData,
  })

  if (res.status === 200) {
    // eslint-disable-next-line no-console
    console.log(res.blocks)
  } else if (res.status >= 400 && res.status < 500) {
    error.value = res.message
  }
}
</script>
