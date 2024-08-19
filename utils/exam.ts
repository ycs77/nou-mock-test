import type { Block, Checkbox, Field, Radio, Section, Textarea } from '~/types/exam'

export function isSection(block: Block): block is Section {
  return block.type === 'section'
}

export function isRadio(field: Field): field is Radio {
  return field.type === 'radio'
}

export function isCheckbox(field: Field): field is Checkbox {
  return field.type === 'checkbox'
}

export function isTextarea(field: Field): field is Textarea {
  return field.type === 'textarea'
}
