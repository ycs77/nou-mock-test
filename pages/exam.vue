<template>
  <div>
    <Announcement />

    <ClientOnly>
      <div class="container mx-auto px-2 pt-4 pb-12">
        <Exam
          v-model:answers="answers"
          :blocks="blocks"
        >
          <template #footer>
            <div class="mt-8 flex justify-center gap-6">
              <NuxtLink to="/" class="px-4 py-1.5 hover:bg-blue-500 text-blue-500 hover:text-white border border-blue-500 hover:border-blue-500 rounded-md">返回</NuxtLink>
              <button type="button" class="px-4 py-1.5 bg-blue-400 hover:bg-blue-500 text-white border border-blue-400 hover:border-blue-500 rounded-md" @click="submit">作答完成</button>
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

const store: Store = JSON.parse(examData ?? '{"blocks":[]}')
if (typeof store.score !== 'undefined') {
  router.push('/result')
}

const blocks = ref(store.blocks) as Ref<Block[]>
const answers = ref<Record<string, string | undefined>>({})

blocks.value.forEach(block => {
  if (isSection(block)) {
    block.children.forEach(field => {
      // 使用 cyrb53 雜湊題目文字作為 key，避免重複
      answers.value[`${cyrb53(field.subject)}`] = undefined
    })
  }
})

function submit() {
  if (confirm('確定要提交作答結果嗎？')) {
    const store = calculateExam(blocks.value, answers.value)

    localStorage.setItem('nou-mock-exam', JSON.stringify(store))

    router.push('/result')
  }
}
</script>
