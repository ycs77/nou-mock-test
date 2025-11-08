<template>
  <UContainer class="[--ui-container:840px] py-12">
    <Exam
      v-model:answers="answers"
      :blocks
    >
      <template #footer>
        <div class="mt-8 flex justify-center gap-6">
          <UButton to="/" variant="outline" label="返回" />
          <UButton type="button" label="作答完成" @click="submit" />
        </div>
      </template>
    </Exam>

    <ExamSchemaEditorModal v-model:value="editorValue" />
  </UContainer>
</template>

<script setup lang="ts">
import { ExamConfirmModal } from '#components'

const router = useRouter()

const overlay = useOverlay()
const modal = overlay.create(ExamConfirmModal)

// 獲取考試資料，如果沒有或已完成則跳轉
const store = getExamStore()
if (!store) {
  router.push('/')
} else if (typeof store.score !== 'undefined') {
  router.push('/result')
}

const blocks = shallowRef(store?.blocks ?? [])
const answers = ref({}) as Ref<Record<string, FieldBlock['userAnswer']>>

const editorValue = ref(JSON.stringify(blocks.value, null, 2))

watch(blocks, blocks => {
  const newAnswers: Record<string, FieldBlock['userAnswer']> = {}

  blocks.forEach(block => {
    if (isSection(block)) {
      block.children.forEach(field => {
        newAnswers[getFieldKey(field.subject)] = answers.value[getFieldKey(field.subject)] ?? (
          field.type === 'checkbox' ? [] : undefined
        )
      })
    }
  })

  answers.value = newAnswers
}, { immediate: true })

watch(editorValue, () => {
  if (!store) return

  try {
    blocks.value = JSON.parse(editorValue.value)
    store.blocks = blocks.value
    setExamStore(store)
  } catch {
    // JSON 解析失敗時忽略更新
  }
})

async function submit() {
  const instance = modal.open(ExamConfirmModal)

  const result = await instance.result
  if (result) {
    const calculatedStore = calculateExam(blocks.value, answers.value)

    setExamStore(calculatedStore)

    router.push('/result')
  }
}
</script>
