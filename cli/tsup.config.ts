import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'cli/1-load-from-pdf.ts',
    'cli/2-parse-exam-data.ts',
  ],
  outDir: 'cli/dist',
  format: ['esm'],
  splitting: false,
  clean: true,
})
