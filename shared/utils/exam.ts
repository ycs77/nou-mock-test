import type { CheckboxBlock, MaybeBlock, RadioBlock, SectionBlock, TextareaBlock } from '../types/exam'

export function isSection(block: MaybeBlock): block is SectionBlock {
  return block.type === 'section'
}

export function isRadio(field: MaybeBlock): field is RadioBlock {
  return field.type === 'radio'
}

export function isCheckbox(field: MaybeBlock): field is CheckboxBlock {
  return field.type === 'checkbox'
}

export function isTextarea(field: MaybeBlock): field is TextareaBlock {
  return field.type === 'textarea'
}
