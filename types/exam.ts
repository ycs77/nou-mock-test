export interface Block {
  type: string
  subject: string
}

export interface Section extends Block {
  type: 'section'
  scoreOfItem: number
  scoreTotal: number
  children: Field[]
}

export interface Field extends Block {
  answer?: string | string[]
  reference?: string

  // User answer
  userAnswer?: string
}

export interface Radio extends Field {
  type: 'radio'
  options: string[]
}

export interface Textarea extends Field {
  type: 'textarea'
  answer?: string
}

export interface Store {
  blocks: Block[]
  score?: number
}
