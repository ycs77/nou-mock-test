<template>
  <UContainer
    :ui="{
      padding: 'py-16',
      constrained: 'max-w-[480px]',
    }"
  >
    <h1 class="text-center text-2xl sm:text-3xl font-bold">
      空中大學考古題 線上模擬表單
    </h1>

    <div class="mt-12 sm:mt-20">
      <UForm ref="form" :state="{}">
        <UFormGroup label="選擇考古題 PDF 檔" name="file">
          <UInput
            type="file"
            size="lg"
            icon="i-heroicons-folder"
            accept=".pdf"
            class="w-full"
            :loading="loading"
            :disabled="loading"
            @change="selectFile"
          />
        </UFormGroup>
      </UForm>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { Form } from '#ui/types'
import type { ExamStore } from '~/types/exam'

const router = useRouter()

const form = ref<Form<any>>(undefined!)
const file = ref<File | null>(null)

const loading = ref(false)

if (typeof localStorage !== 'undefined') {
  localStorage.removeItem('nou-mock-exam')
}

function selectFile(files: FileList) {
  file.value = files[0] ?? null

  submit()
}

async function submit() {
  form.value.clear()

  const formData = new FormData()

  if (file.value) {
    formData.append('pdf', file.value)
  }

  loading.value = true

  const res = await $fetch('/api/exam', {
    method: 'POST',
    body: formData,
  })

  loading.value = false

  if (res.status === 200) {
    const store = {
      blocks: res.blocks,
    } satisfies ExamStore

    localStorage.setItem('nou-mock-exam', JSON.stringify(store))

    router.push('/exam')
  } else if (res.status >= 400 && res.status < 500) {
    form.value.setErrors([
      {
        path: 'file',
        message: res.message,
      },
    ])
  }
}
</script>
