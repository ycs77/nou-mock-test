import stringWidth from 'string-width'

export function printExamWithMaxWidth(content: string) {
  const maxWidth = getMaxLineWidth(content)

  // eslint-disable-next-line no-console
  console.log(
    content
      .split('\n')
      .map(line => {
        const width = stringWidth(line)
        return `${line}${' '.repeat(maxWidth - width)}  ${' '.repeat(`${maxWidth}`.length - `${width}`.length)}(${width})`
      })
      .join('\n')
  )
}
