<template>
  <UContainer class="[--ui-container:480px] py-16">
    <h1 class="text-center text-2xl sm:text-3xl font-bold">
      空中大學考古題 線上模擬表單
    </h1>

    <div class="mt-12 sm:mt-20">
      <UForm ref="form" :state="{}" :validate-on="[]">
        <UFormField label="選擇考古題 PDF 檔" name="file">
          <UInput
            type="file"
            size="lg"
            icon="i-heroicons-folder"
            accept=".pdf"
            class="w-full"
            :loading
            :disabled="loading"
            @change="selectFile"
          />
        </UFormField>
      </UForm>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { Form } from '#ui/types'
import { useTemplateRef } from 'vue'

const router = useRouter()

const form = useTemplateRef<Form<any>>('form')
const file = ref(null) as Ref<File | null>

const loading = ref(false)

if (typeof localStorage !== 'undefined') {
  localStorage.removeItem('nou-mock-exam')
}

function selectFile(event: Event) {
  file.value = (event.target as HTMLInputElement).files?.[0] ?? null

  submit()
}

async function submit() {
  form.value?.clear()

  const formData = new FormData()

  if (file.value) {
    formData.append('pdf', file.value)
  }

  loading.value = true

  try {
    const res = await $fetch('/api/exam', {
      method: 'POST',
      body: formData,
    })

    if (res.status === 200) {
      const store: ExamStore = {
        blocks: res.blocks,
      } satisfies ExamStore

      localStorage.setItem('nou-mock-exam', JSON.stringify(store))

      router.push('/exam')
    } else if (res.status >= 400 && res.status < 500) {
      form.value?.setErrors([
        {
          name: 'file',
          message: res.message,
        },
      ])
    }
  } catch (error) {
    if (error instanceof Error) {
      form.value?.setErrors([
        {
          name: 'file',
          message: error.message,
        },
      ])
    }
  } finally {
    loading.value = false
  }
}
</script>
