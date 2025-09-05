import { query } from '@anthropic-ai/claude-code'
import path from 'node:path'
import fs from 'node:fs'
import util from 'node:util'

// test/fixtures/101-1-linux-1ch-2ra-3tx.pdf
// test/fixtures/101-1-linux-1ch-2ra-3tx__2_loaded_from_pdf.txt

// ccc -p "You're a Parser AI with expertise in converting plain text exam content into structured JSON format data, which will be used to generate online forms. Parse this examination paper content @test/fixtures/101-1-linux-1ch-2ra-3tx__2_loaded_from_pdf.txt and output in JSON format with keys: \"type\" (section/radio/checkbox/textarea), \"subject\" (string), \"scoreOfItem\" (number, if type is section), \"scoreTotal\" (number, if type is section), \"answer\" (string/array, if type is radio/checkbox), \"score\" (number, if type is radio/checkbox/textarea), \"reference\" (string, if type is radio/checkbox/textarea), and \"options\" (array of strings, if type is radio/checkbox)."

// process.env.DEBUG = 'true'

const pdfContent = fs.readFileSync(path.resolve('test/fixtures/101-1-linux-1ch-2ra-3tx__2_loaded_from_pdf.txt'), 'utf-8')

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
      "subject": "科目：Linux 作業系統管理"
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

${pdfContent}`,
  options: {
    customSystemPrompt: 'You\'re a Parser AI, converting plain text exam content into structured JSON format data, which will be used to generate online forms.',
  },
})) {
  if (message.type === 'result') {
    let searchResult = null
    const m = message.result.match(/```json\n([\s\S]*?)\n```/)

    if (message.result.startsWith('{') && message.result.endsWith('}')) {
      searchResult = JSON.parse(message.result)
    } else if (m) {
      searchResult = JSON.parse(m[1])
    }

    console.log('AI message result:', message.result)
    console.log('searchResult:', util.inspect(searchResult, { showHidden: false, depth: null, colors: true }))
  }
}
