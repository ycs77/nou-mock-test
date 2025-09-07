import fs from 'node:fs'
import { resolve } from 'pathe'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-Hant-TW',
      },
    },
  },
  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt',
    'nuxt-monaco-editor',
  ],
  css: ['~/assets/css/main.css'],
  ssr: false,
  hooks: {
    'nitro:init': nitro => {
      nitro.options.rollupConfig!.plugins =
        Array.isArray(nitro.options.rollupConfig!.plugins)
          ? nitro.options.rollupConfig!.plugins
          : nitro.options.rollupConfig!.plugins ? [nitro.options.rollupConfig!.plugins] : []

      nitro.options.rollupConfig!.plugins.push({
        name: 'copy-pdfjs-worker',
        buildEnd() {
          const pdfDir = 'node_modules/pdf.js-extract/lib/pdfjs'

          fs.mkdirSync(
            resolve(nitro.options.output.serverDir, pdfDir),
            { recursive: true },
          )

          fs.copyFileSync(
            resolve(pdfDir, 'pdf.worker.js'),
            resolve(nitro.options.output.serverDir, pdfDir, 'pdf.worker.js'),
          )
        },
      })
    },
  },
  devtools: { enabled: true },
  compatibilityDate: '2025-07-15',
})
