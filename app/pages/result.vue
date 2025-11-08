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

// 獲取考試資料，如果沒有或未完成則跳轉
const store = getExamStore()
if (!store) {
  router.push('/')
} else if (typeof store.score === 'undefined') {
  router.push('/exam')
}

const blocks = shallowRef(store?.blocks ?? [])
const answers = ref({}) as Ref<Record<string, FieldBlock['userAnswer']>>
const score = ref(store?.score ?? 0)

const editorValue = ref(JSON.stringify(blocks.value, null, 2))

watch(blocks, () => {
  blocks.value.forEach(block => {
    if (isSection(block)) {
      block.children.forEach(field => {
        answers.value[getFieldKey(field.subject)] = field.userAnswer
      })
    }
  })

  const calculatedStore = calculateExam(blocks.value, answers.value)
  if (typeof calculatedStore.score === 'number') {
    score.value = calculatedStore.score
  }
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

function restart() {
  if (!store) return

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

  setExamStore(store)

  router.push('/exam')
}
</script>
