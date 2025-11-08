# NOU Mock Test - AI Coding Agent Instructions

## Project Overview
A Nuxt 4 application that converts National Open University (空中大學) exam PDFs into interactive online mock test forms. The system extracts, parses, and renders exam questions with automatic scoring.

## Architecture

### Data Flow Pipeline
1. **PDF Upload** → `server/api/exam.post.ts` (max 1MB, validates .pdf)
2. **PDF Extraction** → `loadPdf()` extracts text from PDF using `pdf.js-extract`
3. **Serialization** → `pdfDataToString()` + `serializePdfStringToParagraphs()` normalize text
4. **Parsing** → Two parsers available (controlled by `NUXT_AI_PARSER_ENABLED`):
   - `parseExam()` - Regex-based parser (default/fallback)
   - `aiParseExam()` - Claude Agent SDK powerd AI parser (requires a locally logged-in Claude account with an active Claude Pro subscription or the API key)
5. **Validation** → Requires `title` and `subtitle` blocks
6. **Rendering** → Vue components in `app/components/Exam*.vue`
7. **Scoring** → `calculateExam()` in `shared/logic/exam.ts`

### Type System (`shared/types/exam.ts`)
- **Block hierarchy**: `Block` → `SectionBlock` → `FieldBlock` (RadioBlock | CheckboxBlock | TextareaBlock)
- **Section types**: `'是非題' | '選擇題' | '解釋名詞' | '簡答題' | '問答題' | '申論題'`
- **Key pattern**: Use `cyrb53(field.subject)` hash for field identification (avoid duplicates)
- **User answers**: Stored in `answers` object keyed by hash, synced to localStorage

### Component Architecture
- **Functional components**: `Exam.ts` and `ExamSection.ts` use `FunctionalComponent` pattern
- **Form field mapping**: Radio/Checkbox/Textarea components map to question types
- **Schema editor**: Monaco editor in `ExamSchemaEditorModal.vue` for JSON editing

## Critical Workflows

### Development
```bash
yarn dev              # Start dev server (Nuxt SSR disabled: ssr: false)
yarn test             # Run Vitest tests
yarn typecheck        # Run TypeScript checking
yarn lint             # ESLint with @ycs77/eslint-config
```

### CLI Tools (for batch processing)
```bash
# Extract text from PDF
./bin/1-load-from-pdf "/path/to/file.pdf"
# Output: file__1_loaded_from_pdf.txt

# Parse exam structure (regex-based)
./bin/2-parse-exam-data "/path/to/file.pdf"
# Requires: file__1_loaded_from_pdf.txt
# Output: file__2_parsed_exam_data.json

# Parse exam structure (AI-based)
./bin/2-ai-parse-exam-data "/path/to/file.pdf"
# Requires: file__1_loaded_from_pdf.txt
# Output: file__2_parsed_exam_data.json
```

### Test Fixtures Regeneration
```bash
yarn generate:1-load-from-pdf      # Regenerate PDF text extractions
yarn generate:2-parse-exam-data    # Regenerate parsed exam JSON
```

## Project-Specific Patterns

### Parser Logic (`shared/logic/parse.ts`)
- Hard coded regex patterns for each block type
- Recommend using the AI parser when available

### AI Parser (`shared/logic/aiParse.ts`)
- Uses `@anthropic-ai/claude-agent-sdk` with streaming responses
- Prompts include full JSON schema example and type definitions
- Extracts JSON from markdown code blocks in Claude's response

### Scoring Logic (`shared/logic/exam.ts`)
- **是非題/選擇題**: Exact match validation (supports array answers for checkbox)
- **簡答題/問答題**: Checks for non-empty user input (manual grading needed)
- Score = `field.score ?? section.scoreOfItem`

### State Management
- **No Pinia/Vuex**: Uses localStorage with `ExamStore` interface
- **Key**: `'nou-mock-exam'` stores blocks and score
- **Navigation**: Redirects based on store state (no exam → index, scored → result)

### Nuxt Configuration
- **SSR disabled**: `ssr: false` (client-only app)
- **PDF.js worker**: Custom hook copies `pdf.worker.js` to server output dir
- **Module imports**: `modules/logic.ts` auto-imports from `shared/logic/`
- **Aliases**: `#shared/*` maps to `shared/*`

## Testing Conventions

### Test Structure (`test/*.test.ts`)
- Snapshot testing with Vitest for parser output validation
- Test data in `test/fixtures/` follows naming: `{semester}-{course}-{types}__{step}_{description}.{ext}`
  - Example: `112-2-linux-1ch-2ra-3tx__1_loaded_from_pdf.txt`
  - Types: `1ch` (checkbox - 複選), `2ra` (radio - 單選/是非), `3tx` (textarea - 簡答)
- PDF test files defined in `test/data/pdf-files.ts` array

### Fixture Files Pattern
1. `*__1_loaded_from_pdf.txt` - Raw extracted text
2. `*__2_parsed_exam_data.json` - Parsed block structure

## Integration Points

### Dependencies
- **@anthropic-ai/claude-agent-sdk**: AI parsing (optional, requires env config)
- **pdf.js-extract**: PDF text extraction
- **h3-formidable**: File upload handling
- **@nuxt/ui**: UI component library (Blue primary theme)
- **nuxt-monaco-editor**: JSON schema editor

### Environment Variables
```ini
NUXT_AI_PARSER_ENABLED=true  # Enable Claude AI parser (default: true)
DEBUG=true                    # Enable AI parser debug logging
```

## Common Pitfalls

1. **Hash collisions**: Always use `cyrb53(field.subject)` consistently for field keys
2. **Section type mismatch**: Scoring logic differs between question types - check section.subject
3. **Subtitle duplication**: Parser intentionally ignores non-first-page subtitles
4. **CLI execution context**: CLI scripts work from CWD or absolute paths - check both in bin scripts

## Key Files for Understanding Patterns

- **Parser template**: `shared/logic/parse.ts` - Regex parsing reference
- **Type system**: `shared/types/exam.ts` - All data structures
- **Scoring algorithm**: `shared/logic/exam.ts` - Answer validation logic
- **API endpoint**: `server/api/exam.post.ts` - Upload flow and validation
- **Test examples**: `test/parse.test.ts` - Parser validation pattern
