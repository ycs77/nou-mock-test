import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/*.{test,spec}.ts'],
          environment: 'node',
        },
      },
    ],
  },
})
