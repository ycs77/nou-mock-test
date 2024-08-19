<template>
  <UModal v-model="isOpen" fullscreen>
    <UCard
      :ui="{
        base: 'flex flex-col min-h-full',
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        body: {
          base: 'grow min-h-0',
        },
        header: {
          padding: 'py-4',
        },
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            編輯考卷內容
          </h3>

          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isOpen = false"
          />
        </div>
      </template>

      <div class="h-full min-h-[24rem] [&>div]:h-full">
        <MonacoEditor
          v-model="value"
          lang="json"
          :options="editorOptions"
        />
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton type="button" @click="isOpen = false">確定</UButton>
        </div>
      </template>
    </UCard>
  </UModal>

  <UButton
    icon="i-heroicons-pencil-20-solid"
    square
    :ui="{
      square: { sm: 'p-2' },
      icon: { size: { sm: 'h-4 w-4' } },
    }"
    class="fixed right-8 bottom-8 z-10 rounded-full"
    @click="isOpen = true"
  />
</template>

<script setup lang="ts">
import type * as Monaco from 'monaco-editor'

const props = defineProps<{
  value: string
}>()

const emit = defineEmits<{
  'update:value': [value: string]
}>()

const isOpen = defineModel<boolean>({ default: false })

const colorMode = useColorMode()
const monaco = useMonaco()!

const value = ref(props.value)

const editorOptions = computed(() => ({
  theme: colorMode.value === 'dark' ? 'vs-dark' : 'vs-light',
  stickyScroll: {
    enabled: false,
  },
  minimap: {
    enabled: false,
  },
} satisfies Monaco.editor.IStandaloneEditorConstructionOptions))

monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
  validate: true,
  schemas: [
    {
      uri: 'https://myserver/nou-exam.json',
      fileMatch: ['*'],
      schema: {
        type: 'array',
        items: {
          type: 'object',
          required: ['type', 'subject'],
          properties: {
            type: {
              type: 'string',
              enum: ['title', 'subtitle', 'section'],
            },
            subject: {
              type: 'string',
            },
            scoreOfItem: {
              type: 'number',
            },
            scoreTotal: {
              type: 'number',
            },
            children: {
              type: 'array',
              items: {
                type: 'object',
                required: ['type', 'subject'],
                properties: {
                  type: {
                    type: 'string',
                    enum: ['radio', 'checkbox', 'textarea'],
                  },
                  subject: {
                    type: 'string',
                  },
                  answer: {
                    oneOff: [
                      {
                        type: 'string',
                      },
                      {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                      },
                    ],
                  },
                  reference: {
                    type: 'string',
                  },
                  userAnswer: {
                    oneOff: [
                      {
                        type: 'string',
                      },
                      {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                      },
                    ],
                  },
                  options: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                },
                oneOff: [
                  {
                    required: ['type', 'subject', 'options'],
                    properties: {
                      type: {
                        const: 'radio',
                      },
                      options: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                      },
                      userAnswer: {
                        type: 'string',
                      },
                    },
                  },
                  {
                    required: ['type', 'subject', 'options'],
                    properties: {
                      type: {
                        const: 'checkbox',
                      },
                      options: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                      },
                      userAnswer: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                      },
                    },
                  },
                  {
                    required: ['type', 'subject', 'answer'],
                    properties: {
                      type: {
                        const: 'textarea',
                      },
                      answer: {
                        type: 'string',
                      },
                      userAnswer: {
                        type: 'string',
                      },
                    },
                  },
                ],
                additionalProperties: false,
              },
            },
          },
          additionalProperties: false,
        },
      },
    },
  ],
})

watch(value, value => {
  try {
    // 如果 JSON 解析失敗，就會拋出 Error，不更新編輯器內容
    JSON.parse(value)

    emit('update:value', value)
  } catch (error) {}
})
</script>
