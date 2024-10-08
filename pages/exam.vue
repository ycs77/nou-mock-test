<template>
  <UContainer
    :ui="{
      padding: 'py-12',
      constrained: 'max-w-[840px]',
    }"
  >
    <ClientOnly>
      <Exam
        v-model:answers="answers"
        :blocks="blocks"
      >
        <template #footer>
          <div class="mt-8 flex justify-center gap-6">
            <UButton to="/" variant="outline">返回</UButton>
            <UButton type="button" @click="submit">作答完成</UButton>
          </div>
        </template>
      </Exam>

      <ExamSchemaEditorModal v-model:value="editorValue" />
    </ClientOnly>
  </UContainer>
</template>

<script setup lang="ts">
import { ExamConfirmModal } from '#components'
import type { Block, ExamStore, Field } from '~/types/exam'

const router = useRouter()
const modal = useModal()

const examData = typeof localStorage !== 'undefined' ? localStorage.getItem('nou-mock-exam') : null
if (!examData) {
  router.push('/')
}

const store: ExamStore = JSON.parse(examData ?? '{"blocks":[]}')
if (typeof store.score !== 'undefined') {
  router.push('/result')
}

const blocks = ref(store.blocks) as Ref<Block[]>
const answers = ref<Record<string, Field['userAnswer']>>({})

const editorValue = ref(JSON.stringify(blocks.value, null, 2))

watch(blocks, blocks => {
  const newAnswers: Record<string, Field['userAnswer']> = {}

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

function submit() {
  modal.open(ExamConfirmModal, {
    onSuccess() {
      const store = calculateExam(blocks.value, answers.value)

      localStorage.setItem('nou-mock-exam', JSON.stringify(store))

      router.push('/result')
    },
  })
}
</script>
