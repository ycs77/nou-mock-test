import { resolve } from 'pathe'
import Copy from 'rollup-plugin-copy'

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
    '@nuxt/test-utils/module',
  ],
  ui: {
    global: true,
  },
  hooks: {
    'nitro:init': nitro => {
      nitro.options.rollupConfig!.plugins =
        Array.isArray(nitro.options.rollupConfig!.plugins)
          ? nitro.options.rollupConfig!.plugins
          : nitro.options.rollupConfig!.plugins ? [nitro.options.rollupConfig!.plugins] : []

      nitro.options.rollupConfig!.plugins.push(
        Copy({
          targets: [
            {
              src: 'node_modules/pdf.js-extract/lib/pdfjs/pdf.worker.js',
              dest: resolve(nitro.options.output.serverDir, 'node_modules/pdf.js-extract/lib/pdfjs'),
            },
          ],
        }),
      )
    },
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-08-19',
})
