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

const examData = typeof localStorage !== 'undefined' ? localStorage.getItem('nou-mock-exam') : null
if (!examData) {
  router.push('/')
}

const store: ExamStore = JSON.parse(examData ?? '{"blocks":[]}')
if (typeof store.score !== 'undefined') {
  router.push('/result')
}

const blocks = shallowRef(store.blocks)
const answers = ref({}) as Ref<Record<string, FieldBlock['userAnswer']>>

const editorValue = ref(JSON.stringify(blocks.value, null, 2))

watch(blocks, blocks => {
  const newAnswers: Record<string, FieldBlock['userAnswer']> = {}

  blocks.forEach(block => {
    if (isSection(block)) {
      block.children.forEach(field => {
        // 使用 cyrb53 雜湊題目文字作為 key，避免重複
        newAnswers[`${cyrb53(field.subject)}`] = answers.value[`${cyrb53(field.subject)}`] ?? (
          field.type === 'checkbox' ? [] : undefined
        )
      })
    }
  })

  answers.value = newAnswers
}, { immediate: true })

watch(editorValue, () => {
  blocks.value = JSON.parse(editorValue.value)
  store.blocks = blocks.value
  localStorage.setItem('nou-mock-exam', JSON.stringify(store))
})

async function submit() {
  const instance = modal.open(ExamConfirmModal)

  const result = await instance.result
  if (result) {
    const store = calculateExam(blocks.value, answers.value)

    localStorage.setItem('nou-mock-exam', JSON.stringify(store))

    router.push('/result')
  }
}
</script>
