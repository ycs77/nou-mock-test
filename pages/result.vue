<template>
  <div>
    <Announcement />

    <ClientOnly>
      <div class="container mx-auto px-2 pt-4 pb-12">
        <Exam
          v-model:answers="answers"
          :blocks="blocks"
          answer-mode
          :score="score"
        >
          <template #footer>
            <div class="mt-8 flex justify-center gap-6">
              <UButton type="button" variant="outline" @click="restart">重新答題</UButton>
              <UButton to="/">上傳新考卷</UButton>
            </div>
          </template>
        </Exam>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { Block, Store } from '~/types/exam'

const router = useRouter()

const examData = typeof localStorage !== 'undefined' ? localStorage.getItem('nou-mock-exam') : null
if (!examData) {
  router.push('/')
}

const store: Store = JSON.parse(examData ?? '{"blocks":[],"score":0}')
if (typeof store.score === 'undefined') {
  router.push('/')
}

const blocks = ref(store.blocks) as Ref<Block[]>
const answers = ref<Record<string, string | undefined>>({})
const score = store.score ?? 0

blocks.value.forEach(block => {
  if (isSection(block)) {
    block.children.forEach(child => {
      // 使用 cyrb53 雜湊題目文字作為 key，避免重複
      answers.value[`${cyrb53(child.subject)}`] = child.userAnswer
    })
  }
})

function restart() {
  store.blocks = store.blocks.map(block => {
    if (isSection(block)) {
      block.children = block.children.map(field => {
        delete field.userAnswer
        delete field.userAnswerCorrect
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
