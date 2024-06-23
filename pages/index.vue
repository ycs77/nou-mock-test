<template>
  <div>
    <Announcement />

    <div class="container max-w-[480px] mx-auto px-2 py-4">
      <h1 class="text-center text-2xl sm:text-3xl font-bold">
        空中大學考古題 線上模擬表單
      </h1>

      <div class="mt-32">
        <form @submit.prevent="submit">
          <div>
            <input ref="fileEl" type="file" class="w-full form-input rounded-md">
            <div v-if="error" class="mt-1 text-sm text-red-500">
              {{ error }}
            </div>
          </div>

          <button
            class="mt-4 w-full bg-blue-400 enabled:hover:bg-blue-500 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded-md"
            :disabled="loading"
          >
            模擬考開始
          </button>
        </form>
      </div>
    </div>

    <Footer class="mt-32" />
  </div>
</template>

<script setup lang="ts">
import type { Store } from '~/types/exam'

const router = useRouter()

const loading = ref(false)
const fileEl = ref<HTMLInputElement | null>(null)
const error = ref<string | null>(null)

if (typeof localStorage !== 'undefined') {
  localStorage.removeItem('nou-mock-exam')
}

async function submit() {
  if (!fileEl.value) return

  const formData = new FormData()
  Array.from(fileEl.value.files ?? []).forEach(file => {
    formData.append('pdf', file)
  })

  loading.value = true
  error.value = null

  const res = await $fetch('/api/exam', {
    method: 'POST',
    body: formData,
  })

  loading.value = false

  if (res.status === 200) {
    const store = {
      blocks: res.blocks,
    } satisfies Store

    localStorage.setItem('nou-mock-exam', JSON.stringify(store))

    router.push('/exam')
  } else if (res.status >= 400 && res.status < 500) {
    error.value = res.message
  }
}
</script>
