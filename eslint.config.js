import ycs77, { GLOB_TS, GLOB_VUE } from '@ycs77/eslint-config'

export default ycs77({
  vue: true,
  typescript: true,
  ignores: [
    'bin',
    'test/fixtures',
    'test/__snapshots__',
  ],
})
  .append({
    files: [GLOB_TS, GLOB_VUE],
    rules: {
      'style/brace-style': 'off',
      'style/quote-props': 'off',
    },
  })
