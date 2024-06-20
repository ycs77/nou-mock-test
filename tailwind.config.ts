import type { Config } from 'tailwindcss'
import Forms from '@tailwindcss/forms'

export default {
  theme: {
    extend: {},
  },
  plugins: [
    Forms({
      strategy: 'class',
    }),
  ],
} satisfies Partial<Config>
