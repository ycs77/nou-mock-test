<template>
  <UModal
    v-model:open="isOpen"
    title="編輯考卷內容"
    fullscreen
    :ui="{
      footer: 'justify-end',
    }"
  >
    <UButton
      icon="i-heroicons-pencil-20-solid"
      :ui="{
        base: 'p-2',
        leadingIcon: 'h-4 w-4',
      }"
      class="fixed right-8 bottom-8 z-10 rounded-full"
    />

    <template #body>
      <MonacoEditor
        v-model="value"
        lang="json"
        :options="editorOptions"
        class="h-full"
      />
    </template>

    <template #footer>
      <UButton type="button" label="確定" @click="isOpen = false" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type * as Monaco from 'monaco-editor'

const props = defineProps<{
  value: string
}>()

const emit = defineEmits<{
  'update:value': [value: string]
}>()

const isOpen = defineModel<boolean>({
  default: false,
})

const colorMode = useColorMode()
const monaco = await useMonaco()

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
                  score: {
                    type: 'number',
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
  } catch (_) {}
})
</script>
