export type SectionType = '是非題' | '選擇題' | '解釋名詞' | '簡答題' | '問答題' | '申論題'

export interface Block {
  type: string
  subject: string
}

export interface SectionBlock<ChildBlock extends FieldBlock = FieldBlock> extends Block {
  type: 'section'
  scoreOfItem: number
  scoreTotal: number
  children: ChildBlock[]
}

export interface FieldBlock extends Block {
  answer?: string | string[]
  score?: number
  reference?: string

  // User answer
  userAnswer?: string | string[]
}

export interface RadioBlock extends FieldBlock {
  type: 'radio'
  options: string[]
  userAnswer?: undefined | string
}

export interface CheckboxBlock extends FieldBlock {
  type: 'checkbox'
  options: string[]
  userAnswer?: string[]
}

export interface TextareaBlock extends FieldBlock {
  type: 'textarea'
  answer?: string
  userAnswer?: undefined | string
}

export type MaybeBlock = Block | SectionBlock<MaybeFieldBlock> | MaybeFieldBlock

export type MaybeFieldBlock = FieldBlock | RadioBlock | CheckboxBlock | TextareaBlock

export interface ExamStore {
  blocks: MaybeBlock[]
  score?: number
}
