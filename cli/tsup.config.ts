import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['cli/2-loaded-from-pdf.ts', 'cli/3-parsed-exam-data.ts'],
  outDir: 'cli/dist',
  format: ['esm'],
  splitting: false,
  clean: true,
})
