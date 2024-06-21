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
              <button type="button" class=" px-4 py-1.5 hover:bg-blue-500 text-blue-500 hover:text-white border border-blue-500 hover:border-blue-500 rounded-md" @click="restart">重新答題</button>
              <NuxtLink to="/" class="px-4 py-1.5 bg-blue-400 hover:bg-blue-500 text-white border border-blue-400 hover:border-blue-500 rounded-md">上傳新考卷</NuxtLink>
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
