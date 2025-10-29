import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'cli/1-load-from-pdf.ts',
    'cli/2-parse-exam-data.ts',
    'cli/2-ai-parse-exam-data.ts',
  ],
  outDir: 'cli/dist',
})
