import type { Block } from '../types/exam'
import util from 'node:util'
import { query } from '@anthropic-ai/claude-agent-sdk'

/**
 * 使用 AI 解析考試題目內容成 JSON 格式
 */
export async function aiParseExam(content: string): Promise<Block[]> {
  const debug = process.env.DEBUG === 'true'

  let blocks: Block[] = []

  for await (const message of query({
    prompt: `## Instructions

Ensure the JSON structure is valid and properly formatted. Do not include any additional text or explanations outside the JSON structure. Only output the JSON data structure.

## Example

This examination paper content will be parsed into structured JSON format data. The JSON structure should follow this example:

\`\`\`json
{
  "type": "doc",
  "children": [
    {
      "type": "title",
      "subject": "國立空中大學 100 學年度上學期期中考試題"
    },
    {
      "type": "subtitle",
      "subject": "科目：作業系統管理"
    },
    {
      "type": "section",
      "subject": "一、是非題",
      "scoreOfItem": 4,
      "scoreTotal": 20,
      "children": [
        {
          "type": "radio",
          "subject": "1. 這個問題是對的嗎?",
          "options": [
            "O",
            "X"
          ],
          "answer": "O",
          "reference": "P.123"
        }
      ]
    }
  ]
}
\`\`\`

## Types of Nodes

The JSON structure should include the following node types:

### Doc Node
- type: doc
- children: array of title/subtitle/section nodes

### Title Node
- type: title
- subject: string (title text)

### Subtitle Node
Only save the first page subtitle, ignore the rest.
- type: subtitle
- subject: string (subtitle text)

### Section Node
- type: section
- subject: string (section title)
- scoreOfItem: number (total score of this section)
- scoreTotal: number (total score of all items in this section)
- children: array of radio/checkbox/textarea field objects

### Radio Node
- type: radio
- subject: string (question text)
- options: array of strings (answer options with numbering like "1. Option A", "2. Option B", or "A. Option A", "B. Option B" if applicable)
- answer: string (correct answer number like "1", "2", "3", or "A", "B", "C")
- score: number (score for this question)
- reference: string (explanation or reference for the answer)

### Checkbox Node
- type: checkbox
- subject: string (question text)
- options: array of strings (answer options with numbering like "1. Option A", "2. Option B", or "A. Option A", "B. Option B")
- answer: array of strings (correct answers number like "1", "2", "3", or "A", "B", "C")
- score: number (score for this question)
- reference: string (explanation or reference for the answer)

### Textarea Node
- type: textarea
- subject: string (question text)
- answer: string (correct answer)
- score: number (score for this question)
- reference: string (explanation or reference for the answer)

## Source Content

Here is the content:

${content}`,
    options: {
      systemPrompt: 'You\'re a Parser AI, converting plain text exam content into structured JSON format data, which will be used to generate online forms.',
    },
  })) {
    if (message.type === 'result') {
      if (message.subtype === 'success') {
        let jsonResult = null
        const m = message.result.match(/```json\n([\s\S]*?)\n```/)

        if (message.result.startsWith('{') && message.result.endsWith('}')) {
          jsonResult = JSON.parse(message.result)
        } else if (m?.[1]) {
          jsonResult = JSON.parse(m[1])
        } else {
          throw new Error('AI 解析失敗：AI 回傳內容沒有存在 JSON')
        }

        if (!jsonResult || jsonResult.type !== 'doc' || !Array.isArray(jsonResult.children)) {
          throw new Error('AI 解析失敗：JSON 結構不是正確的考卷 JSON 格式')
        }

        if (debug) {
          // eslint-disable-next-line no-console
          console.log('AI message result:', message.result)
          // eslint-disable-next-line no-console
          console.log('searchResult:', util.inspect(jsonResult, false, null, true))
        }

        blocks = jsonResult.children
      } else if (message.subtype === 'error_max_turns') {
        throw new Error('AI 解析失敗：對話回合數過多')
      } else if (message.subtype === 'error_during_execution') {
        throw new Error('AI 解析失敗：執行期間發生錯誤')
      }
    }
  }

  return blocks
}
