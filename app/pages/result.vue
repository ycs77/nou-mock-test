<template>
  <UContainer class="[--ui-container:960px] py-12">
    <Exam
      v-model:answers="answers"
      :blocks
      answer-mode
      :score
    >
      <template #footer>
        <div class="mt-8 flex justify-center gap-6">
          <UButton to="/" variant="outline" label="回首頁" />
          <UButton type="button" label="重新答題" @click="restart" />
        </div>
      </template>
    </Exam>

    <ExamSchemaEditorModal v-model:value="editorValue" />
  </UContainer>
</template>

<script setup lang="ts">
const router = useRouter()

const examData = typeof localStorage !== 'undefined' ? localStorage.getItem('nou-mock-exam') : null
if (!examData) {
  router.push('/')
}

const store: ExamStore = JSON.parse(examData ?? '{"blocks":[],"score":0}')
if (typeof store.score === 'undefined') {
  router.push('/')
}

const blocks = shallowRef(store.blocks)
const answers = ref({}) as Ref<Record<string, FieldBlock['userAnswer']>>
const score = ref(store.score ?? 0)

const editorValue = ref(JSON.stringify(blocks.value, null, 2))

watch(blocks, () => {
  blocks.value.forEach(block => {
    if (isSection(block)) {
      block.children.forEach(field => {
        // 使用 cyrb53 雜湊題目文字作為 key，避免重複
        answers.value[`${cyrb53(field.subject)}`] = field.userAnswer
      })
    }
  })
}, { immediate: true })

watch(blocks, () => {
  const store = calculateExam(blocks.value, answers.value)
  if (store.score) {
    score.value = store.score
  }
})

watch(editorValue, () => {
  blocks.value = JSON.parse(editorValue.value)
  store.blocks = blocks.value
  localStorage.setItem('nou-mock-exam', JSON.stringify(store))
})

function restart() {
  store.blocks = store.blocks.map(block => {
    if (isSection(block)) {
      block.children = block.children.map(field => {
        delete field.userAnswer
        return field
      })
    }
    return block
  })
  delete store.score

  localStorage.setItem('nou-mock-exam', JSON.stringify(store))

  router.push('/exam')
}
</script>
