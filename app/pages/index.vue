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
import { FetchError } from 'ofetch'

const router = useRouter()

const form = useTemplateRef<Form<any>>('form')
const file = ref(null) as Ref<File | null>

const loading = ref(false)

// 清除之前的考試資料
clearExamStore()

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
    const { blocks } = await $fetch('/api/exam', {
      method: 'POST',
      body: formData,
    })

    const store: ExamStore = {
      blocks,
    } satisfies ExamStore

    setExamStore(store)

    router.push('/exam')
  } catch (error) {
    if (error instanceof FetchError) {
      form.value?.setErrors([
        {
          name: 'file',
          message: error.data.message,
        },
      ])
    }
  } finally {
    loading.value = false
  }
}
</script>
