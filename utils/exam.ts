import type { Block, Field, Radio, Section, Textarea } from '~/types/exam'

export function isSection(block: Block): block is Section {
  return block.type === 'section'
}

export function isRadio(field: Field): field is Radio {
  return field.type === 'radio'
}

export function isTextarea(field: Field): field is Textarea {
  return field.type === 'textarea'
}
